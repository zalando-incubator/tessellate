/**
 * Provides authorization tokens.
 */
export interface TokenProvider {
  /**
   * Get a collection of all token values by name.
   * @return Collection of all tokens by name.
   */
  getTokens(): Promise<{ [key: string]: string }>;

  /**
   * Get a single token by name.
   * @param name Name of the token.
   * @return Value of the token.
   */
  getToken(name: string): Promise<string>;

  /**
   * Get a supplier function for a given token name.
   * @param name Name of the token.
   * @return Function that returns a valid token value.
   */
  getTokenSupplier(name: string): TokenSupplier;
}

export type TokenSupplier = () => Promise<string>;

export default TokenProvider;
