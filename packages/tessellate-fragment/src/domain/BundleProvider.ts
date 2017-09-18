import request = require('request-promise-native');
import { log, Problem } from 'tessellate-server';
import url = require('url');

export type Headers = { [name: string]: string };
export type BundleSources = { bundles: { src?: string; path?: string } };
export type BundleResult = { bundle: Bundle; props: { [name: string]: any } };
export type Bundle = {
  source: string;
  links: {
    js: string;
    css: string;
  };
};

class BundleProblem extends Problem {
  constructor(detail: string) {
    super({ title: 'Bundle error.', detail, status: 404 });
  }
}

export default class BundleProvider {
  public async fetchBundle(args: {
    headers: Headers;
    sources: BundleSources;
  }): Promise<BundleResult> {
    const skipperArgs = this.parseSkipperArgs(args.headers);
    const bundle = await this.fetchBundleFromSource(args.sources);
    return { bundle, props: skipperArgs };
  }

  private async fetchBundleFromSource(sources: BundleSources): Promise<Bundle> {
    if (!sources.bundles.src) {
      throw new BundleProblem('No bundle source configured!');
    }

    const uri = url.parse(sources.bundles.src);

    if ((uri.protocol === 'http:' || uri.protocol === 'https:') && uri.hostname) {
      const baseURL = url.format({
        protocol: uri.protocol,
        hostname: uri.hostname,
        port: uri.port,
        pathname: sources.bundles.path
      });
      return await this.fetchBundleFromHTTPSource(baseURL);
    } else {
      throw new BundleProblem(`Illegal bundle source ${uri.href}`);
    }
  }

  private async fetchBundleFromHTTPSource(baseURL: string): Promise<Bundle> {
    const jsURL = `${baseURL}/index.js`;
    const cssURL = `${baseURL}/index.css`;

    log.debug('Fetch bundle %s', jsURL);
    const source = await request(jsURL, {
      gzip: true
    });
    return { source, links: { js: jsURL, css: cssURL } };
  }

  private parseSkipperArgs(headers: Headers) {
    return {
      language: headers['accept-language'],
      referer: headers['referer'],
      userAgent: headers['user-agent'],
      requestURI: headers['x-zalando-request-uri'],
      requestHost: headers['x-zalando-request-host'],
      customer: headers['x-zalando-customer']
    };
  }
}
