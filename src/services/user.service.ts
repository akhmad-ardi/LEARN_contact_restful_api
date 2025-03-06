import { HTTPException } from "hono/http-exception";
import { LoginUserRequest, RegisterUserRequest, toUserResponse, UserResponse } from "../models/user.model";
import { UserValidation } from "../validations/user.validation";
import { prismaClient } from "../application/database";
import { Jwt } from "../lib/utils";
import { logger } from "../application/logging";

export class UserService {
    static async registerUser(request: RegisterUserRequest): Promise<UserResponse> {
        // validate request
        request = UserValidation.REGISTER.parse(request);

        // check if username is already taken
        const totalUser = await prismaClient.user.count({
            where: {
                username: request.username,
            },
        });
        if (totalUser !== 0) {
            throw new HTTPException(400, { message: "Username is already taken" });
        }
        
        // hash password
        request.password = await Bun.password.hash(request.password, {
            algorithm: "bcrypt",
            cost: 10,
        });
        
        // save user to database
        const user = await prismaClient.user.create({
            data: request,
        });
    
        logger.error("User created", user);
    
        return toUserResponse(user);
    }

    static async loginUser(request: LoginUserRequest): Promise<UserResponse> {
        // validate request
        request = UserValidation.LOGIN.parse(request);
    
        // find user by username
        const user = await prismaClient.user.findUnique({
            where: {
                username: request.username,
            },
        });
        if (!user) {
            throw new HTTPException(404, { message: "User not found" });
        }

        // compare password
        const isValidPassword = await Bun.password.verify(request.password, user.password);
        if (!isValidPassword) {
            throw new HTTPException(400, { message: "Username or password is not match" });
        }

        const token = await Jwt.sign({ username: user.username }, { expiresIn: "7d" });

        return toUserResponse({...user, token});
    }

    static async get(token: string) {
        const decode = await Jwt.verify(token);

        const user = await prismaClient.user.findUnique({ where: { username: decode.username } });
        if (!user) {
            throw new HTTPException(404, { message: "User not found" });
        }

        return user;
    }
}