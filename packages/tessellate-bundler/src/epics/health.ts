import { Context } from 'koa';

export default async function getHealth(ctx: Context): Promise<void> {
  ctx.body = 'OK';
}
