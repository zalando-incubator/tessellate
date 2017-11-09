import path = require('path');
import { Problem } from 'tessellate-server';
import url = require('url');

export type Headers = { [name: string]: string };
export type Query = { [name: string]: string };

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

  constructor(args: { bundlesSource: string }) {
    this.bundlesSource = args.bundlesSource;
  }

  public resolveSources(args: { headers: Headers; query: Query }): string {
    const fromHeaders = this.resolveFromHeaders(args.headers);
    const fromQuery = this.resolveFromQuery(args.query);
    const sources = fromHeaders || fromQuery;

    if (this.bundlesSource) {
      return url.resolve(this.bundlesSource + '/', sources);
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
