import request = require('request-promise-native');
import { log, Problem } from 'tessellate-server';
import url = require('url');

export type Bundle = {
  source: string;
  sourceLink: string;
  links: {
    [extname: string]: string[];
  };
};

class BundleProblem extends Problem {
  constructor(detail: string) {
    super({ title: 'Bundle error.', detail, status: 404 });
  }
}

/**
 * Provides Tessellate bundles from remote sources.
 */
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

    const baseUrl = `${bundleUrl.protocol!}//${bundleUrl.host}`;

    const resolvedBundleUrls = Object.entries(bundle).reduce(
      (collection, [extname, files]) => {
        if (Array.isArray(files)) {
          const resolved = files.map(file => url.resolve(baseUrl, file));
          const allResolved = collection[extname] || [];
          return Object.assign(collection, { [extname]: allResolved.concat(resolved) });
        } else if (typeof files === 'string') {
          const resolved = [url.resolve(baseUrl, files)];
          return Object.assign(collection, { [extname]: resolved });
        } else {
          return collection;
        }
      },
      {} as { [extname: string]: string[] }
    );

    if (!Array.isArray(resolvedBundleUrls.js)) {
      throw new BundleProblem(`Invalid bundle ${bundleUrl} has no .js files.`);
    }

    // Convention: remove the last .js file in the array
    // and use it as the fragment bundle source URL.
    const sourceLink = resolvedBundleUrls.js.pop();

    if (!sourceLink) {
      throw new BundleProblem(`Invalid bundle ${bundleUrl} has no .js files.`);
    }

    log.debug('Fetch script %s', sourceLink);

    const source = await request(sourceLink, {
      gzip: true
    });

    return { source, sourceLink, links: resolvedBundleUrls };
  }
}
