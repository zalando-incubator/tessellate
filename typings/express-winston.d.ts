// Type definitions for express-winston 2.x
// Project: https://github.com/bithavoc/express-winston
// Definitions by: mfellner <https://github.com/mfellner>

declare module 'express-winston' {
  import { IncomingMessage, ServerResponse } from 'http'
  import { TransportInstance, LoggerInstance } from 'winston'

  export = expressWinston;

  const expressWinston: expressWinston.ExpressWinston;

  namespace expressWinston {
    export interface Options {
      transports?: TransportInstance[];
      winstonInstance?: LoggerInstance;
      level?: string;
      msg?: string;
      expressFormat?: boolean;
      colorize?: boolean;
      meta?: boolean;
      baseMeta?: Object;
      metaField?: string;
      statusLevels?: boolean | Object;
      ignoreRoute?: (req: IncomingMessage, res: ServerResponse) => boolean;
      skip?: (req: IncomingMessage, res: ServerResponse) => boolean;
      requestFilter?: <K extends keyof IncomingMessage>(req: IncomingMessage, propName: K) => IncomingMessage[K];
      responseFilter?: <K extends keyof ServerResponse>(res: ServerResponse, propName: K) => ServerResponse[K];
      requestWhitelist?: string[];
      responseWhitelist?: string[];
      bodyWhitelist?: string[];
      bodyBlacklist?: string[];
      ignoredRoutes?: string[];
      dynamicMeta?: (req: IncomingMessage, res: ServerResponse) => Object[];
    }

    interface NextFunction {
      (err?: any): void;
    }

    interface RequestHandler {
      (req: IncomingMessage, res: ServerResponse, next: NextFunction): any;
    }

    export interface ExpressWinston {
      logger(options: Options): RequestHandler;
      errorLogger(options: Options): RequestHandler;

      requestWhitelist: string[];
      bodyWhitelist: string[];
      bodyBlacklist: string[];
      responseWhitelist: string[];
      ignoredRoutes: string[];
      defaultRequestFilter<K extends keyof IncomingMessage>(req: IncomingMessage, propName: K): IncomingMessage[K];
      defaultResponseFilter<K extends keyof ServerResponse>(res: ServerResponse, propName: K): ServerResponse[K];
      defaultSkip(req: IncomingMessage, res: ServerResponse): false;
    }
  }
}
