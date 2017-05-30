import { Middleware } from 'koa';

/**
 * Error class for web service exceptions.
 */
export class Problem extends Error {
  readonly title: string;
  readonly detail?: string;
  readonly status?: number;

  constructor(args: { title: string, detail?: string, status?: number }) {
    super(args.title);
    this.title = args.title;
    this.detail = args.detail;
    this.status = args.status;
  }

  toJSON(): object {
    return Object.freeze({
      title: this.title,
      detail: this.detail,
      status: this.status
    })
  }

  toString(): string {
    return JSON.stringify(this.toJSON());
  }
}

/**
 * Create an error handling middleware.
 */
export default function middleware(): Middleware {
  return (ctx, next) =>
    next().catch(err => {
      ctx.status = err.status || err.code || 500;
      ctx.body = new Problem({
        title: err.title || err.name,
        detail: err.detail || err.message,
        status: ctx.status
      });
    });
}
