import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { prisma } from "../lib/prisma";
import { verifyToken } from "../utils/jwt";
import type { Role } from "../../generated/prisma/client";

// Make `req.user` available across the app without type errors.
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const auth = (...roles: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Try to read the access token from cookies first,
            // then the refresh token cookie, then the Authorization header.
            let token =
                req.cookies?.accessToken ||
                req.cookies?.refreshToken ||
                req.headers.authorization?.split(" ")[1];

            if (!token) {
                throw new Error("You are not authorized");
            }

            const decoded = verifyToken(token, config.jwt_access_token_secret);

            const user = await prisma.user.findUnique({
                where: { email: decoded.email },
            });

            if (!user) {
                throw new Error("User does not exist");
            }

            if (user.activeStatus === "BLOCKED") {
                throw new Error("User is blocked");
            }

            if (roles.length && !roles.includes(user.role)) {
                throw new Error("You are not authorized");
            }

            req.user = decoded;
            next();
        } catch (error) {
            next(error);
        }
    };
};
