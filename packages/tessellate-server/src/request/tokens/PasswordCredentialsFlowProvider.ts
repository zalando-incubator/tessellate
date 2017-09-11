import fs = require('mz/fs');
import path = require('path');
import request = require('request-promise-native');
import TokenProvider, { TokenSupplier } from './TokenProvider';

export type TokenScopes = { [name: string]: string[] };
export type TokenSet = { [name: string]: string };
export type UserCredentialsProvider = () => UserCredentials | Promise<UserCredentials>;
export type ClientCredentialsProvider = () => ClientCredentials | Promise<ClientCredentials>;

export type Options = {
  accessTokenUri: string;
  tokenInfoUri?: string;
  realm?: string;
  credentialsDir?: string;
  userCredentialsProvider?: UserCredentialsProvider;
  clientCredentialsProvider?: ClientCredentialsProvider;
  debounceMilliseconds?: number;
  tokenResponseParser?: (response: any) => string;
};

export type UserCredentials = {
  username: string;
  password: string;
};

export type ClientCredentials = {
  id: string;
  secret: string;
};

async function loadCredentials(filePath: string): Promise<{ [name: string]: string }> {
  const json = await fs.readFile(path.resolve(process.cwd(), filePath));
  return JSON.parse(json.toString()) || {};
}

function userCredentialsProvider(filePath: string, fields: UserCredentials): () => Promise<UserCredentials> {
  return async () => {
    const credentials = await loadCredentials(filePath);
    return { username: credentials[fields.username], password: credentials[fields.password] };
  };
}

function clientCredentialsProvider(filePath: string, fields: ClientCredentials): () => Promise<ClientCredentials> {
  return async () => {
    const credentials = await loadCredentials(filePath);
    return { id: credentials[fields.id], secret: credentials[fields.secret] };
  };
}

function defaultTokenResponseParser(response: any): string {
  if (typeof response === 'object') {
    return response.access_token || '';
  }
  return '';
}

/**
 * Retrieves OAuth2 tokens from a backend using the resource owner password credentials flow.
 */
export default class PasswordCredentialsFlowProvider implements TokenProvider {
  private readonly accessTokenUri: string;
  private readonly userCredentialsProvider: UserCredentialsProvider;
  private readonly clientCredentialsProvider: ClientCredentialsProvider;
  private readonly debounceMilliseconds: number;
  private readonly tokenScopes: TokenScopes;
  private readonly oauth2AccessTokens: TokenSet;
  private readonly realm: string;
  private readonly tokenResponseParser: (response: any) => string;
  private lastRefresh: number;

  constructor(options: Options) {
    const credentialsDir = options.credentialsDir || process.cwd();

    this.userCredentialsProvider = options.userCredentialsProvider || userCredentialsProvider(
      path.join(credentialsDir, 'user.json'),
      { username: 'application_username', password: 'application_password' }
    );

    this.clientCredentialsProvider = options.clientCredentialsProvider || clientCredentialsProvider(
      path.join(credentialsDir, 'client.json'),
      { id: 'client_id', secret: 'client_secret' }
    );

    this.realm = options.realm || '/services';
    this.accessTokenUri = options.accessTokenUri;
    this.oauth2AccessTokens = {};
    this.debounceMilliseconds = options.debounceMilliseconds || 10000;
    this.tokenResponseParser = options.tokenResponseParser || defaultTokenResponseParser;
    this.tokenScopes = {};
    this.lastRefresh = 0;
  }

  /**
   * Request a new token for the given list of scopes.
   * @param scopes List of scopes to request.
   * @return Value of the token.
   */
  private async requestToken(scopes: string[]): Promise<string> {
    const clientCredentials = await this.clientCredentialsProvider();
    const userCredentials = await this.userCredentialsProvider();

    const response = await request.post(this.accessTokenUri, {
      form: {
        realm: this.realm,
        grant_type: 'password',
        username: userCredentials.username,
        pasword: userCredentials.password,
        scope: scopes.join(' ')
      },
      auth: {
        user: clientCredentials.id,
        pass: clientCredentials.secret
      },
      json: true
    });

    return this.tokenResponseParser(response);
  }

  /**
   * Check if enough time has elapsed since the last refresh,
   * then request a new token for each list of scopes.
   */
  private async refreshTokensIfNecessary(): Promise<void> {
    const now = new Date().getTime();
    const dt = now - this.lastRefresh;
    if (dt > this.debounceMilliseconds) {
      this.lastRefresh = now;
      const tokenNames = Object.keys(this.tokenScopes);
      // Request all named tokens in order by their scopes.
      const tokens = await Promise.all(
        tokenNames.map(tokenName => this.requestToken(this.tokenScopes[tokenName]))
      );
      // Assign the updated token values in order by name.
      for (let i = 0; i < tokens.length; i += 1) {
        this.oauth2AccessTokens[tokenNames[i]] = tokens[i];
      }
    }
  }

  /**
   * Add a new token to manage.
   * @param name Name of the token to add.
   * @param scopes Requested scopes of the token.
   * @return This TokenProvider instance.
   */
  public addToken(name: string, scopes: string[]): PasswordCredentialsFlowProvider {
    this.tokenScopes[name] = scopes;
    return this;
  }

  /**
   * Add multiple tokens to manage.
   * @param tokens Lists of requested scopes by token name.
   * @return This TokenProvider instance.
   */
  public addTokens(tokens: TokenScopes): PasswordCredentialsFlowProvider {
    Object.assign(this.tokenScopes, tokens);
    return this;
  }

  public async getTokens(): Promise<TokenSet> {
    await this.refreshTokensIfNecessary();
    return Object.assign({}, this.oauth2AccessTokens);
  }

  public async getToken(key: string): Promise<string> {
    await this.refreshTokensIfNecessary();
    return this.oauth2AccessTokens[key] || '';
  }

  public getTokenSupplier(name: string): TokenSupplier {
    return () => this.getToken(name);
  }
}
