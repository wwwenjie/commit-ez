import chalk from 'chalk'
import prompts from 'prompts'
import { execa } from 'execa'
import { config, configFormat, configUsername } from './config.js'
import { FORMAT, INPUT_MANUALLY } from '../constants.js'
import { onCancel } from '../utils.js'
import { integrations } from './integrations/index.js'
import { find, get, last, map, orderBy, uniqBy } from 'lodash-es'
import { formats } from './formats/index.js'

export const commit = async ({ scope, staged, deep, push }) => {
  if (!config.has('format')) {
    console.log(chalk.cyan('It seems to be the first run, let\'s do some configuration first'))
    await configFormat()
  }

  const isTwStyle = config.get('format') === FORMAT.THOUGHTWORKS

  if (isTwStyle && !config.has('username')) {
    await configUsername()
  }

  const history = config.get('history')

  const cardOptions = getCardOptions(history, deep)

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
    choices: [
      ...cardOptions,
      ...integrations.map(integration => ({
        title: `Get From ${integration.displayName}`,
        value: integration.id
      })),
      {
        title: 'Input Manually',
        value: INPUT_MANUALLY
      }]
  }, {
    type: () => scope ? 'text' : null,
    name: 'scope',
    message: 'Input scope',
    validate: value => Boolean(value)
  }, {
    type: (_, { cardChoice }) => cardChoice === INPUT_MANUALLY ? 'text' : null,
    name: 'cardNumber',
    message: 'Input card number',
    validate: value => Boolean(value)
  }, {
    type: (_, { cardChoice }) => cardChoice === INPUT_MANUALLY ? 'text' : null,
    name: 'cardName',
    message: 'Input card name (Return to skip)',
    onRender () {
      this.msg = `Input card name ${chalk.gray('(Return to skip)')}`
    }
  }, {
    type: (_, { cardChoice }) => map(integrations, 'id').includes(cardChoice) ? null : 'text',
    name: 'description',
    message: 'What did this commit do?',
    validate: value => Boolean(value)
  }], { onCancel })

  const isChooseIntegration = map(integrations, 'id').includes(response.cardChoice)
  const isChooseHistory = response.cardChoice !== INPUT_MANUALLY && !isChooseIntegration

  if (isChooseIntegration) {
    const integration = find(integrations, { id: response.cardChoice })
    const options = await integration.fetchCardOptions()
    const { card } = await prompts({
      type: 'select',
      name: 'card',
      message: 'Select the card',
      choices: options
    }, { onCancel })
    response.cardNumber = card.number
    response.cardName = card.name

    const { description } = await prompts({
      type: 'text',
      name: 'description',
      message: 'What did this commit do?',
      validate: value => Boolean(value)
    }, { onCancel })
    response.description = description
  }

  if (isChooseHistory) {
    response.cardNumber = response.cardChoice
    response.cardName = get(find(cardOptions, { value: response.cardChoice }), 'name')
  }

  const cardNumber = response.cardNumber
  const cardName = response.cardName
  const newHistory = {
    date: new Date(),
    type: response.type,
    scope: response.scope,
    description: response.description,
    format: config.get('format')
  }
  if (isTwStyle) {
    newHistory.card = {
      number: cardNumber,
      name: cardName,
      username: config.get('username'),
    }
  }

  config.set('history', [...history, newHistory])

  if (!staged) {
    await execa('git', ['add', '.'], { stdio: 'inherit' })
      .catch(() => {
        process.exit(1)
      })
  }

  await execa('git', ['commit', '-m', getCommitMessage(newHistory)], { stdio: 'inherit' })
    .catch(() => {
      process.exit(1)
    })

  if (push) {
    await execa('git', ['pull', '-r'], { stdio: 'inherit' })
      .catch(() => {
        process.exit(1)
      })
    await execa('git', ['push'], { stdio: 'inherit' })
      .catch(() => {
        process.exit(1)
      })
  }
}

export const outputHistory = ({ deep }) => {
  const history = config.get('history')

  if (history.length === 0) {
    console.log('no history yet')
  }

  orderBy(history, 'date', 'desc').slice(0, deep).forEach(h => {
    console.log(`${new Date(h.date).toLocaleString()}  ${getCommitMessage(h)}`)
  })
}

export const redo = async ({ push }) => {
  const lastHistory = last(config.get('history'))

  if (!lastHistory) {
    console.log('no history yet')
    process.exit(1)
  }

  await execa('git', ['add', '.'], { stdio: 'inherit' })
    .catch(() => {
      process.exit(1)
    })

  const commitMessage = getCommitMessage(lastHistory)

  console.log(chalk.cyan('redoing last commit'))
  console.log(chalk.cyan(commitMessage))

  await execa('git', ['commit', '-m', commitMessage], { stdio: 'inherit' })
    .catch(() => {
      process.exit(1)
    })

  if (push) {
    await execa('git', ['pull', '-r'], { stdio: 'inherit' })
      .catch(() => {
        process.exit(1)
      })
    await execa('git', ['push'], { stdio: 'inherit' })
      .catch(() => {
        process.exit(1)
      })
  }
}

export const undo = async () => {
  await execa('git', ['reset', '--soft', 'HEAD~1'], { stdio: 'inherit' })
    .catch(() => {
      process.exit(1)
    })

  console.log(chalk.green('success'))
}

function getCardOptions (history, deep) {
  const descHistory = orderBy(history.filter(h => get(h, 'card.number')), 'date', 'desc')
  return uniqBy(descHistory, 'card.number').slice(0, deep).map(h => {
    const card = h.card
    return {
      title: card.number,
      description: card.name,
      value: card.number
    }
  })
}

function getCommitMessage (history) {
  const format = find(formats, { id: history.format })

  return format.getCommitMessage(history)
}
