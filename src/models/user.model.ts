import { User } from "@prisma/client";

export type RegisterUserRequest = {
    username: string;
    password: string;
    name: string;
}

export type UserResponse = {
    username: string;
    name: string;
    token?: string;
}

export function toUserResponse(user: User): UserResponse {
    return {
        username: user.username,
        name: user.name,
    }
}