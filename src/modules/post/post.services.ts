import { prisma } from "../../lib/prisma";
import type { ICreatePost, IPostStats, IUpdatePost } from "./post.interface";
import { PostStatus, CommentStatus } from "../../../generated/prisma/enums";

// GET /api/posts  — public
const getAllPostsFromDB = async () => {
    const posts = await prisma.post.findMany({
        include: {
            author: {
                omit: {
                    password: true
                },
                include: {
                    profile: true
                }
            },
            comments: true
        }
    })

    return posts;
};

// GET /api/posts/:postId  — public
const getSinglePostFromDB = async (postId: string) => {

    await prisma.post.findUniqueOrThrow({ where: { id: postId } })
    const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
            views: { increment: 1 }
        },
        include: {
            author: {
                omit: {
                    password: true
                },
                include: {
                    profile: true
                }
            },
            comments: true
        }
    })


    return updatedPost;
};

// POST /api/posts  — user, admin
const createPostIntoDB = async (userId: string, payload: ICreatePost) => {

    const createdPost = await prisma.post.create({
        data: {
            ...payload,
            authorId: userId
        }
    });

    if (!createdPost) {
        throw new Error('Failed to create post');
    }

    return createdPost;
};

// GET /api/posts/my-posts  — user, admin
const getMyPostsFromDB = async (_userId: string) => {
    

    const transactionResule = await prisma.$transaction(
        async (tx) => {
           const post =  tx.post.findMany({
                where: {
                    authorId: _userId
                },
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    author: {
                        omit: {
                            password: true
                        },
                        include: {
                            profile: true
                        }
                    },
                    comments: true,
                    _count: {
                        select: {
                            comments: true
                        }
                    }

                }
            });
            return post;
        }
    )

    return transactionResule;

    
};

// GET /api/posts/stats  — user, admin
const getPostStatsFromDB = async (): Promise<IPostStats> => {
    const stats = await prisma.$transaction(async (tx) => {
        const [
            totalPosts,
            totalPublishedPosts,
            totalDraftPosts,
            totalArchivedPosts,
            totalViewsResult,
            totalComments,
            totalApprovedComments,
            totalRejectedComments,
            totalPendingComments,
        ] = await Promise.all([
            tx.post.count(),
            tx.post.count({ where: { status: PostStatus.PUBLISHED } }),
            tx.post.count({ where: { status: PostStatus.DRAFT } }),
            tx.post.count({ where: { status: PostStatus.ARCHIVED } }),
            tx.post.aggregate({ _sum: { views: true } }),
            tx.comment.count(),
            tx.comment.count({ where: { status: CommentStatus.APPROVED } }),
            tx.comment.count({ where: { status: CommentStatus.REJECTED } }),
            tx.comment.count({ where: { status: CommentStatus.PENDING } }),
        ]);

        return {
            totalPosts,
            totalPublishedPosts,
            totalDraftPosts,
            totalArchivedPosts,
            totalViews: totalViewsResult._sum.views ?? 0,
            totalComments,
            totalApprovedComments,
            totalRejectedComments,
            totalPendingComments,
        };
    });

    return stats;
};

// PATCH /api/posts/:postId  — user, admin
const updatePostIntoDB = async (postId: string, userId: string, payload: IUpdatePost, isAdmin: boolean) => {
    const post = await prisma.post.findUniqueOrThrow({ where: { id: postId } });

    if (post.authorId !== userId && !isAdmin) {
        throw new Error('You are not authorized to update this post');
    }

    const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: payload
    });

    return updatedPost;
};

// DELETE /api/posts/:postId  — user, admin
const deletePostFromDB = async (postId: string, userId: string) => {
    // TODO: delete post (check ownership or admin)
};

export const postService = {
    getAllPostsFromDB,
    getSinglePostFromDB,
    getMyPostsFromDB,
    getPostStatsFromDB,
    createPostIntoDB,
    updatePostIntoDB,
    deletePostFromDB,
};
