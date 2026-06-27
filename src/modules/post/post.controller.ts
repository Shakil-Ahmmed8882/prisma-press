import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { postService } from "./post.services";
import httpStatus from "http-status";

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
    const post = await postService.updatePostIntoDB(req.params.postId as string, req.user!.userId, req.body);

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
    createPost,
    updatePost,
    deletePost,
};
