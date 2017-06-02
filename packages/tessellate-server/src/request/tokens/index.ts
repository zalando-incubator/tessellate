import conf from '../../Conf';
import { log } from '../../logger';
import LocalProvider from './LocalProvider';
import NullProvider from './NullProvider';
import PasswordCredentialsFlowProvider from './PasswordCredentialsFlowProvider';
import TokenProvider from './TokenProvider';

export { default as NullProvider } from './NullProvider';
export { default as LocalProvider } from './LocalProvider';
export { default as PasswordCredentialsFlowProvider } from './PasswordCredentialsFlowProvider';

/**
 * @deprecated
 */
export function selectProvider(): TokenProvider {
  const oauth2AccessTokens = conf.getObject('oauth2AccessTokens') || process.env.OAUTH2_ACCESS_TOKENS;

  if (!!oauth2AccessTokens) {
    log.info('Using OAuth2 LocalProvider.');
    return new LocalProvider(oauth2AccessTokens);
  }

  const accessTokenUri = conf.getString('oauth2TokenUri');
  const tokenInfoUri = conf.getString('oauth2TokenInfoUri');
  const tokenScopes = conf.getObject('oauth2TokenScopes');
  const credentialsDir = conf.getString('oauth2CredentialsDir');

  if (accessTokenUri) {
    log.info('Using OAuth2 PasswordCredentialsFlowProvider.');
    const provider = new PasswordCredentialsFlowProvider({
      accessTokenUri,
      tokenInfoUri,
      credentialsDir
    });

    return provider.addTokens(tokenScopes);
  }

  log.info('Using token NullProvider.');
  return new NullProvider();
}
