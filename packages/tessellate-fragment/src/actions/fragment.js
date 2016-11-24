// @flow

import path from 'path'
import { register } from '../dispatch'
import { Problem } from '../error'
import * as bundleService from '../bundle-service'
import * as renderService from 'tessellate-renderer'

type SkipperArgs = {|
  language: string;
  referer: string;
  userAgent: string;
  requestURI: string;
  requestHost: string;
  customer: string;
|}

class FragmentProblem extends Problem {
  constructor(detail: string) {
    super({title: 'Fragment Error.', detail, status: 404})
  }
}

export const FETCH_BUNDLE = Symbol('FETCH_BUNDLE')

export const fetchBundle = register(FETCH_BUNDLE, async ({headers, query}) => {
  const skipperArgs = parseSkipperArgs(headers)
  const bundleName = parseBundleName(skipperArgs)
  const bundle = await bundleService.fetchBundle(bundleName)
  return {bundle, props: skipperArgs}
})

export const RENDER_BUNDLE = Symbol('RENDER_BUNDLE')

export const renderBundle = register(RENDER_BUNDLE, async ({bundle, props}) => {
  const html = renderService.renderToStaticMarkup(bundle.source, props)
  return {html}
})

function parseBundleName(skipper: SkipperArgs): string {
  if (!skipper.requestURI) throw new FragmentProblem('Request URI not present.')
  if (!skipper.requestHost) throw new FragmentProblem('Request Host not present.')

  return path.join(skipper.requestHost.replace(/^www\./, ''), skipper.requestURI)
}

function parseSkipperArgs(headers: Object): SkipperArgs {
  return {
    language: headers['accept-language'],
    referer: headers['referer'],
    userAgent: headers['user-agent'],
    requestURI: headers['x-zalando-request-uri'],
    requestHost: headers['x-zalando-request-host'],
    customer: headers['x-zalando-customer']
  }
}
