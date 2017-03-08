// @flow

import request from 'request-promise-native';
import nconf from './nconf';
import logger from './logger';
import { Problem } from './error';

type FragmentResult = {|
  html: string,
  link: {|
    js: string,
    css?: string
  |}
|};

const log = logger('fragment-service');

class FragmentProblem extends Problem {
  constructor(detail: string) {
    super({ title: 'Fragment error.', detail, status: 404 });
  }
}

export async function fetchFragment(domain: string, name: string): Promise<FragmentResult> {
  const url = nconf.get('FRAGMENT_SOURCE');
  log.debug('Fetch fragment %s %s/%s', url, domain, name);
  const { body, headers } = await request({
    url,
    method: 'GET',
    headers: {
      'x-zalando-request-uri': name,
      'x-zalando-request-host': domain
    },
    resolveWithFullResponse: true
  });

  return { html: body, link: parseLinkHeader(headers.link) };
}

function parseLinkHeader(header: string): {| js: string, css?: string |} {
  const jsMatch = header.trim().match(/<(\S+\.js)>;/);
  const cssMatch = header.trim().match(/<(\S+\.css)>;/);

  if (!jsMatch) throw new FragmentProblem(`No fragment script found in ${header}`);

  return { js: jsMatch[1], css: cssMatch ? cssMatch[1] : undefined };
}
