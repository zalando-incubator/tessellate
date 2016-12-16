// @flow

import UserCredentials from '../credentials/user-credentials'
import ClientCredentials from '../credentials/client-credentials'
import fs from 'fs'

export function getClientCredentials(credentialDirectoryPath: string): ClientCredentials {
  const clientJson = fs.readFileSync(`${credentialDirectoryPath}/client.json`, 'utf-8');
  return jsonToClientCredentials(clientJson);
}

export function getUserCredentials(credentialDirectoryPath: string): UserCredentials {
  const userJson = fs.readFileSync(`${credentialDirectoryPath}/user.json`, 'utf-8')
  return jsonToUserCredentials(userJson);
}

function jsonToUserCredentials(jsonString: string): UserCredentials {
  const json = JSON.parse(jsonString);
  return new UserCredentials(json.application_username, json.application_password);
}

function jsonToClientCredentials(jsonString: string): ClientCredentials {
  const json = JSON.parse(jsonString);
  return new ClientCredentials(json.client_id, json.client_secret);
}
