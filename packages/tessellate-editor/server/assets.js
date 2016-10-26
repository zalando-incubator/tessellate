// @flow

import path from 'path'
import ejs from 'ejs'
import thenify from 'thenify'
import nconf from './nconf'

const glob = thenify(require('glob'))
const DATA_PREFIX = 'htmlWebpackPlugin.options'

export async function renderIndexHTML(options: {[key: string]: mixed}): string {
  const staticDir = nconf.get('STATIC_DIR')
  const js = await glob(path.join(staticDir, '*.js')).then(files => files.map(f => path.basename(f)))
  const css = await glob(path.join(staticDir, '*.css')).then(files => files.map(f => path.basename(f)))
  const files = {js, css}
  // $FlowIssue
  return ejs.render(require('../client/index.ejs'), {htmlWebpackPlugin: {files, options}}, {});
}
