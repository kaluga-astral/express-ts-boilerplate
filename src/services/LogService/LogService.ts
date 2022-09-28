import winston, { LeveledLogMethod, Logger } from 'winston';
import express from 'express';

export class LogService {
  private readonly logger: Logger;

  public info: Logger['info'];
  public error: Logger['error'];

  loggerConfig = {
    transports: [new winston.transports.Console()],
    expressFormat: true,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.simple(),
    ),
  };

  constructor() {
    this.logger = winston.createLogger(this.loggerConfig);
    this.info = this.logger.info.bind(this.logger);
    this.error = this.logger.error.bind(this.logger);
  }

  /**
   * @description Создает строку для отображения message, прикрепленного к express req
   */
  private createReqLogString = (req: express.Request, message: string) =>
    `${req.method} ${req.headers.referer || req.originalUrl}: ${message}`;

  /**
   * @description Логирует message с привязкой к req
   */
  reqInfo = (req: express.Request, message: string) => {
    this.info(this.createReqLogString(req, message));
  };

  /**
   * @description Логирует message ошибки с привязкой к req
   */
  reqError = (req: express.Request, message: string) => {
    this.error(this.createReqLogString(req, message));
  };
}

export const logService = new LogService();
