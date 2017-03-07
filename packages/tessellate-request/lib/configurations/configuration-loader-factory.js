// @flow

import nconf from 'nconf';
nconf.use('memory').argv().env();

import type { ConfigurationLoader } from './configuration-loader';
import { FileConfigurationLoader } from './file-configuration-loader';

export function create(): ConfigurationLoader {
  const url = nconf.get('AUTH_CONFIGURATION');

  if (url === undefined) {
    throw Error('Tried to create configuration loader, but AUTH_CONFIGURATION is missing');
  }

  if (url.startsWith('file://')) {
    return new FileConfigurationLoader(url.replace('file://', ''));
  } else {
    throw Error(`Unable to load auth configuration from ${url}`);
  }
}
