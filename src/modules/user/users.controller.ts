import type { Request, Response } from "express";
import { userService } from "./users.services";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";



const registerUser = catchAsync(
    async (req: Request, res: Response) => {
        const user = await userService.registerUserIntoDB(req.body);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'User registered successfully',
            data: { user }
        })
    }
)

const getMyProfile = catchAsync(
    async (req: Request, res: Response) => {
        const user = await userService.getMyProfileFromDB(req.user!.email);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'Profile retrieved successfully',
            data: { user }
        })
    }
)

const updateMyProfile = catchAsync(
    async (req: Request, res: Response) => {
        const user = await userService.updateMyProfileIntoDB(req.user!.email, req.body);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'Profile updated successfully',
            data: { user }
        })
    }
)

const updateMyPassword = catchAsync(
    async (req: Request, res: Response) => {
        await userService.updateMyPasswordIntoDB(req.user!.email, req.body);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'Password updated successfully',
        })
    }
)

export const userController = {
    registerUser,
    getMyProfile,
    updateMyProfile,
    updateMyPassword,
}
