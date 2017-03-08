// @flow

import path from 'path';
import ejs from 'ejs';
import thenify from 'thenify';
import logger from './logger';

type FragmentType = {|
  name: string,
  src: string,
  css?: string,
  html: string
|};

const renderFile = thenify(ejs.renderFile.bind(ejs));
const log = logger('template-service');

// async function loadTemplateFile() {
//   path.resolve(__dirname, '../static/template.ejs')
//   log.debug('Using template file %s', templateFile)
//   return require('../static/template.ejs')
// }

export async function renderView(fragment: FragmentType): Promise<string> {
  log.debug('Render view...');
  const meta = {};
  const templateFile = path.resolve(__dirname, '../static/template.ejs');
  // $ FlowIssue
  // const templateFile = require('../static/template.ejs')
  log.debug('Using __dirname %s', __dirname);
  log.debug('Using template file %s', templateFile);
  return await renderFile(templateFile, { meta, fragment }, {});
}
