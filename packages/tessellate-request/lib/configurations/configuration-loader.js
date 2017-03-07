// @flow

interface ConfigurationLoader {
  location: string,

  load(): Array<Object>
}

export type { ConfigurationLoader };
