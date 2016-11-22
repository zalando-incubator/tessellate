// @flow

import url from 'url'
import path from 'path'
import nconf from '../nconf'
import { register } from '../dispatch'
import { Problem } from '../error'
import * as scriptBuilder from '../script-builder'
import * as bundleService from '../bundle-service'
import * as contentService from '../content-service'

class BundleProblem extends Problem {
  constructor(detail: string) {
    super({title: 'Bundle Error.', detail, status: 500})
  }
}

function parseConfigValue(value: mixed): mixed {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch(e) {
      throw new BundleProblem(`Cannot parse illegal config value "${value}"`)
    }
  }
  return value
}

function parseOptions(): Object {
  const packages = parseConfigValue(nconf.get('NPM_MODULES'))
  let externals = parseConfigValue(nconf.get('NPM_EXTERNALS'))
  externals = externals.reduce((exts, ext) => Object.assign(exts, {[ext]: ext}), {})
  const production = nconf.get('NODE_ENV') === 'production'

  return {
    cssSupport: true,
    production,
    packages,
    externals
  }
}

export const CREATE_BUNDLE = Symbol('CREATE_BUNDLE')

export const createBundle = register(CREATE_BUNDLE, async ({domain, name, element}) => {
  const source = scriptBuilder.build(element)
  const bundle = await bundleService.make(source, parseOptions())
  return {bundle}
})

export const EXPORT_BUNDLE = Symbol('EXPORT_BUNDLE')

export const exportBundle = register(EXPORT_BUNDLE, async ({domain, name, bundle}) => {
  const {js, css} = await contentService.publish({domain, name, bundle})
  return {js, css}
})
