// @flow

import { register } from '../dispatch'
import * as contentService from '../content-service'

export const FETCH_CONTENT = Symbol('FETCH_CONTENT')

export const fetchContent = register(FETCH_CONTENT, async ({domain, name}) => {
  const element = await contentService.fetch({domain, name})
  return {element}
})
