// @flow

import fs from 'fs';

export class FileConfigurationLoader {
  configurations: Array<AuthConfig>;
  location: string;

  constructor(location: string) {
    this.location = location;
  }

  load(): Array<AuthConfig> {
    if (this.configurations === undefined) {
      this.configurations = JSON.parse(fs.readFileSync(this.location, 'utf8'));
    }
    return this.configurations.slice();
  }
}
