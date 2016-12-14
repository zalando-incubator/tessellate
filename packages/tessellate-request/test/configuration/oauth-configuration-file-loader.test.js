// @flow

import * as configurationLoader from '../../lib/configuration/oauth-configuration-file-loader'

describe('get configuration from file', () => {

  it('returns empty configuration array when no file path specified', () => {
    configurationLoader.init()
    expect(configurationLoader.get()).toHaveLength(0)
  })
})
