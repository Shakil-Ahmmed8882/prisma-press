import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import config from "../../config";
import type { IUpdatePassword, IUpdateProfile, IUser } from "./users.interface";

const registerUserIntoDB = async (userData: IUser) => {
    const { name, email, password, profilePhoto } = userData; 


    const isUserExist =await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if(isUserExist) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));



        const createdUser = await prisma.user.create({
            data: {
                name, 
                email,
                password: hashedPassword
            }
        })
        if(!createdUser) {
            throw new Error('Failed to create user');
        }

        await prisma.profile.create({
            data: {
                userId: createdUser.id,
                profilePhoto: profilePhoto ?? null
            }
        })

        
        const user =await prisma.user.findUnique({
            where: {
                email: createdUser.email
            }, 
            omit: {
                password: true
            },
            include: {
                profile: true
            }
        })


        return user; 

}


const getMyProfileFromDB = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { email },
        omit: {
            password: true,
        },
        include: {
            profile: true,
        },
    });

    if (!user) {
        throw new Error("User does not exist");
    }

    return user;
};

const updateMyProfileIntoDB = async (email: string, payload: IUpdateProfile) => {
    const { name, bio, profilePhoto } = payload;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error("User does not exist");
    }

    const profileData: { bio?: string; profilePhoto?: string } = {};
    if (bio !== undefined) profileData.bio = bio;
    if (profilePhoto !== undefined) profileData.profilePhoto = profilePhoto;

    await prisma.$transaction(async (tx) => {
        if (name !== undefined) {
            await tx.user.update({
                where: { id: user.id },
                data: { name },
            });
        }

        if (Object.keys(profileData).length) {
            await tx.profile.update({
                where: { userId: user.id },
                data: profileData,
            });
        }
    });

    const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
        omit: {
            password: true,
        },
        include: {
            profile: true,
        },
    });

    return updatedUser;
};

const updateMyPasswordIntoDB = async (email: string, payload: IUpdatePassword) => {
    const { oldPassword, newPassword } = payload;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error("User does not exist");
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
        throw new Error("Old password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(
        newPassword,
        Number(config.bcrypt_salt_rounds)
    );

    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
    });

    return null;
};

export const userService = {
    registerUserIntoDB,
    getMyProfileFromDB,
    updateMyProfileIntoDB,
    updateMyPasswordIntoDB,
}