import { Middleware } from 'koa';
import koaSend = require('koa-send');
import fs = require('mz/fs');
import path = require('path');
import { log, Problem } from 'tessellate-server';
import thenify = require('thenify');
import url = require('url');
import { File, TessellateBundle } from '../model';

const mkdirp = thenify(require('mkdirp'));

export type ExportArgs = {
  key: string;
  bundle: TessellateBundle;
};

export type FetchArgs = {
  domain: string;
  name: string;
};

export type PublishResult = {
  js: string[];
  css: string[];
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

  public getReadHandler(): Middleware {
    if (this.target.protocol === 'file:') {
      const root = path.resolve(process.cwd(), this.targetPath);
      return async ctx => {
        const { key } = ctx.params;
        if ((typeof key === 'string' && key.endsWith('.js')) || key.endsWith('.css')) {
          // Send a single file.
          log.debug('Send %s', key);
          await koaSend(ctx, key, { root, gzip: true });
        } else {
          // Send the file collection.
          try {
            const files = await this.list(key);
            const js = files.filter(file => file.endsWith('.js'));
            const css = files.filter(file => file.endsWith('.css'));
            ctx.body = { js, css };
          } catch (e) {
            if (e.code === 'ENOENT') {
              ctx.status = 404;
            } else {
              throw new ContentProblem(e.message);
            }
          }
        }
      };
    } else {
      return async ctx => {
        ctx.status = 501; // not implemented
      };
    }
  }

  public async read(key: string): Promise<Buffer> {
    log.debug('Read %s', key);

    if (this.target.protocol === 'file:') {
      const filePath = path.join(this.targetPath, key);
      return fs.readFile(path.resolve(process.cwd(), filePath));
    } else {
      throw new ContentProblem(`Illegal target protocol ${this.target.protocol || '???'}`);
    }
  }

  public async list(key: string): Promise<string[]> {
    if (this.target.protocol === 'file:') {
      const basePath = path.join(this.targetPath, key);
      log.debug('List %s', basePath);

      const files = await fs.readdir(path.resolve(process.cwd(), basePath));
      return files.map(file => path.join(basePath, file));
    } else {
      throw new ContentProblem(`Illegal target protocol ${this.target.protocol || '???'}`);
    }
  }

  public async publish(args: ExportArgs): Promise<PublishResult> {
    log.debug('Publish to %s', args.key);

    if (this.target.protocol === 'file:') {
      return await this.publishToFileSystem(this.targetPath, args);
    } else {
      throw new ContentProblem(`Illegal target protocol ${this.target.protocol || '???'}`);
    }
  }

  private get targetPath(): string {
    if (this.target.hostname && this.target.pathname) {
      return path.join(this.target.hostname, this.target.pathname);
    } else if (this.target.pathname) {
      return this.target.pathname;
    } else {
      throw new ContentProblem('Undefined target path.');
    }
  }

  private async publishToFileSystem(targetPath: string, args: ExportArgs): Promise<PublishResult> {
    const basePath = path.join(targetPath, args.key);
    log.debug(`Write bundle to ${basePath}`);

    await mkdirp(basePath);
    const js = await this.writeFiles(basePath, args.bundle.js);
    const css = await this.writeFiles(basePath, args.bundle.css);

    return { js, css };
  }

  private async writeFiles(basePath: string, files: File[]): Promise<string[]> {
    return Promise.all(
      files.map(file => {
        const filePath = path.join(basePath, file.name);
        fs.writeFile(path.resolve(process.cwd(), filePath), file.data);
        return filePath;
      })
    );
  }
}
