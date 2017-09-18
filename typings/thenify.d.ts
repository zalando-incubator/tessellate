// Type definitions for thenify 3.x
// Project: https://github.com/thenables/thenify
// Definitions by: mfellner <https://github.com/mfellner>

declare module 'thenify' {
  export = thenify;

  function thenify<A0, R>(
    fn: (arg0: A0, callback: (e: Error, r: R) => void) => void
  ): (arg0: A0) => Promise<R>

  function thenify<A0, A1, R>(
    fn: (arg0: A0, arg1: A1, callback: (e: Error, r: R) => void) => void
  ): (arg0: A0, arg1: A1) => Promise<R>

  function thenify<A0, A1, A2, R>(
    fn: (arg0: A0, arg1: A1, arg2: A2, callback: (e: Error, r: R) => void) => void
  ): (arg0: A0, arg1: A1, arg2: A2) => Promise<R>
}
