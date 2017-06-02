import url = require('url');
import path = require('path');
import fs = require('mz/fs');
import thenify = require('thenify');
import { conf, log, Problem } from 'tessellate-server';
import TessellateBundle from './TessellateBundle';
import TessellateElement from './TessellateElement';

export type ExportArgs = {
  domain: string;
  name: string;
  bundle: TessellateBundle;
};

export type FetchArgs = {
  domain: string;
  name: string;
};

export type PublishResult = {
  js: string;
  css?: string;
};

class ContentProblem extends Problem {
  constructor(detail: string) {
    super({ title: 'Content error.', detail, status: 400 });
  }
}

const mkdirp = thenify(require('mkdirp'));

export async function publish(args: ExportArgs): Promise<PublishResult> {
  log.debug('Publish %s/%s', args.domain, args.name);
  const target = url.parse(conf.getString('publishTarget', ''));

  if (target.protocol === 'file:') {
    let targetPath;
    if (target.hostname && target.pathname) {
      targetPath = path.join(target.hostname, target.pathname);
    } else if (target.pathname) {
      targetPath = target.pathname;
    } else {
      throw new ContentProblem('Undefined target path.');
    }
    return await publishToFileSystem(targetPath, args);
  } else if (target.protocol === 's3:') {
    return publishToS3(target.hostname, target.pathname);
  } else {
    throw new ContentProblem(`Illegal target protocol ${target.protocol || '???'}`);
  }
}

async function publishToFileSystem(target: string, args: ExportArgs): Promise<PublishResult> {
  const basePath = path.join(target, args.domain, args.name);
  log.debug(`Write bundle to ${basePath}`);

  const jsPath = path.join(basePath, 'index.js');
  const cssPath = path.join(basePath, 'index.css');
  const result: PublishResult = { js: path.relative(target, jsPath), css: undefined };

  await mkdirp(basePath);
  await fs.writeFile(path.resolve(process.cwd(), jsPath), args.bundle.js.source);

  if (typeof args.bundle.css === 'object' && typeof args.bundle.css.source === 'string') {
    const cssSource = args.bundle.css.source;
    await fs.writeFile(path.resolve(process.cwd(), cssPath), cssSource);
    result.css = path.relative(target, cssPath);
  }

  return result;
}

async function publishToS3(..._: any[]): Promise<PublishResult> {
  throw new Error('publishToS3 not implemented.');
}

export async function fetch(args: FetchArgs): Promise<TessellateElement> {
  log.debug('Fetch %s/%s', args.domain, args.name);
  throw new Error('fetch not implemented.');
}
