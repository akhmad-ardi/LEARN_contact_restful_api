import { User } from "@prisma/client";

export type RegisterUserRequest = {
    username: string;
    password: string;
    name: string;
}

export type LoginUserRequest = {
    username: string;
    password: string;
}

export type UserResponse = {
    username: string;
    name: string;
    token?: string;
}

export function toUserResponse(user: User & { token?: string }): UserResponse {
    const data: UserResponse = {
        username: user.username,
        name: user.name,
    };

    if (user.token) {
        data.token = user.token;
    }

    return data;
}