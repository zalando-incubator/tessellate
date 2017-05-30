import TokenProvider from './TokenProvider';

/**
 * Empty token provider which returns nothing.
 */
export default class NullProvider implements TokenProvider {
  getTokens(): Promise<{ [key: string]: string }> {
    return Promise.resolve({});
  }

  getToken(): Promise<string | void> {
    return Promise.resolve();
  }
}
