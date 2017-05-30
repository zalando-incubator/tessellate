import TokenProvider from './TokenProvider';
import NullProvider from './NullProvider';
import LocalProvider from './LocalProvider';
import PasswordCredentialsFlowProvider from './PasswordCredentialsFlowProvider';
import conf from '../../Conf';
import { log } from '../../logger';

function selectProvider(): TokenProvider {
  const oauth2AccessTokens = conf.getObject('oauth2AccessTokens') || process.env['OAUTH2_ACCESS_TOKENS'];

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
    return new PasswordCredentialsFlowProvider({
      accessTokenUri,
      tokenInfoUri,
      tokenScopes,
      credentialsDir
    });
  }

  log.info('Using token NullProvider.');
  return new NullProvider();
}

export default selectProvider();
