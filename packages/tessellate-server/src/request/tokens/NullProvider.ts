import { TokenProvider } from './';

/**
 * Empty token provider which returns nothing.
 */
export default class NullProvider implements TokenProvider {
  getTokens(): Promise<{ [key: string]: string }> {
    return Promise.resolve({});
  }

  getToken(): Promise<string> {
    return Promise.resolve('');
  }

  getTokenSupplier(): TokenProvider.TokenSupplier {
    return () => this.getToken();
  }
}
