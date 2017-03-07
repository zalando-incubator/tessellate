jest.mock('../../lib/configurations/configuration-provider');
jest.mock('node-tokens');

import * as tokenStorage from '../../lib/configurations/token-storage';

describe('managed tokens', () => {
  beforeAll(() => {
    require('../../lib/configurations/configuration-provider').getByType.mockImplementation(() => [
      {
        id: 'id',
        type: 'OAUTH2_JSON_FILE_BACKED_USER_CREDENTIALS_PROVIDER',
        credentials_directory: '/credentials/',
        access_token_uri: 'https://accesstokens.com',
        scopes: 'uid'
      },
      {
        id: 'broken-id',
        type: 'OAUTH2_JSON_FILE_BACKED_USER_CREDENTIALS_PROVIDER',
        credentials_directory: '/credentials/',
        access_token_uri: 'https://accesstokens.com',
        scopes: 'uid'
      }
    ]);
    require('node-tokens').mockImplementation(() => {
      return {
        get: id => {
          if (id === 'id') {
            return 'abcd';
          } else {
            return false;
          }
        }
      };
    });
  });

  it('throws an error when managed token does not contain an access token', async () => {
    try {
      await tokenStorage.getTokenById('broken-id');
      expect('Did not throw').toBe(false);
    } catch (err) {
      expect(err.message).toEqual('Could not get managed token with id "broken-id".');
    }
  });

  it('throws an error when token configuration is not found', async () => {
    try {
      await tokenStorage.getTokenById('unknown-id');
      expect('Did not throw').toBe(false);
    } catch (err) {
      expect(err.message).toEqual('Token with id "unknown-id" has no configuration');
    }
  });

  it('returns a token', async () => {
    require('node-tokens').mockImplementation(() => ({
      get: () => 'abcd'
    }));

    const token = await tokenStorage.getTokenById('id');
    expect(token).toEqual('abcd');
  });
});
