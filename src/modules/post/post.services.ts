import type { ICreatePost, IUpdatePost } from "./post.interface";

// GET /api/posts  — public
const getAllPostsFromDB = async () => {
    // TODO: fetch all posts with author info and pagination
};

// GET /api/posts/:postId  — public
const getSinglePostFromDB = async (postId: string) => {
    // TODO: fetch single post by id
};

// POST /api/posts  — user, admin
const createPostIntoDB = async (userId: string, payload: ICreatePost) => {
    // TODO: create post linked to userId
};

// PATCH /api/posts/:postId  — user, admin
const updatePostIntoDB = async (postId: string, userId: string, payload: IUpdatePost) => {
    // TODO: update post (check ownership or admin)
};

// DELETE /api/posts/:postId  — user, admin
const deletePostFromDB = async (postId: string, userId: string) => {
    // TODO: delete post (check ownership or admin)
};

export const postService = {
    getAllPostsFromDB,
    getSinglePostFromDB,
    createPostIntoDB,
    updatePostIntoDB,
    deletePostFromDB,
};
