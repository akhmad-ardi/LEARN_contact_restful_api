import {Hono, Context} from 'hono';
import { setCookie } from 'hono/cookie';
import {User} from '@prisma/client';
import { LoginUserRequest, RegisterUserRequest, toUserResponse } from '../models/user.model';
import { UserService } from '../services/user.service';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export const userController = new Hono();

userController.post('/users/register', async (c) => {
  const request = await c.req.json() as RegisterUserRequest;

  const userService = await UserService.registerUser(request);

  return c.json({ data:userService });
});

userController.post('/users/login', async (c: Context) => {
  const request = await c.req.json() as LoginUserRequest;

  const userService = await UserService.loginUser(request);

  setCookie(c, 'token', userService.token!);
  return c.json({ data: userService });
});

userController.use(AuthMiddleware);

userController.get('/users/current', async (c: Context) => {
  const user = c.get('user') as User;

  return c.json({
      data: toUserResponse(user)
  });
});

// userController.get('/users/update')