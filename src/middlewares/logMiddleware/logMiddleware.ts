import expressWinston from 'express-winston';

import { logService } from '../../services';

export const createLogMiddleware = () =>
  expressWinston.logger(logService.loggerConfig);
