/// <reference types="jest" />

jest.mock('request-promise-native');

import { RequestAPI } from 'request';
import request = require('request-promise-native');
import makeRequest from '../src/request';
import * as authProviders from '../src/request/AuthorizationProvider';

type MockedRequest = jest.MockInstance<RequestAPI<any, any, any>>;

describe('request', () => {
  beforeEach(() => jest.resetAllMocks());

  test('makeRequest with basic authorization', async () => {
    // Configure request mock.
    ((request as any) as MockedRequest).mockImplementation(async () => ({
      statusCode: 200,
      body: 'OK'
    }));

    const provider = authProviders.basicAuthorizationProvider({ user: 'u', pass: 'p' });
    const response = await makeRequest({ method: 'GET', uri: 'http://localhost' }, provider);

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe('OK');
    expect(((request as any) as MockedRequest).mock.calls.length).toBe(1);
    expect(((request as any) as MockedRequest).mock.calls[0][0]).toEqual({
      method: 'GET',
      uri: 'http://localhost',
      resolveWithFullResponse: true,
      auth: {
        user: 'u',
        pass: 'p',
        sendImmediately: true
      }
    });
  });
});
