import { Middleware } from 'koa';
import koaStatic = require('koa-static');
import fs = require('mz/fs');
import path = require('path');
import { log, Problem } from 'tessellate-server';
import thenify = require('thenify');
import url = require('url');
import { TessellateBundle } from '../model';

const mkdirp = thenify(require('mkdirp'));

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

export type Args = {
  target: string;
};

export default class ContentService {
  private readonly target: url.Url;

  constructor(args: Args) {
    this.target = url.parse(args.target);
  }

  public getRequestHandler(): Middleware | null {
    if (this.target.protocol === 'file:') {
      const { hostname, pathname } = this.target;
      if (hostname || pathname) {
        const fileSystemPublishTarget = path.resolve(
          process.cwd(),
          path.join(hostname || '', pathname || '')
        );
        return koaStatic(fileSystemPublishTarget, { defer: true, gzip: true });
      } else {
        throw new Error(`Illegal publish target ${this.target}`);
      }
    }
    return null;
  }

  public async publish(args: ExportArgs): Promise<PublishResult> {
    log.debug('Publish %s/%s', args.domain, args.name);

    if (this.target.protocol === 'file:') {
      let targetPath;
      if (this.target.hostname && this.target.pathname) {
        targetPath = path.join(this.target.hostname, this.target.pathname);
      } else if (this.target.pathname) {
        targetPath = this.target.pathname;
      } else {
        throw new ContentProblem('Undefined target path.');
      }
      return await this.publishToFileSystem(targetPath, args);
    } else if (this.target.protocol === 's3:') {
      return this.publishToS3(this.target.hostname, this.target.pathname);
    } else {
      throw new ContentProblem(`Illegal target protocol ${this.target.protocol || '???'}`);
    }
  }

  private async publishToFileSystem(target: string, args: ExportArgs): Promise<PublishResult> {
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

  private async publishToS3(..._: any[]): Promise<PublishResult> {
    throw new Error('publishToS3 not implemented.');
  }
}
