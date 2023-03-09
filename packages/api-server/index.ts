import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import cors from 'cors';
import { router, publicProcedure } from './trpc';
import { z } from 'zod';

interface IChatMessage {
  user: string;
  message: string;
}

const messages: IChatMessage[] = [
  { user: 'user1', message: 'Hello' },
  { user: 'user2', message: 'Hi' },
];

const appRouter = router({
  hello: publicProcedure.query(() => 'hello world 2'),
  getMessages: publicProcedure
    .input(z.number().default(10))
    .query(({ input }) => messages.slice(-input)),
  addMessage: publicProcedure
    .input(z.object({ user: z.string(), message: z.string() }))
    .mutation(({ input }) => {
      messages.push(input);
      return input;
    }),
});

export type AppRouter = typeof appRouter;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({});

const app = express();
const port = 8080;
app.use(cors());

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.get('/', (req, res) => {
  res.send('Hello from api-server');
});

app.listen(port, () => {
  console.log(`api-server listening at http://localhost:${port}`);
});
