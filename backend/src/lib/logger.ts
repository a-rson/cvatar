import pino from "pino";
import { config } from "../config";

export const loggerOptions = config.isDev
  ? {
      level: config.logLevel,
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },
    }
  : {
      level: config.logLevel,
    };

// Create base logger instance
const baseLogger = pino(loggerOptions);

// Extend with custom devDebug method
export const logger = Object.assign(baseLogger, {
  devDebug: (...args: Parameters<typeof baseLogger.debug>) => {
    if (config.isDev) {
      baseLogger.debug.apply(baseLogger, args);
    }
  },
});
