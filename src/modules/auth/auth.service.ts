import bcrypt from "bcryptjs";
import type { SignOptions } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { createToken, verifyToken } from "../../utils/jwt";
import type { ILoginUser } from "./auth.interface";

const loginUser = async (payload: ILoginUser) => {
    const { email, password } = payload;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error("User does not exist");
    }

    if (user.activeStatus === "BLOCKED") {
        throw new Error("User is blocked");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new Error("Invalid credentials");
    }

    const jwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_token_secret,
        config.jwt_expires_in as SignOptions["expiresIn"]
    );

    const refreshToken = createToken(
        jwtPayload,
        config.jwt_refresh_token_secret,
        config.jwt_refresh_expires_in as SignOptions["expiresIn"]
    );

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};

// POST /api/auth/refresh-token  — no middleware, reads refreshToken from cookies
const refreshToken = async (_token: string) => {
    // TODO: verify the refresh token
    const decoded = verifyToken(_token, config.jwt_refresh_token_secret);
    // TODO: check user still exists and is active
    const user = await prisma.user.findUniqueOrThrow({
        where: { email: decoded.email },
    });

    if(user.activeStatus === "BLOCKED") {
        throw new Error("User is blocked");
    }
    // TODO: generate and return a new access token

    const jwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_token_secret,
        config.jwt_expires_in as SignOptions["expiresIn"]
    );

    return {
        accessToken
    };
};

export const AuthServices = {
    loginUser,
    refreshToken,
};
