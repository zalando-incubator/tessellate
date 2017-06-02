import TokenProvider, { TokenSupplier } from './TokenProvider';

function parseTokens(tokenString: string): { [key: string]: string } {
  if (!/^\w+=\S+/.test(tokenString)) {
    return {};
  }

  return tokenString
    .split(',')
    .reduce((obj, pair) => {
      const [key, token] = pair.split('=');
      if (typeof key === 'string' && typeof token === 'string') {
        return Object.assign(obj, { [key]: token });
      } else {
        return obj;
      }
    }, {});
}

/**
 * Provides tokens from an in-memory store.
 */
export default class LocalProvider implements TokenProvider {
  private readonly oauth2AccessTokens: { [key: string]: string };

  constructor(oauth2AccessTokens: string | { [key: string]: string }) {
    this.oauth2AccessTokens = typeof oauth2AccessTokens === 'string'
      ? parseTokens(oauth2AccessTokens)
      : oauth2AccessTokens;
  }

  public getTokens(): Promise<{ [key: string]: string }> {
    return Promise.resolve(Object.assign({}, this.oauth2AccessTokens));
  }

  public getToken(key: string): Promise<string> {
    return Promise.resolve(this.oauth2AccessTokens[key] || '');
  }

  public getTokenSupplier(name: string): TokenSupplier {
    return () => this.getToken(name);
  }
}
