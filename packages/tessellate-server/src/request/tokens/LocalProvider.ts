import TokenProvider from './TokenProvider';

function parseTokens(tokenString: string): { [key: string]: string } {
  if (!/^\w+=\S+/.test(tokenString)) {
    return {};
  }

  return tokenString
    .split(',')
    .reduce((obj, pair) => {
      const [key, token] = pair.split('=')
      if (typeof key === 'string' && typeof token === 'string') {
        return Object.assign(obj, { [key]: token })
      } else {
        return obj
      }
    }, {});
}

export class LocalProvider implements TokenProvider {
  private readonly oauth2AccessTokens: { [key: string]: string };

  constructor(oauth2AccessTokens: string | { [key: string]: string }) {
    this.oauth2AccessTokens = typeof oauth2AccessTokens === 'string'
      ? parseTokens(oauth2AccessTokens)
      : oauth2AccessTokens;
  }

  getTokens(): Promise<{ [key: string]: string }> {
    return Promise.resolve(Object.assign({}, this.oauth2AccessTokens));
  }

  getToken(key: string): Promise<string | void> {
    return Promise.resolve(this.oauth2AccessTokens[key]);
  }
}

export default LocalProvider;
