import Conf from 'conf'
import prompts from 'prompts'
import { FORMAT } from '../constants.js'
import { onCancel } from '../utils.js'
import { pkg } from '../env.js'

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
