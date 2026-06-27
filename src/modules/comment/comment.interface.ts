
export interface ICreateComment {
    postId: string;
    content: string;
}

export interface IUpdateComment {
    content?: string;
}

export interface IModerateComment {
    status: string;
}
