import { AuthOptions } from 'request';
import { TokenSupplier } from './tokens/TokenProvider';

/**
 * Returns authorization options for the request client.
 */
export type AuthorizationProvider = () => Promise<AuthOptions>;

/**
 * Create a basic authorization provider.
 * @param credentials Username and password.
 * @return A basic authorization provider.
 */
export function basicAuthorizationProvider(credentials: {
  user: string;
  pass: string;
}): AuthorizationProvider {
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
export function oauth2AuthorizationProvider(supplier: TokenSupplier): AuthorizationProvider {
  return async () => ({
    sendImmediately: true,
    bearer: await supplier()
  });
}
