// @flow

import dispatch from '../dispatch'
import { FETCH_BUNDLE, RENDER_BUNDLE } from '../actions/fragment'

import type Router from 'koa-router'
import type Route from '.'

export function health(router: Router): Route {
  return router.get('fragment', '/fragment', async (ctx) => {
    const {headers, query} = ctx.request
    const {bundle, props} = await dispatch(FETCH_BUNDLE, {headers, query})
    const {html} = await dispatch(RENDER_BUNDLE, {bundle, props})

    ctx.set({
      'Content-Type': 'text/html;charset=utf-8',
      'Link': [
        `<${bundle.links.css}>; rel="stylesheet"`,
        `<${bundle.links.js}>; rel="fragment-script"`
      ]
    })
    ctx.body = html
  })
}
