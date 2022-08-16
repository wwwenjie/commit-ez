import Conf from 'conf'
import prompts from 'prompts'
import { onCancel } from '../utils.js'
import { pkg } from '../env.js'
import chalk from 'chalk'
import { inspect } from 'util'
import { formats } from './formats/index.js'
import { integrations } from './integrations/index.js'

export const config = new Conf({
  projectName: pkg.name, defaults: {
    history: []
  }
})

const choices = [
  { title: 'config commit message format', value: 'format' },
  { title: 'config username', value: 'username' },
  { title: 'config integrations', value: 'integrations' },
  { title: 'output config json result', value: 'json' }
]

export const selectConfig = async () => {
  const { config } = await prompts({
    type: 'select',
    name: 'config',
    message: 'Select a action',
    choices
  }, { onCancel })
  if (config === 'format') {
    await configFormat()
  }
  if (config === 'username') {
    await configUsername()
  }
  if (config === 'integrations') {
    await configIntegrations()
  }
  if (config === 'json') {
    await outputConfigJson()
  }
}

export const configFormat = async () => {
  const { format } = await prompts({
    type: 'select',
    name: 'format',
    message: 'Select the commit message format',
    choices: formats.map(format => ({
      title: format.displayName,
      value: format.id,
      description: format.example
    }))
  }, { onCancel })
  config.set('format', format)
}

export const configUsername = async () => {
  const { username } = await prompts({
    type: 'text',
    name: 'username',
    message: 'How would you like your name to be shown in git?',
    validate: value => Boolean(value)
  }, { onCancel })
  config.set('username', username)
}

export const configIntegrations = async () => {
  const { integrations: selected } = await prompts({
    type: 'multiselect',
    name: 'integrations',
    message: 'Pick integrations',
    choices: integrations.map(integration => ({
      title: integration.displayName,
      value: integration.id,
    })),
    hint: '- Space to toggle. Return to submit',
    instructions: false
  }, { onCancel })
  config.set('integrations', selected)
}

export const clearConfig = async () => {
  const { confirm } = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: 'Are you sure? This is reversible',
  }, { onCancel })
  if (confirm) {
    config.clear()
    console.log(chalk.green('clear success'))
  }
}

export const outputConfigJson = () => {
  console.log(chalk.cyan(`Resolved path: ${config.path}`))
  console.log(inspect(config.store, { showHidden: false, depth: Infinity, colors: true }))
}
