import { Context, MiddlewareHandler, Next } from "hono";
import { getCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { UserService } from "../services/user.service";

export const AuthMiddleware: MiddlewareHandler = async (c: Context, next: Next) => {
    const token = getCookie(c, 'token');
    if (!token) {
        throw new HTTPException(401, { message: "Unauthorized" });
    }

    const user = await UserService.get(token);

    c.set('user', user);
    
    await next();
};
