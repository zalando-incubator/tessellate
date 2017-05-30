/// <reference types="jest" />

jest.mock('mz/fs');
jest.mock('request-promise-native');

import path = require('path');
import fs = require('mz/fs');
import request = require('request-promise-native');
import PasswordCredentialsFlowProvider from '../src/request/tokens/PasswordCredentialsFlowProvider';

describe('PasswordCredentialsFlowProvider', () => {

  beforeEach(() => jest.resetAllMocks());

  test('get token', async () => {
    // Configure file system mock.
    const readFileMock = jest.fn((file: string) => {
      if (file.endsWith('client.json')) {
        return JSON.stringify({
          client_id: 'id',
          client_secret: 'secret'
        });
      }
      if (file.endsWith('user.json')) {
        return JSON.stringify({
          application_username: 'user',
          application_password: 'pass'
        });
      }
    });
    fs.readFile = readFileMock

    // Configure request mock.
    const postMock = jest.fn(async () => {
      return { access_token: 'token' };
    })
    request.post = postMock;

    const provider = new PasswordCredentialsFlowProvider({
      accessTokenUri: 'http://test',
      credentialsDir: '/tmp/test'
    });

    const tokens = await provider.getTokens();

    expect(tokens['default']).toBe('token');
    expect(readFileMock.mock.calls.length).toBe(2);
    expect(postMock.mock.calls.length).toBe(1);
    expect(postMock.mock.calls[0][0]).toBe('http://test');
    expect(postMock.mock.calls[0][1]).toEqual({
      form: {
        realm: '/services',
        grant_type: 'password',
        username: 'user',
        pasword: 'pass',
        scope: 'uid'
      },
      auth: {
        user: 'id',
        pass: 'secret'
      },
      json: true
    });
  });

  // Set the following environment variables in order to
  // run an integration test against a real backend.
  const accessTokenUri = process.env['OAUTH2_TOKEN_URI'];
  const tokenInfoUri = process.env['OAUTH2_TOKEN_INFO_URI'];
  const credentialsDir = process.env['OAUTH2_CREDENTIALS_DIR'];
  jest.clearAllMocks();

  if (!accessTokenUri || !credentialsDir) {
    console.warn('Skipping "get token from real backend"');
    test.skip('');
    return;
  }

  test('get token from real backend', async () => {
    const provider = new PasswordCredentialsFlowProvider({
      accessTokenUri,
      credentialsDir
    });

    const tokens = await provider.getTokens();
    expect(typeof tokens['default']).toBe('string');
    expect(typeof tokens['default'].length).toBeGreaterThan(0);
  })
});
