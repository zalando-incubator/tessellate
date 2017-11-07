import { Context, Middleware } from 'koa';
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
  [extname: string]: string[];
};

export type FileStats = {
  name: string;
  modified: Date;
};

class ContentProblem extends Problem {
  constructor(detail: string) {
    super({ title: 'Content error.', detail, status: 400 });
  }
}

/**
 * ContentRepository is a storage abstraction for Tessellate bundle files.
 */
export default class ContentRepository {
  private readonly target: url.Url;

  constructor(args: { target: string }) {
    this.target = url.parse(args.target);
  }

  /**
   * Get a HTTP handler to read single files or collections of files.
   */
  public getReadHandler(): Middleware {
    // TODO: delegate to a stack of tessellate-bundler middleware instead.
    if (this.target.protocol !== 'file:') {
      throw new ContentProblem(`Illegal target protocol ${this.target.protocol || '???'}`);
    }

    const root = path.resolve(process.cwd(), this.targetPath);
    return async ctx => {
      // key is a URL parameter.
      const { key } = ctx.params;
      if (typeof key === 'string' && /^\S+\.[a-z]{1,4}$/.test(key)) {
        // If the key as a file extension, send a single file.
        await this.sendFile({ ctx, root, key });
      } else if (key) {
        // Otherwise try to resolve and send the file collection.
        await this.sendCollection({ ctx, root, key });
      } else {
        throw new ContentProblem('Missing URL parameter: "key"');
      }
    };
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

  public async list(key: string): Promise<FileStats[]> {
    if (this.target.protocol === 'file:') {
      const basePath = path.join(this.targetPath, key);
      log.debug('List %s', basePath);

      const files = await fs.readdir(path.resolve(process.cwd(), basePath));
      return Promise.all(
        files.map(async file => {
          const name = path.join(basePath, file);
          const stats = await fs.stat(name);
          const modified = stats.mtime;
          return { name, modified };
        })
      );
    } else {
      throw new ContentProblem(`Illegal target protocol ${this.target.protocol || '???'}`);
    }
  }

  public async publish(args: ExportArgs): Promise<PublishResult> {
    log.debug('Publish to %s', args.key);

    if (this.target.protocol === 'file:') {
      return this.publishToFileSystem(this.targetPath, args);
    } else {
      throw new ContentProblem(`Illegal target protocol ${this.target.protocol || '???'}`);
    }
  }

  // TODO: refactor this into tessellate-bundler middleware.
  private async sendFile(args: { ctx: Context; root: string; key: string }): Promise<void> {
    log.debug('Send %s', args.key);
    await koaSend(args.ctx, args.key, { root: args.root, gzip: true });
  }

  // TODO: refactor this into tessellate-bundler middleware.
  private async sendCollection(args: { ctx: Context; root: string; key: string }): Promise<void> {
    try {
      const files = await this.list(args.key);
      // Sort from oldest to latest modified file.
      const sortedFiles = files.sort((a, b) => a.modified.getTime() - b.modified.getTime());
      args.ctx.body = sortedFiles.reduce(
        (collection, file) => {
          const extname = path.extname(file.name).slice(1);
          const filenames = collection[extname] || [];
          return Object.assign(collection, { [extname]: filenames.concat(file.name) });
        },
        {} as { [name: string]: string[] }
      );
    } catch (e) {
      if (e.code === 'ENOENT') {
        args.ctx.status = 404;
      } else {
        throw new ContentProblem(e.message);
      }
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

    const allFiles = Object.values(args.bundle).reduce((all, file) => all.concat(file));
    const writtenFiles = await this.writeFiles(basePath, allFiles);

    return writtenFiles.reduce(
      (collection, file) => {
        const extname = path.extname(file).slice(1);
        const files = collection[extname] || [];
        return Object.assign(collection, { [extname]: files.concat(file) });
      },
      {} as PublishResult
    );
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
