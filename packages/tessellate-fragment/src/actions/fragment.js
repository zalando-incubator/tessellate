// @flow

import { register } from '../dispatch';
import * as bundleService from '../bundle-service';
import * as contentService from '../content/content-service';
import renderToString from 'tessellate-render';

type SkipperArgs = {|
  language: string,
  referer: string,
  userAgent: string,
  requestURI: string,
  requestHost: string,
  customer: string
|};

export const FETCH_BUNDLE = Symbol('FETCH_BUNDLE');

export const fetchBundle = register(FETCH_BUNDLE, async ({ sources, headers }) => {
  const skipperArgs = parseSkipperArgs(headers);
  const bundle = await bundleService.fetchBundle(sources);
  return { bundle, props: skipperArgs };
});

export const RENDER_BUNDLE = Symbol('RENDER_BUNDLE');

export const renderBundle = register(RENDER_BUNDLE, async ({ bundle, props }) => {
  const html = renderToString(bundle.source, props);
  return { html };
});

export const FETCH_CONTENT = Symbol('FETCH_CONTENT');

export const fetchContent = register(FETCH_CONTENT, async ({ sources }) => {
  return await contentService.fetchContent(sources);
});

function parseSkipperArgs(headers: Object): SkipperArgs {
  return {
    language: headers['accept-language'],
    referer: headers['referer'],
    userAgent: headers['user-agent'],
    requestURI: headers['x-zalando-request-uri'],
    requestHost: headers['x-zalando-request-host'],
    customer: headers['x-zalando-customer']
  };
}
