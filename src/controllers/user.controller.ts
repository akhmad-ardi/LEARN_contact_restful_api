import {Hono} from 'hono';
import { RegisterUserRequest } from '../models/user.model';
import { UserService } from '../services/user.service';

export const userController = new Hono();

userController.post('/users', async (c) => {
  const request = await c.req.json() as RegisterUserRequest;

  const userService = await UserService.registerUser(request);

  return c.json({ data:userService });
});