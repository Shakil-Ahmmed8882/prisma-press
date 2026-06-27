import type { NextFunction, RequestHandler } from "express";


export const catchAsync = (fn: RequestHandler) => {
    return (req: any, res: any, next: NextFunction) => {
        try {
            fn(req, res, next);
        } catch (error) {
            next(error);
        }
    }
}