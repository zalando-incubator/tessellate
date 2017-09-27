import { Middleware } from 'koa';

/**
 * Error class for web service exceptions.
 */
export class Problem extends Error {
  public readonly title: string;
  public readonly detail?: string;
  public readonly status?: number;

  constructor(args: { title: string; detail?: string; status?: number }) {
    super(args.title);
    this.title = args.title;
    this.detail = args.detail;
    this.status = args.status;
  }

  public toJSON(): object {
    return Object.freeze({
      title: this.title,
      detail: this.detail,
      status: this.status
    });
  }

  public toString(): string {
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
