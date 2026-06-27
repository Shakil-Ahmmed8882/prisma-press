import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { postService } from "./post.services";
import httpStatus from "http-status";
import { Role } from "../../../generated/prisma/enums";

const getAllPosts = catchAsync(async (req: Request, res: Response) => {
    const posts = await postService.getAllPostsFromDB();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Posts retrieved successfully",
        data: posts,
    });
});

const getSinglePost = catchAsync(async (req: Request, res: Response) => {
    const posts = await postService.getSinglePostFromDB(req.params.postId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Post retrieved successfully",
        data: posts,
    });
});

const getMyPosts = catchAsync(async (req: Request, res: Response) => {
    const posts = await postService.getMyPostsFromDB(req.user!.userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "My posts retrieved successfully",
        data: posts,
    });
});

const getPostStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await postService.getPostStatsFromDB();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Post stats retrieved successfully",
        data: stats,
    });
});

const createPost = catchAsync(async (req: Request, res: Response) => {
    const post = await postService.createPostIntoDB(req.user!.userId, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Post created successfully",
        data: post,
    });
});

const updatePost = catchAsync(async (req: Request, res: Response) => {
    const postId = req.params.postId as string;
    const authorId = req.user!.userId;
    const isAdmin = req.user!.role === Role.ADMIN;
    const payload = req.body;
    const post = await postService.updatePostIntoDB( postId, authorId, payload, isAdmin);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Post updated successfully",
        data: post,
    });
});

const deletePost = catchAsync(async (req: Request, res: Response) => {
    await postService.deletePostFromDB(req.params.postId as string, req.user!.userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Post deleted successfully",
    });
});

export const postController = {
    getAllPosts,
    getSinglePost,
    getMyPosts,
    getPostStats,
    createPost,
    updatePost,
    deletePost,
};
