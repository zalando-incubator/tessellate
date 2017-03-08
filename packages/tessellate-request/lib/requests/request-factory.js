// @flow

import JsonFileBackedOAuthRequest from './file-backed-oauth-request';
import DefaultRequest from './default-request';
import type { SmartRequest } from './smart-request';
import * as configurationProvider from '../configurations/configuration-provider';
import {
  OAUTH2_JSON_FILE_BACKED_USER_CREDENTIALS_PROVIDER
} from '../configurations/configuration-type';

export function createAuthRequestById(id: string): SmartRequest {
  const config: AuthConfig = configurationProvider.getById(id);

  if (config.type === OAUTH2_JSON_FILE_BACKED_USER_CREDENTIALS_PROVIDER) {
    return new JsonFileBackedOAuthRequest(config.id);
  } else {
    throw new Error(`${config.type} authentication type is not supported`);
  }
}

export function createDefault(): SmartRequest {
  return new DefaultRequest();
}
