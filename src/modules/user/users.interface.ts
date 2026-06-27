

export interface IUser {
    name: string;
    email: string;
    password: string;
    profilePhoto?: string;
}

export interface IUpdateProfile {
    name?: string;
    bio?: string;
    profilePhoto?: string;
}

export interface IUpdatePassword {
    oldPassword: string;
    newPassword: string;
}
