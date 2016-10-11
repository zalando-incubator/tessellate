// @flow

import url from 'url'
import path from 'path'
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

export const CREATE_BUNDLE = Symbol('CREATE_BUNDLE')

export const createBundle = register(CREATE_BUNDLE, async ({domain, name, element}) => {
  const source = scriptBuilder.build(element)
  const bundle = await bundleService.make(source)
  return {bundle}
})

export const EXPORT_BUNDLE = Symbol('EXPORT_BUNDLE')

export const exportBundle = register(EXPORT_BUNDLE, async ({domain, name, bundle}) => {
  const {js, css} = await contentService.publish({domain, name, bundle})
  return {js, css}
})
