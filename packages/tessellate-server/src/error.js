// @flow

import type { Middleware } from 'koa'

export class Problem extends Error {
  title: string;
  detail: ?string;
  status: ?number;

  constructor(args: {title: string; detail?: string; status?: number;}) {
    super(args.title)
    this.title = args.title
    this.detail = args.detail
    this.status = args.status
  }

  toString(): string {
    return `${this.status || ''} ${this.title} ${this.detail || ''}`.trim()
  }
}

export default function middleware(): Middleware {
  return async (ctx, next) => next().catch(err => {
    ctx.status = err.status || err.code || 500
    ctx.body = {
      title: err.title || err.name,
      detail: err.detail ||  err.message,
      status: ctx.status
    }
  })
}
