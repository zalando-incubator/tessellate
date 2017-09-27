// Type definitions for express-winston 1.0.x
// Project: https://github.com/flitbit/json-ptr
// Definitions by: mfellner <https://github.com/mfellner>

declare module 'json-ptr' {
  export = ptr;

  const ptr: {
    create(pointer: string): JsonPointer;
    has(target: object, pointer: string): boolean;
    get(target: object, pointer: string): any | undefined;
    set(target: object, pointer: any, value: any, force?: boolean): void;
    list(target: object, fragmentId?: boolean): Array<{ pointer: string; value: any }>;
    flatten(target: object, fragmentId?: boolean): { [pointer: string]: any };
    map(target: object, fragmentId?: boolean): Map<string, any>;
    decode(pointer: string): string[];
    decodePointer(pointer: string): string[];
    encodePointer(path: string[]): string;
    decodeUriFragmentIdentifier(pointer: string): string[];
    encodeUriFragmentIdentifier(path: string[]): string;
  };

  class JsonPointer {
    readonly path: any[];
    readonly pointer: string[];
    readonly uriFragmentIdentifier: string;

    has(target: object): boolean;
    get(target: object): any | undefined;
    set(target: object, value: any, force?: boolean): void;
  }
}
