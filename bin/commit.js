#!/usr/bin/env node

import { program } from 'commander'
import { clearConfig, selectConfig } from '../lib/config.js'
import { commit, outputHistory, redo, undo } from '../lib/commit.js'
import { checkNodeVersion, checkUpdate, commandParseInt } from '../utils.js'
import { pkg } from '../env.js'
import { isEmpty } from 'lodash-es'
import chalk from 'chalk'

checkNodeVersion(pkg.engines.node, pkg.name)
checkUpdate()

program.enablePositionalOptions()

program
  .name('commit')
  .version(pkg.version)
  .description('A git commit cli help git users to write git commit messages easily.')
  .option('-p, --push', 'run git pull -r and git push after committing', false)
  .option('-s, --scope', 'add scope to commit message', false)
  .option('--staged', 'only commit staged files', false)
  .option('-d, --deep <length>', 'length of cards for selecting', commandParseInt, 5)
  .action(async (options) => {
    if (!isEmpty(program.args)) {
      console.log(chalk.red('invalid argument'))
      process.exit(1)
    }

    await commit(options)
  })

program
  .command('redo')
  .description('commit again with last message')
  .option('-p, --push', 'run git pull -r and git push after committing', false)
  .action(async (options) => {
    await redo(options)
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
  .option('-d, --deep <length>', 'length of history to output', commandParseInt, 999)
  .action((options) => {
    outputHistory(options)
  })

program
  .command('clear')
  .description('clear all config and history')
  .action(async () => {
    await clearConfig()
  })

program
  .command('config')
  .description('inspect and modify the config')
  .action(async () => {
    await selectConfig()
  })

program.parse()
