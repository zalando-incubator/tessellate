// @flow

import url from 'url'
import path from 'path'
import { register } from '../dispatch'
import { Problem } from '../error'
import * as bundleService from '../bundle-service'
import * as renderService from '../render-service'

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

export default register('fragment', async ({headers, query}) => {
  const response = {}
  const skipperArgs = parseSkipperArgs(headers)
  const bundleName = parseBundleName(skipperArgs)
  const bundle = await bundleService.fetchBundle(bundleName)
  const html = renderService.renderToStaticMarkup(bundle.source, skipperArgs)

  response.headers = {
    'Content-Type': 'text/html;charset=utf-8',
    'Link': [
      `<${bundle.links.css}>; rel="stylesheet"`,
      `<${bundle.links.js}>; rel="fragment-script"`
    ]
  }
  response.body = html

  return response
})

function parseBundleName(skipper: SkipperArgs): string {
  if (!skipper.requestURI) throw new FragmentProblem('Request URI not present.')

  const {hostname, pathname} = url.parse(skipper.requestURI)

  if (hostname && pathname) return path.join(hostname.replace(/^www\./, ''), pathname)
  else throw new FragmentProblem(`Illegal URI '${skipper.requestURI}'`)
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
