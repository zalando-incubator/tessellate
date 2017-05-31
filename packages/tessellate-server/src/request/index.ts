import request = require('request-promise-native');
import { AuthorizationProvider } from './AuthorizationProvider';
import { Options, FullResponse } from 'request-promise-native';

/**
 * Make an HTTP request. Uses the [request](https://github.com/request/request) library.
 * @param options Request options.
 * @param authProvider Optional authorization provider.
 * @return Full HTTP response.
 */
export default async function makeReqest(options: Options, authProvider?: AuthorizationProvider): Promise<FullResponse> {
  if (authProvider) {
    options.auth = await authProvider();
  }
  // Force a full response that includes headers etc.
  options.resolveWithFullResponse = true;
  return request(options);
}
