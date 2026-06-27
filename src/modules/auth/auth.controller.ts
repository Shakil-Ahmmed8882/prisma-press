


import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
const login = catchAsync(async (req: Request, res: Response) => {

  const { accessToken, refreshToken, user } = await AuthServices.loginUser(req.body);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none", 
    maxAge: 1000 * 60 * 60 * 24 , // 1 day
  })

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none", 
    maxAge: 1000 * 60 * 60 * 24 * 7 , // 7 days
  })



  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    data: { accessToken, refreshToken, user },
  })
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;

  const result = await AuthServices.refreshToken(token);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Access token refreshed successfully",
    data: result,
  });
});

export const AuthController = {
  login,
  refreshToken,
};