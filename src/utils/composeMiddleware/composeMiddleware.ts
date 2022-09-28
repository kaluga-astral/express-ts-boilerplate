import { compose } from 'compose-middleware';
import express from 'express';

type ComposeMiddleware = (
  middlewares: express.RequestHandler[],
) => express.RequestHandler;

// переопределены типы потому, что несовместим с express типами
// eslint-disable-next-line
export const composeMiddleware: ComposeMiddleware = compose as any;
