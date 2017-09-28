import request = require('request-promise-native');
import { log, Problem } from 'tessellate-server';
import url = require('url');

export type Headers = { [name: string]: string };
export type BundleSources = { bundles: { src?: string; path?: string } };
export type Bundle = {
  source: string;
  links: {
    js: string;
    css?: string;
  };
};

class BundleProblem extends Problem {
  constructor(detail: string) {
    super({ title: 'Bundle error.', detail, status: 404 });
  }
}

export default class BundleProvider {
  public async fetchBundle(source: string): Promise<Bundle> {
    const bundle = await this.fetchBundleFromSource(source);
    return bundle;
  }

  private async fetchBundleFromSource(source: string): Promise<Bundle> {
    const uri = url.parse(source);

    if ((uri.protocol === 'http:' || uri.protocol === 'https:') && uri.hostname) {
      return await this.fetchBundleFromHTTPSource(uri);
    } else {
      throw new BundleProblem(`Illegal bundle source ${uri.href}`);
    }
  }

  private async fetchBundleFromHTTPSource(bundleUrl: url.Url): Promise<Bundle> {
    log.debug('Fetch bundle %s', url.format(bundleUrl));
    let bundle;
    try {
      bundle = await request(url.format(bundleUrl), {
        json: true
      });
    } catch (e) {
      throw new BundleProblem(e.message);
    }

    log.debug('Received bundle %j', bundle);

    // TODO: validate response, handle multiple files
    const baseUrl = `${bundleUrl.protocol!}//${bundleUrl.host}`;
    const jsUrl = url.resolve(baseUrl, bundle.js[0]);
    const cssUrl = bundle.css[0] ? url.resolve(baseUrl, bundle.css[0]) : undefined;

    log.debug('Fetch script %s', jsUrl);

    const source = await request(jsUrl, {
      gzip: true
    });

    return { source, links: { js: jsUrl, css: cssUrl } };
  }
}
