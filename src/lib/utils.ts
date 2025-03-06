import * as jwt from "jsonwebtoken";

export class Jwt {
    static async sign(payload: object, options?: jwt.SignOptions): Promise<string> {
        return jwt.sign(payload, process.env.SECRET_KEY as string || "secret", options);
    }

    static async verify(token: string): Promise<jwt.JwtPayload> {
        return jwt.verify(token, process.env.SECRET_KEY as string || "secret") as jwt.JwtPayload;
    }
}