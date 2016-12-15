// @flow

import JsonFileBackedOAuthRequest from './requests/file-backed-oauth-request'
import DefaultRequest from './requests/default-request'
import type {SmartRequest} from './requests/smart-request'
import * as configurationProvider from './configuration/configuration-provider'

const OAUTH2_JSON_FILE_BACKED_USER_CREDENTIALS_PROVIDER = 'OAUTH2_JSON_FILE_BACKED_USER_CREDENTIALS_PROVIDER'

export function createAuthRequestById(id: string): SmartRequest {

  const config: AuthConfig = configurationProvider.getById(id)

  if(config.type === OAUTH2_JSON_FILE_BACKED_USER_CREDENTIALS_PROVIDER) {
    return new JsonFileBackedOAuthRequest(config)
  } else {
    throw new Error(`${config.type} authentication type is not supported`)
  }
}

export function createDefault(): SmartRequest {
  return new DefaultRequest()
}
