import path = require('path');
import { conf, Problem } from 'tessellate-server';
import url = require('url');

export type Headers = { [name: string]: string };
export type Query = { [name: string]: string };
export type Sources = { bundles: { src?: string; path?: string } };

class SourcesProblem extends Problem {
  constructor(detail: string) {
    super({ title: 'Sources generation error.', detail, status: 404 });
  }
}

/**
 * TODO: implement middleware pattern to allow plugins for source resolutions.
 */
export default class SourcesResolver {
  private readonly bundlesSource: string;

  constructor() {
    const bundlesSource = conf.getString('bundlesSource');
    if (!bundlesSource) {
      throw new SourcesProblem('bundlesSource not set');
    }
    this.bundlesSource = bundlesSource;
  }

  public resolveSources(args: { headers: Headers; query: Query }): string {
    const fromHeaders = this.resolveFromHeaders(args.headers);
    const fromQuery = this.resolveFromQuery(args.query);
    const bundlesSource = conf.getString('bundlesSource');
    const sources = fromHeaders || fromQuery;

    if (bundlesSource && sources) {
      return url.resolve(bundlesSource + '/', sources);
    } else {
      throw new SourcesProblem('Cannot determine sources.');
    }
  }

  private resolveFromHeaders(headers: Headers): string {
    const uri = headers['x-zalando-request-uri'];
    const host = headers['x-zalando-request-host'];
    if (uri && headers) {
      return path.join(host, uri);
    } else {
      return '';
    }
  }

  private resolveFromQuery(query: Query): string {
    if (query.id) {
      return query.id;
    } else {
      return '';
    }
  }
}
