// @flow

import JsonFileBackedOAuthRequest from './requests/file-backed-oauth-request'
import DefaultRequest from './requests/default-request'
import type {SmartRequest} from './requests/smart-request'
import * as configurationProvider from './configuration/oauth-configuration-provider'
import type {OAuthConfig} from './configuration/oauth-configuration'

const JSON_FILE_BACKED_USER_CREDENTIALS_PROVIDER = 'JSON_FILE_BACKED_USER_CREDENTIALS_PROVIDER'

export function createOAuthRequestById(id: string): SmartRequest {

  const config: OAuthConfig = configurationProvider.getById(id)

  if(config.type === JSON_FILE_BACKED_USER_CREDENTIALS_PROVIDER) {
    return new JsonFileBackedOAuthRequest(config)
  } else {
    throw new Error(`${config.type} authentication type is not supported`)
  }
}

export function createDefault(): SmartRequest {
  return new DefaultRequest()
}
