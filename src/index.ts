import { Hono } from 'hono';
import { userController } from './controllers/user.controller';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';
import { JsonWebTokenError } from 'jsonwebtoken';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.route('/api', userController);

app.onError(async (err, c) => {
  if (err instanceof HTTPException) {
      c.status(err.status);
      return c.json({
          errors: err.message
      });
  } else if (err instanceof ZodError) {
      c.status(400);
      return c.json({
          errors: err.errors.map((err) => err.message)
      });
  } else if (err instanceof JsonWebTokenError) {
    c.status(401);
    return c.json({
        errors: err.message
    });
  } else {
      c.status(500);
      return c.json({
          errors: err.message
      });
  }
});

export default app;
