import { AuthOptions } from 'request';
import { TokenProvider } from './tokens';

/**
 * Returns authorization options for the request client.
 */
export interface AuthorizationProvider {
  (): Promise<AuthOptions>;
}

/**
 * Create a basic authorization provider.
 * @param credentials Username and password.
 * @return A basic authorization provider.
 */
export function basicAuthorizationProvider(credentials: { user: string, pass: string }): AuthorizationProvider {
  return async () => ({
    sendImmediately: true,
    ...credentials
  });
}

/**
 * Create an OAuth2 authorization provider.
 * @param supplier A token supplier.
 * @return An OAuth2 authorization provider.
 */
export function oauth2AuthorizationProvider(supplier: TokenProvider.TokenSupplier): AuthorizationProvider {
  return async () => ({
    sendImmediately: true,
    bearer: await supplier()
  });
}
