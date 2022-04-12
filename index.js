#!/usr/bin/env node

import { execa } from 'execa'
import chalk from 'chalk'
import Conf from 'conf'
import prompts from 'prompts'
import uniqBy from 'lodash.uniqby'
import orderBy from 'lodash.orderby'
import { FORMAT } from './constants.js'

class AbortedError extends Error {}

const onCancel = () => {
  throw new AbortedError()
}

const config = new Conf({ projectName: 'commit-ez' })

try {
  if (!config.has('format')) {
    console.log(chalk.cyan('It seems to be the first run, let\'s do some configuration first'))
    await configFormat()
  }

  if (!config.has('username')) {
    await configUsername()
  }

  const history = config.get('history') || []

  const response = await prompts([{
    type: 'select',
    name: 'type',
    message: 'Select the type of change you\'re committing',
    choices: ['feat', 'fix', 'refactor', 'test', 'chore', 'style', 'docs'].map(option => ({
      title: option,
      value: option
    }))
  }, {
    type: _ => isTwStyle() ? 'select' : null,
    name: 'cardChoice',
    message: 'Which card do you work for?',
    choices: [...getCardOptions(history), {
      title: 'input manually',
      value: 'input manually'
    }]
  }, {
    type: (_, { cardChoice }) => cardChoice === 'input manually' ? 'text' : null,
    name: 'cardNumber',
    message: 'Input card number',
    validate: value => Boolean(value)
  }, {
    type: (_, { cardChoice }) => cardChoice === 'input manually' ? 'text' : null,
    name: 'cardDescription',
    message: 'Input card description (Return to skip)',
    onRender () {
      this.msg = `Input card description ${chalk.gray('(Return to skip)')}`
    }
  }, {
    type: 'text',
    name: 'description',
    message: 'What did this commit do?',
    validate: value => Boolean(value)
  }], { onCancel })

  await execa('git', ['add', '.'], { stdio: 'inherit' })
  const cardNumber = response.cardNumber || response.cardChoice
  const commitMessage = isTwStyle() ? `[${config.get('username')}] #${cardNumber} ${response.type}: ${response.description}` : `${response.type}: ${response.description}`

  config.set('history', [...history, {
    username: config.get('username'),
    date: new Date(),
    type: response.type,
    description: response.description,
    card: {
      number: cardNumber,
      description: response.cardDescription
    }
  }])

  await execa('git', ['commit', '-m', commitMessage], { stdio: 'inherit' })
} catch (e) {
  if (e instanceof AbortedError) {
    process.exitCode = 1
  }
  console.error(chalk.red(e.message))
}

function getCardOptions (history) {
  const descHistory = orderBy(history, 'date', 'desc')
  return uniqBy(descHistory, 'card.number').slice(0, 5).map(h => {
    const card = h.card
    return {
      title: card.number,
      description: card.description,
      value: card.number
    }
  })
}

function isTwStyle () {
  return config.get('format') === FORMAT.THOUGHTWORKS
}

async function configFormat () {
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

async function configUsername () {
  const username = await prompts({
    type: isTwStyle() ? 'text' : null,
    name: 'value',
    message: 'How would you like your name to be shown in git?',
    validate: value => Boolean(value)
  }, { onCancel })
  config.set('username', username.value || FORMAT.CONVENTIONAL)
}
