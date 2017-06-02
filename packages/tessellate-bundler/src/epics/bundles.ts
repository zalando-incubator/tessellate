import { Context } from 'koa';
import { conf, log } from 'tessellate-server';
import * as bundleService from '../bundle-service';
import * as contentService from '../content-service';
import * as scriptBuilder from '../script-builder';
import TessellateBundle from '../TessellateBundle';
import TessellateElement from '../TessellateElement';

type ParsedRequest = { domain: string; name: string; element: TessellateElement; };
type CreatedBundle = { domain: string; name: string; bundle: TessellateBundle; };
export type ResponseBody = { js: string; css?: string; };
export type CreatedResponse = { body: ResponseBody; status: number; };

function parseOptions() {
  const packages = conf.getObject('NPM_MODULES');
  const externalsList = conf.getObject('NPM_EXTERNALS') as string[];
  const externals = externalsList.reduce((exts: object, ext) => Object.assign(exts, { [ext]: ext }), {});
  const production = conf.get('NODE_ENV') === 'production';

  return {
    cssSupport: true,
    production,
    packages,
    externals
  };
}

async function parseRequest(ctx: Context): Promise<ParsedRequest> {
  const { domain, name } = ctx.params;
  const element = ctx.request.body;
  log.debug('Parsed request %s/%s', domain, name);
  return { domain, name, element };
}

async function createBundle(req: Promise<ParsedRequest>): Promise<CreatedBundle> {
  const { domain, name, element } = await req;
  const source = scriptBuilder.build(element);
  const bundle = await bundleService.make(source, parseOptions());
  log.debug('created bundle');
  return { domain, name, bundle };
}

async function exportBundle(createdBundle: Promise<CreatedBundle>): Promise<ResponseBody> {
  const { domain, name, bundle } = await createdBundle;
  const { js, css } = await contentService.publish({ domain, name, bundle });
  log.debug('published bundle');
  return { js, css };
}

async function createReponse(responseBody: Promise<ResponseBody>): Promise<CreatedResponse> {
  const { js, css } = await responseBody;
  return {
    body: { js, css },
    status: 201
  };
}

// export default util.foldEpics(parseRequest, createBundle, exportBundle, createReponse);
export default function(ctx: Context): Promise<CreatedResponse> {
  return createReponse(exportBundle(createBundle(parseRequest(ctx))));
}
