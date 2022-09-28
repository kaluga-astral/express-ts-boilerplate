import path from 'path';

import dotenv from 'dotenv';

import { validationService } from '../ValidationService';
import { LogService, logService } from '../LogService';
import { MONITORING_ERROR_DSN } from '../../constants';

type EnvConfig = {
  API_URL: string;
  PORT: number;
  ENV_NAME: string;
};

type EnvValidationScheme = Record<keyof EnvConfig, validationService.AnySchema>;

export type Config = {
  /**
   * @description Путь до api
   */
  apiUrl: string;
  /**
   * @description Порт, на котором запустится app
   */
  port: number;
  /**
   * @description Название окружения
   */
  envName: string;
  /**
   * @description Конфиг для sentry
   */
  monitoringErrorConfig: { dsn: string; environment: string };
};

/**
 * @description Отдает env приложения
 */
const getAppEnv = ({
  envDirPath,
}: {
  /**
   * @description Путь до директории с .env файлами.
   */
  envDirPath: string;
}): Partial<EnvConfig> => {
  const { ENV_NAME } = process.env;

  if (!ENV_NAME) {
    throw Error('ENV_NAME is not defined');
  }

  const { error } = dotenv.config({
    path: path.join(envDirPath, `.env.${ENV_NAME}`),
  });

  if (error) {
    throw error;
  }

  const { API_URL, PORT } = process.env;

  return { API_URL, PORT: Number(PORT), ENV_NAME };
};

const validateEnv = (
  env: Partial<EnvConfig>,
  validationScheme: EnvValidationScheme,
): EnvConfig => {
  validationService.object(validationScheme).validateSync(env);

  return env as EnvConfig;
};

/**
 * @description Сервис для работы с config. Содержит глобальную конфигурацию приложения
 */
class ConfigService {
  private logger;

  public config: Config;

  constructor(logger: LogService) {
    this.logger = logger;
    this.config = {} as Config;
  }

  /**
   * @description Валидирует env и формирует config
   * * @param {Object} params
   *  * @param {string} params.envDirPath - Путь до директории с .env файлами.
   */
  init = ({
    envDirPath,
    envValidationScheme,
  }: {
    /**
     * @description Путь до директории с .env файлами.
     */
    envDirPath: string;
    envValidationScheme: EnvValidationScheme;
  }) => {
    const env = getAppEnv({ envDirPath });

    const validatedEnv = validateEnv(env, envValidationScheme);

    this.initConfig(validatedEnv);
    this.logger.info('Config:', this.config);
  };

  private initConfig = (env: EnvConfig) => {
    this.config = {
      envName: env.ENV_NAME,
      port: env.PORT,
      apiUrl: env.API_URL,
      monitoringErrorConfig: {
        dsn: MONITORING_ERROR_DSN,
        environment: env.ENV_NAME,
      },
    };
  };
}

export const configService = new ConfigService(logService);
