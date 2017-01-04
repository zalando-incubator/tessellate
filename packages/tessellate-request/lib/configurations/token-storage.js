// @flow

import manageTokens from 'node-tokens'
import * as configurationProvider from './configuration-provider'
import { OAUTH2_JSON_FILE_BACKED_USER_CREDENTIALS_PROVIDER } from './configuration-type'

const GET_TOKEN_RETRY_COUNT = 3
const GET_TOKEN_INTERVAL = 500 //ms

let managedTokens;

function startManagingTokens() {
  managedTokens = {}
  const configurations: Array<AuthConfig> = configurationProvider.getByType(OAUTH2_JSON_FILE_BACKED_USER_CREDENTIALS_PROVIDER)

  configurations.forEach(configuration => {
    const token = {
      [configuration.id]: {
        scope: configuration.scopes.split(' ')
      }
    }

    const managedToken = managedTokens[configuration.id] = manageTokens(token, {
      credentialsDir: configuration.credentials_directory,
      oauthTokenUrl: configuration.access_token_uri
    })

    managedToken.getToken = () => {
      return new Promise((resolve, reject) => {
        function getTokenWithRetries(retriesLeft) {
          const token = managedToken.get(configuration.id)
          if(token) {
            resolve(token)
          } else {
            if(retriesLeft >= 0) {
              setTimeout(getTokenWithRetries.bind(null, retriesLeft - 1), GET_TOKEN_INTERVAL)
            } else {
              reject(new Error(`Could not get managed token with id "${configuration.id}".`))
            }
          }
        }
        getTokenWithRetries(GET_TOKEN_RETRY_COUNT)
      })
    }
  })
}

export async function getTokenById(id: string) {
  if(managedTokens === undefined) {
    startManagingTokens()
  }
  const managedToken = managedTokens[id]
  if(managedToken === undefined) {
    throw Error(`Token with id "${id}" has no configuration`)
  }
  return await managedToken.getToken()
}
