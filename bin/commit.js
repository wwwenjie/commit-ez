#!/usr/bin/env node

import { program } from 'commander'
import { clearConfig, configFormat, configUsername, outputConfigJson } from '../lib/config.js'
import { commit, outputHistory, redo, undo } from '../lib/commit.js'
import { checkNodeVersion, checkUpdate, commandParseInt } from '../utils.js'
import { pkg } from '../env.js'

checkNodeVersion(pkg.engines.node, pkg.name)
checkUpdate()

program
  .name('commit')
  .version(pkg.version)
  .description('A git commit cli help git users to write git commit messages easily.')
  .option('-s, --staged', 'only commit staged files', false)
  .option('-d, --deep <length>', 'length of cards for selecting', commandParseInt, 5)
  .action(async () => {
    await commit(program.opts())
  })

program
  .command('redo')
  .description('commit again with last message')
  .action(async () => {
    await redo()
  })

program
  .command('undo')
  .description('undo last commit')
  .action(async () => {
    await undo()
  })

program
  .command('ls')
  .description('output commit message history')
  .action(() => {
    outputHistory()
  })

program
  .command('clear')
  .description('clear all config and history')
  .action(async () => {
    await clearConfig()
  })

program
  .command('config [value]')
  .description('inspect and modify the config')
  .option('--username', 'config username')
  .option('--format', 'config commit message format')
  .option('--json', 'output json result')
  .action(async (_, options) => {
    if (options.username) {
      await configUsername()
    }
    if (options.format) {
      await configFormat()
    }
    if (options.json) {
      outputConfigJson()
    }
  })

program.parse()
