// @flow

import dispatch from '../dispatch';
import { FETCH_BUNDLE, RENDER_BUNDLE, FETCH_CONTENT } from '../actions/fragment';
import { resolveSources } from '../actions/sources-resolver';

import type Router from 'koa-router';
import type Route from '.';

export function fragment(router: Router): Route {
  return router.get('fragment', '/fragment', async ctx => {
    const { headers, query } = ctx.request;
    const sources = await resolveSources(headers, query);
    const { bundle, props } = await dispatch(FETCH_BUNDLE, { sources, headers });

    const content = await dispatch(FETCH_CONTENT, { sources });
    props.content = content;

    const { html } = await dispatch(RENDER_BUNDLE, { bundle, props });

    ctx.set({
      'Content-Type': 'text/html;charset=utf-8',
      Link: [
        `<${bundle.links.css}>; rel="stylesheet"`,
        `<${bundle.links.js}>; rel="fragment-script"`
      ]
    });
    ctx.body = html;
  });
}
