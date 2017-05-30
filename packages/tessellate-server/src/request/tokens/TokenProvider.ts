interface TokenProvider {
  getTokens(): Promise<{ [key: string]: string }>;
  getToken(key: string): Promise<string | void>;
};

export default TokenProvider;
