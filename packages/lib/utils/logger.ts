import { Logger, createLogger, format, transports } from 'winston';

const level = process.env.LOG_LEVEL || 'info';

export function createDefaultLogger(): Logger {
  return createLogger({
    level,
    transports: [
      new transports.Console({
        format: format.combine(
          format.timestamp(),
          format.align(),
          format.colorize(),
          format.simple(),
        ),
      }),
    ],
  });
}

const logger = createDefaultLogger();
export default logger;
