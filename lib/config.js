import Conf from 'conf'
import prompts from 'prompts'
import { FORMAT } from '../constants.js'
import { onCancel } from '../utils.js'
import { pkg } from '../env.js'
import chalk from 'chalk'
import { inspect } from 'util'

export const config = new Conf({ projectName: pkg.name })

export const configFormat = async () => {
  const format = await prompts({
    type: 'select',
    name: 'value',
    message: 'Select the commit message format',
    choices: [{
      title: 'conventional',
      value: FORMAT.CONVENTIONAL,
      description: 'feat: your commit message here'
    }, {
      title: 'thoughtworks',
      value: FORMAT.THOUGHTWORKS,
      description: '[name] #N/A feat: your commit message here'
    }]
  }, { onCancel })
  config.set('format', format.value)
}

export const configUsername = async () => {
  const username = await prompts({
    type: 'text',
    name: 'value',
    message: 'How would you like your name to be shown in git?',
    validate: value => Boolean(value)
  }, { onCancel })
  config.set('username', username.value)
}

export const clearConfig = async () => {
  const confirm = await prompts({
    type: 'confirm',
    name: 'value',
    message: 'Are you sure? This is reversible',
  }, { onCancel })
  if (confirm.value) {
    config.clear()
    console.log(chalk.green('clear success'))
  }
}

export const outputConfigJson = () => {
  console.log(chalk.cyan(`Resolved path: ${config.path}`))
  console.log(inspect(config.store, { showHidden: false, depth: Infinity, colors: true }))
}
