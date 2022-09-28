import expressWinston from 'express-winston';

import { composeErrorMiddleware } from '../../utils';
import { logService } from '../../services';

export const createErrorMiddleware = () =>
  composeErrorMiddleware([
    expressWinston.errorLogger(logService.loggerConfig),
    // eslint-disable-next-line
    (error, request, response, next) => {
      response.status(error.statusCode || 500);
      response.send(error.message);
    },
  ]);
