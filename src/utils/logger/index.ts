import Logger from './config';

const stream = {
  write: (message: string) => {
    Logger.http(message.trim());
  },
};

const logError = (error: Error, context?: string) => {
  Logger.error({
    message: error.message,
    stack: error.stack,
    context,
  });
};

const logInfo = (message: string, meta?: any) => {
  Logger.info({
    message,
    ...meta,
  });
};

const logWarning = (message: string, meta?: any) => {
  Logger.warn({
    message,
    ...meta,
  });
};

const logDebug = (message: string, meta?: any) => {
  Logger.debug({
    message,
    ...meta,
  });
};

const logHttp = (message: string, meta?: any) => {
  Logger.http({
    message,
    ...meta,
  });
};

export {
  Logger,
  stream,
  logError,
  logInfo,
  logWarning,
  logDebug,
  logHttp,
}; 