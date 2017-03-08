// @flow

import nconf from '../nconf';
import { util } from 'koa-router-rx';
import * as scriptBuilder from '../script-builder';
import * as bundleService from '../bundle-service';
import * as contentService from '../content-service';

import type { Epic } from 'koa-router-rx';
import type { Context, Request } from 'koa';

type ParsedReq = { body: Object } & Request;
type QueryParams = { [key: string]: string };
type RoutedContext = { params: QueryParams, request: ParsedReq } & Context;
type ParsedRequest = { domain: string, name: string, element: TessellateElement };
type CreatedBundle = { domain: string, name: string, bundle: TessellateBundle };
type ResponseBody = { js: string, css: ?string };
type CreatedResponse = { body: ResponseBody, status: number };

function parseOptions(): Object {
  const packages = nconf.getObject('NPM_MODULES');
  let externals = nconf.getObject('NPM_EXTERNALS');
  externals = externals.reduce((exts, ext) => Object.assign(exts, { [ext]: ext }), {});
  const production = nconf.get('NODE_ENV') === 'production';

  return {
    cssSupport: true,
    production,
    packages,
    externals
  };
}

const parseRequest: Epic<RoutedContext, ParsedRequest> = o => o.map(ctx => {
  const { domain, name } = ctx.params;
  const element = ctx.request.body;
  return { domain, name, element };
});

const createBundle: Epic<ParsedRequest, CreatedBundle> = o => o.flatMap(async ({
  domain,
  name,
  element
}) => {
  const source = scriptBuilder.build(element);
  const bundle = await bundleService.make(source, parseOptions());
  return { domain, name, bundle };
});

const exportBundle: Epic<CreatedBundle, ResponseBody> = o => o.flatMap(async ({
  domain,
  name,
  bundle
}) => {
  const { js, css } = await contentService.publish({ domain, name, bundle });
  return { js, css };
});

const createReponse: Epic<ResponseBody, CreatedResponse> = o => o.map(({ js, css }) => ({
  body: { js, css },
  status: 201
}));

export default util.foldEpics(parseRequest, createBundle, exportBundle, createReponse);
