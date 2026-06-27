import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { commentService } from "./comment.services";
import httpStatus from "http-status";

const getCommentsByAuthor = catchAsync(async (req: Request, res: Response) => {
    const comments = await commentService.getCommentsByAuthorFromDB(req.params.authorId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Comments retrieved successfully",
        data: comments,
    });
});

const getSingleComment = catchAsync(async (req: Request, res: Response) => {
    const comment = await commentService.getSingleCommentFromDB(req.params.commentId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Comment retrieved successfully",
        data: comment,
    });
});

const createComment = catchAsync(async (req: Request, res: Response) => {
    const comment = await commentService.createCommentIntoDB(req.user!.userId, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Comment created successfully",
        data: comment,
    });
});

const updateComment = catchAsync(async (req: Request, res: Response) => {
    const comment = await commentService.updateCommentIntoDB(req.params.commentId as string, req.user!.userId, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Comment updated successfully",
        data: comment,
    });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
    await commentService.deleteCommentFromDB(req.params.commentId as string, req.user!.userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Comment deleted successfully",
    });
});

const moderateComment = catchAsync(async (req: Request, res: Response) => {
    const comment = await commentService.moderateCommentIntoDB(req.params.commentId as string, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Comment moderated successfully",
        data: comment,
    });
});

export const commentController = {
    getCommentsByAuthor,
    getSingleComment,
    createComment,
    updateComment,
    deleteComment,
    moderateComment,
};
