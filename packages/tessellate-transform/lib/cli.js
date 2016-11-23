// @flow

import path from 'path'
import fs from 'mz/fs'
import yargs from 'yargs'
import parse from './'

import type { File } from './'
import type { ParseOptions } from './parsers'

type Options = {|
  file: File;
  parser: ParseOptions;
|};

async function parseArgs(args: Object): Promise<Options> {
  const filepath = args._[0]
  if (typeof filepath !== 'string') {
    throw new Error('Missing argument: input file')
  }
  const extname = path.extname(filepath)
  if (extname !== '.jsx' && extname !== '.json' && extname !== '.yaml' && extname !== '.xml') {
    throw new Error(`Unsupported file: ${filepath}`)
  }
  const buffer = await fs.readFile(filepath)

  return {
    file: {
      content: buffer.toString(),
      extname
    },
    parser: {
      typePrefix: args.typePrefix
    }
  }
}

async function main(args: Object): Promise<void> {
  const options = await parseArgs(args)
  const result = await parse(options.file, options.parser)
  console.log(JSON.stringify(result))
}

// $FlowIssue https://github.com/facebook/flow/issues/1362
if (require.main === module) {
  const argv = yargs
    .usage('tessellate-transform [OPTIONS] FILE')
    .string('type-prefix')
    .describe('type-prefix', 'Prefix for React class names.')
    .demand(1)
    .argv
  main(argv).catch(console.error)
}
