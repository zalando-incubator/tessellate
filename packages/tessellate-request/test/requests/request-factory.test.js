jest.mock('../../lib/configurations/configuration-provider');
jest.mock('../../lib/requests/file-backed-oauth-request');

import * as requestFactory from '../../lib/requests/request-factory';
import JsonFileBackedOAuthRequest from '../../lib/requests/file-backed-oauth-request';
import DefaultRequest from '../../lib/requests/default-request';

describe('create request', () => {
  it('creates json file backed user credentials request', () => {
    mockAuthConfigWithType('OAUTH2_JSON_FILE_BACKED_USER_CREDENTIALS_PROVIDER');

    const request = requestFactory.createAuthRequestById('content-service');

    expect(request instanceof JsonFileBackedOAuthRequest).toBeTruthy();
  });

  it('throws an error if authentication type is not supported', () => {
    mockAuthConfigWithType('UNKNOWN');

    expect(() => {
      requestFactory.createAuthRequestById('content-service');
    }).toThrowError('UNKNOWN authentication type is not supported');
  });

  it('creates default request', () => {
    const request = requestFactory.createDefault();

    expect(request instanceof DefaultRequest).toBeTruthy();
  });
});

function mockAuthConfigWithType(type: string) {
  require('../../lib/configurations/configuration-provider').getById.mockImplementation(() => {
    return {
      id: 'content-service',
      type: type,
      credentials_directory: '/path/to/credentials',
      access_token_uri: 'https://access.tokens.com',
      scopes: ''
    };
  });
}
