import type { PostStatus } from "../../../generated/prisma/enums";

export interface ICreatePost {
    title: string;
    content: string;
    thumbnail?: string;
    isFeatured?: boolean;
    status: PostStatus; 
    tags: string[];
}

export type IUpdatePost = Partial<ICreatePost>;

export interface IPostStats {
    totalPosts: number;
    totalPublishedPosts: number;
    totalDraftPosts: number;
    totalArchivedPosts: number;
    totalViews: number;
    totalComments: number;
    totalApprovedComments: number;
    totalRejectedComments: number;
    totalPendingComments: number;
}