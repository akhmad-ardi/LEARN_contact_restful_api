import { RegisterUserRequest, toUserResponse, UserResponse } from "../models/user.model";
import { UserValidation } from "../validations/user.validation";
import { HTTPException } from "hono/http-exception"
import { prismaClient } from "../application/database";
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

        return toUserResponse(user)
    }
}