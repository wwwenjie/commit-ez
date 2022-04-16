#!/usr/bin/env node

import chalk from 'chalk'
import prompts from 'prompts'
import { program } from 'commander'
import { config, configFormat, configUsername } from '../lib/config.js'
import { commit } from '../lib/commit.js'
import { checkNodeVersion, checkUpdate, isTwStyle, onCancel } from '../utils.js'
import { lastHistory, showHistory } from '../lib/history.js'
import { pkg } from '../env.js'
import { inspect } from 'util'
import { execa } from 'execa'
import { getCommitMessage } from '../format.js'

checkNodeVersion(pkg.engines.node, pkg.name)
checkUpdate()

program
  .name('commit')
  .version(pkg.version)
  .description('A git commit cli help git users to write git commit messages easily.')
  .option('-s, --staged', 'only commit staged files')
  .action(async () => {
    await commit(program.opts())
  })

program
  .command('redo')
  .description('commit again with last message')
  .action(async () => {
    const history = lastHistory()

    if (!history) {
      console.log('no history yet')
      process.exit(1)
    }

    await execa('git', ['commit', '-m', getCommitMessage(history)], { stdio: 'inherit' })
      .catch(() => {
        process.exit(1)
      })
  })

program
  .command('undo')
  .description('undo last commit')
  .action(async () => {
    await execa('git', ['reset', '--soft', 'HEAD~1'], { stdio: 'inherit' })
      .catch(() => {
        process.exit(1)
      })
    console.log(chalk.green('success'))
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
      console.log(inspect(config.store, { showHidden: false, depth: Infinity, colors: true }))
    }
  })

program.parse()
