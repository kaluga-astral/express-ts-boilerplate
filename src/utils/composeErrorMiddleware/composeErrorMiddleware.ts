import { errors } from 'compose-middleware';
import express from 'express';

type ComposeErrorMiddleware = (
  errorHandler: express.ErrorRequestHandler[],
) => express.ErrorRequestHandler;

// переопределены типы потому, что несовместим с express типами
// eslint-disable-next-line
export const composeErrorMiddleware: ComposeErrorMiddleware = errors as any;
