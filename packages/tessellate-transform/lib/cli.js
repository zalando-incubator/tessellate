// @flow

import path from 'path'
import fs from 'mz/fs'
import yargs from 'yargs'
import transform from './'

import type { File, TransformOptions } from './'
import type { ParseOptions } from './parsers'

type Options = {|
  file: File;
  parser: ParseOptions;
  transform: TransformOptions;
|};

async function readJSON(filepath?: string): Promise<*> {
  if (!filepath) return
  const buffer = await fs.readFile(filepath)
  return JSON.parse(buffer)
}

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
      typePrefix: args.typePrefix,
      jsonMap: await readJSON(args.jsonMap)
    },
    transform: {
      root: args.root
    }
  }
}

async function main(args: Object): Promise<void> {
  const options = await parseArgs(args)
  const transformOptions = Object.assign({}, options.parser, options.transform)
  const result = await transform(options.file, transformOptions)
  process.stdout.write(JSON.stringify(result))
}

export function cli() {
  const argv = yargs
    .usage('tessellate-transform [OPTIONS] FILE')
    .option('type-prefix', {
      type: 'string',
      describe: 'Prefix for React class names.'
    })
    .option('json-map', {
      type: 'string',
      describe: 'JSON property mapping file.'
    })
    .option('root', {
      type: 'string',
      describe: 'Type of surrounding root element.'
    })
    .demand(1)
    .argv
  main(argv).catch(e => process.stderr.write('' + e))
}
