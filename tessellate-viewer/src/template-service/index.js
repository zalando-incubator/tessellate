// @flow

import path from 'path'
import ejs from 'ejs'
import thenify from 'thenify'
import logger from '../logger'

type FragmentType = {|
  name: string;
  src: string;
  css?: string;
  html: string;
|}

const renderFile = thenify(ejs.renderFile.bind(ejs))
const log = logger('template-service')

export async function renderView(fragment: FragmentType): Promise<string> {
  log.debug('Render view...')
  const meta = {}
  const templateFile = path.resolve(__dirname, 'template.ejs')
  return await renderFile(templateFile, {meta, fragment}, {})
}
