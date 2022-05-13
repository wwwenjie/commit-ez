import chalk from 'chalk'
import prompts from 'prompts'
import _ from 'lodash'
import { execa } from 'execa'
import { config, configFormat, configUsername } from './config.js'
import { FORMAT } from '../constants.js'
import { onCancel } from '../utils.js'

const { orderBy, uniqBy, find, last, get } = _

export const commit = async ({ staged = false }) => {
  if (!config.has('format')) {
    console.log(chalk.cyan('It seems to be the first run, let\'s do some configuration first'))
    await configFormat()
  }

  const isTwStyle = config.get('format') === FORMAT.THOUGHTWORKS

  if (!config.has('username') && isTwStyle) {
    await configUsername()
  }

  const history = config.get('history') || []

  const cardOptions = getCardOptions(history)

  const response = await prompts([{
    type: 'select',
    name: 'type',
    message: 'Select the type of change you\'re committing',
    choices: ['feat', 'fix', 'refactor', 'test', 'chore', 'style', 'docs'].map(option => ({
      title: option,
      value: option
    }))
  }, {
    type: _ => isTwStyle ? 'select' : null,
    name: 'cardChoice',
    message: 'Which card do you work for?',
    choices: [...cardOptions, {
      title: 'input manually',
      value: 'input manually'
    }]
  }, {
    type: (_, { cardChoice }) => cardChoice === 'input manually' ? 'text' : null,
    name: 'cardNumber',
    message: 'Input card number',
    validate: value => Boolean(value)
  }, {
    type: 'text',
    name: 'description',
    message: 'What did this commit do?',
    validate: value => Boolean(value)
  }, {
    type: (_, { cardChoice }) => cardChoice === 'input manually' ? 'text' : null,
    name: 'cardDescription',
    message: 'Input card description (Return to skip)',
    onRender () {
      this.msg = `Input card description ${chalk.gray('(Return to skip)')}`
    }
  }], { onCancel })

  if (!staged) {
    await execa('git', ['add', '.'], { stdio: 'inherit' })
      .catch(() => {
        process.exit(1)
      })
  }

  const cardNumber = response.cardNumber || response.cardChoice
  const cardDescription = response.cardDescription || get(find(cardOptions, { value: cardNumber }), 'description')
  const newHistory = {
    username: config.get('username'),
    date: new Date(),
    type: response.type,
    description: response.description,
    card: {
      number: cardNumber,
      description: cardDescription
    }
  }

  config.set('history', [...history, newHistory])

  await execa('git', ['commit', '-m', getCommitMessage(newHistory)], { stdio: 'inherit' })
    .catch(() => {
      process.exit(1)
    })
}

export const outputHistory = () => {
  const history = config.get('history') || []

  if (history.length === 0) {
    console.log('no history yet')
  }

  orderBy(history, 'date', 'desc').forEach(h => {
    const hasCardNumber = h.card.number
    console.log(hasCardNumber ?
      `${new Date(h.date).toLocaleString()}  [${h.username}] #${h.card.number} ${h.type}: ${h.description}` :
      `${new Date(h.date).toLocaleString()}  ${h.type}: ${h.description}`)
  })
}

export const redo = async () => {
  const lastHistory = last(config.get('history') || [])

  if (!lastHistory) {
    console.log('no history yet')
    process.exit(1)
  }

  await execa('git', ['add', '.'], { stdio: 'inherit' })
    .catch(() => {
      process.exit(1)
    })

  console.log(chalk.cyan('redoing last commit'))
  console.log(chalk.cyan(getCommitMessage(lastHistory)))

  await execa('git', ['commit', '-m', getCommitMessage(lastHistory)], { stdio: 'inherit' })
    .catch(() => {
      process.exit(1)
    })
}

export const undo = async () => {
  await execa('git', ['reset', '--soft', 'HEAD~1'], { stdio: 'inherit' })
    .catch(() => {
      process.exit(1)
    })

  console.log(chalk.green('success'))
}

function getCardOptions (history) {
  const descHistory = orderBy(history.filter(h => h.card.number), 'date', 'desc')
  return uniqBy(descHistory, 'card.number').slice(0, 5).map(h => {
    const card = h.card
    return {
      title: card.number,
      description: card.description,
      value: card.number
    }
  })
}

function getCommitMessage ({ type, description, username, card }) {
  const format = config.get('format')

  if (format === FORMAT.THOUGHTWORKS) {
    return `[${username}] #${card.number} ${type}: ${description}`
  }

  if (format === FORMAT.CONVENTIONAL) {
    return `${type}: ${description}`
  }
}
