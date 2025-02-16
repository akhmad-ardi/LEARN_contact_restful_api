import { z, ZodType } from "zod";
import { RegisterUserRequest } from "../models/user.model";

export class UserValidation {
    static readonly REGISTER: ZodType<RegisterUserRequest> = z.object({
        username: z.string().min(3).max(255),
        password: z.string().min(6).max(255),
        name: z.string().min(3).max(255),
    })
}