// @flow

import logger from './logger';

const log = logger('error');

export class Problem extends Error {
  title: string;
  detail: ?string;
  status: ?number;

  constructor(args: { title: string, detail?: string, status?: number }) {
    super(args.title);
    this.title = args.title;
    this.detail = args.detail;
    this.status = args.status;
  }
}

export default (async function error(ctx: Object, next: () => Promise<any>): Promise<any> {
  try {
    return await next();
  } catch (err) {
    log.error(err);
    ctx.status = err.status || err.code || 500;
    ctx.body = {
      title: err.title || err.message,
      detail: err.detail,
      status: ctx.status
    };
  }
});
