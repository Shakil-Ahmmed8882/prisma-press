import type { ICreateComment, IModerateComment, IUpdateComment } from "./comment.interface";

// GET /api/comments/author/:authorId  — public
const getCommentsByAuthorFromDB = async (authorId: string) => {
    // TODO: fetch all comments made by a specific author
};

// GET /api/comments/:commentId  — public
const getSingleCommentFromDB = async (commentId: string) => {
    // TODO: fetch a single comment by id
};

// POST /api/comments  — admin only
const createCommentIntoDB = async (userId: string, payload: ICreateComment) => {
    // TODO: create a comment linked to userId and postId
};

// PATCH /api/comments/:commentId  — user, admin
const updateCommentIntoDB = async (commentId: string, userId: string, payload: IUpdateComment) => {
    // TODO: update comment content (check ownership or admin)
};

// DELETE /api/comments/:commentId  — user, admin
const deleteCommentFromDB = async (commentId: string, userId: string) => {
    // TODO: delete comment (check ownership or admin)
};

// PATCH /api/comments/:commentId/moderate  — admin only
const moderateCommentIntoDB = async (commentId: string, payload: IModerateComment) => {
    // TODO: admin sets comment status (approved, rejected, etc.)
};

export const commentService = {
    getCommentsByAuthorFromDB,
    getSingleCommentFromDB,
    createCommentIntoDB,
    updateCommentIntoDB,
    deleteCommentFromDB,
    moderateCommentIntoDB,
};
