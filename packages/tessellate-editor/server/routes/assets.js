// @flow

import nconf from '../nconf'
import logger from '../logger'
import * as assets from '../assets'

const log = logger('assets')

import type Router from 'koa-router'
import type Route from '.'

export function health(router: Router): Route {
  return router
    .get('assets', '/', async (ctx, next) => {
      if (nconf.get('NODE_ENV') === 'production') {
        log.debug('Render index.html.')
        ctx.body = await assets.renderIndexHTML({
          BUNDLE_TARGET: nconf.get('BUNDLE_TARGET')
        })
      } else {
        log.warn('Skipping index route.')
        next()
      }
    })
}
