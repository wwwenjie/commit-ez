#!/usr/bin/env node

import chalk from 'chalk'
import prompts from 'prompts'
import { program } from 'commander'
import { config, configFormat, configUsername } from '../lib/config.js'
import { commit } from '../lib/commit.js'
import { checkNodeVersion, onCancel, pkg } from '../utils.js'
import { showHistory } from '../lib/history.js'

checkNodeVersion(pkg.engines.node, pkg.name)

program
  .name('commit')
  .version(pkg.version)
  .description('A git commit cli help git users to write git commit messages easily.')
  .option('-s, --staged', 'only commit staged files')
  .action(async () => {
    await commit(program.opts())
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
      console.log(chalk.cyan(`Resolved path: ${config.path}`))
      console.log(config.store)
    }
  })

program
  .command('ls')
  .description('output commit message history')
  .action(() => {
    showHistory()
  })

program
  .command('clear')
  .description('clear all config and history')
  .action(async () => {
    const confirm = await prompts({
      type: 'confirm',
      name: 'value',
      message: 'Are you sure? This is reversible',
    }, { onCancel })
    if (confirm.value) {
      config.clear()
      console.log(chalk.green('clear success'))
    }
  })

program.parse()
