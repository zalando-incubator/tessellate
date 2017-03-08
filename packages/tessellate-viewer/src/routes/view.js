// @flow

import * as fragmentService from '../fragment-service';
import * as templateService from '../template-service';

import type Router from 'koa-router';
import type Route from '.';

export function health(router: Router): Route {
  return router.get('view', '/:domain/:name', async ctx => {
    const { domain, name } = ctx.params;
    const { html, link } = await fragmentService.fetchFragment(domain, name);
    const fragment = {
      name,
      src: link.js,
      css: link.css,
      html
    };
    const renderedHTML = await templateService.renderView(fragment);
    ctx.body = renderedHTML;
  });
}
