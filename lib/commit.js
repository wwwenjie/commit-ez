import chalk from 'chalk'
import prompts from 'prompts'
import _ from 'lodash'
import { execa } from 'execa'
import { isTwStyle, onCancel } from '../utils.js'
import { config, configFormat, configUsername } from './config.js'
import { FORMAT } from '../constants.js'

const { orderBy, uniqBy, find, get } = _

export const commit = async ({ staged = false }) => {
  if (!config.has('format')) {
    console.log(chalk.cyan('It seems to be the first run, let\'s do some configuration first'))
    await configFormat()
  }

  if (!config.has('username') && config.get('format') === FORMAT.THOUGHTWORKS) {
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
    type: _ => isTwStyle() ? 'select' : null,
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

  if (!staged) {
    await execa('git', ['add', '.'], { stdio: 'inherit' })
      .catch(() => {
        process.exit(1)
      })
  }

  const cardNumber = response.cardNumber || response.cardChoice
  const cardDescription = response.cardDescription || get(find(cardOptions, { value: cardNumber }), 'description')
  const commitMessage = isTwStyle() ? `[${config.get('username')}] #${cardNumber} ${response.type}: ${response.description}` : `${response.type}: ${response.description}`

  config.set('history', [...history, {
    username: config.get('username'),
    date: new Date(),
    type: response.type,
    description: response.description,
    card: {
      number: cardNumber,
      description: cardDescription
    }
  }])

  await execa('git', ['commit', '-m', commitMessage], { stdio: 'inherit' })
    .catch(() => {
      process.exit(1)
    })
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
