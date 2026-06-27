
export interface ICreatePost {
    title: string;
    content: string;
    category?: string;
}

export interface IUpdatePost {
    title?: string;
    content?: string;
    category?: string;
}
