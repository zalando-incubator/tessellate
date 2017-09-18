import { Context } from 'koa';
import { conf, log } from 'tessellate-server';
import * as bundleService from '../bundle-service';
import * as contentService from '../content-service';
import * as scriptBuilder from '../script-builder';
import TessellateBundle from '../TessellateBundle';
import TessellateElement from '../TessellateElement';

type ParsedRequest = { domain: string; name: string; element: TessellateElement };
type CreatedBundle = { domain: string; name: string; bundle: TessellateBundle };
type ResponseBody = { js: string; css?: string };
type CreatedResponse = { body: ResponseBody; status: number };

function parseOptions(): bundleService.Options {
  const packages = conf.getObject('npmModules', []) as string[];
  const externalsList = conf.getObject('npmExternals', []) as string[];
  const externals = externalsList.reduce((exts, ext) => Object.assign(exts, { [ext]: ext }), {} as {
    [key: string]: string;
  });
  const production = process.env.NODE_ENV === 'production';

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
  log.debug('Epics:bundle: Parsed request %s/%s', domain, name);
  return { domain, name, element };
}

async function compileBundle(req: Promise<ParsedRequest>): Promise<CreatedBundle> {
  const { domain, name, element } = await req;
  const source = scriptBuilder.build(element);
  const bundle = await bundleService.make(source, parseOptions());
  log.debug('Epics:bundle: Created bundle');
  return { domain, name, bundle };
}

async function exportBundle(createdBundle: Promise<CreatedBundle>): Promise<ResponseBody> {
  const { domain, name, bundle } = await createdBundle;
  const { js, css } = await contentService.publish({ domain, name, bundle });
  log.debug('Epics:bundle: Published bundle');
  return { js, css };
}

async function createReponse(responseBody: Promise<ResponseBody>): Promise<CreatedResponse> {
  const { js, css } = await responseBody;
  return {
    body: { js, css },
    status: 201
  };
}

export default async function createBundle(ctx: Context): Promise<void> {
  const { body, status } = await createReponse(exportBundle(compileBundle(parseRequest(ctx))));
  ctx.status = status;
  ctx.body = body;
}
