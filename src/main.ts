import path from 'path';

import * as Sentry from '@sentry/node';
import express from 'express';

import { createErrorMiddleware, createLogMiddleware } from './middlewares';
import { configService, logService, validationService } from './services';

const main = () => {
  configService.init({
    envDirPath: path.resolve(process.cwd(), 'env'),
    envValidationScheme: {
      API_URL: validationService.string().url().required(),
      PORT: validationService.number().required(),
      ENV_NAME: validationService.string().required(),
    },
  });

  const { port, envName, monitoringErrorConfig } = configService.config;

  const app = express();

  if (envName !== 'local') {
    Sentry.init(monitoringErrorConfig);
  }

  app.use(createLogMiddleware());

  app.use('/', (req, res) => {
    logService.reqInfo(req, 'Hello!');
    res.send(200);
  });

  // errors middlewares
  app.use(Sentry.Handlers.errorHandler());
  app.use(createErrorMiddleware());

  app.listen(port, () => {
    logService.info(`App listening on port: ${port}`);
  });
};

main();
