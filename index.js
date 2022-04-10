#!/usr/bin/env node

import { execa } from 'execa'
import chalk from 'chalk'
import Conf from 'conf'
import prompts from 'prompts'
import uniqBy from 'lodash.uniqby'
import orderBy from 'lodash.orderby'

class AbortedError extends Error {}

const config = new Conf({ projectName: 'commit-ez' })

if (!config.has('username')) {
  const username = await prompts({
    type: 'text',
    name: 'value',
    message: 'How would you like your name to be shown in git?',
    validate: value => Boolean(value)
  })
  config.set('username', username.value)
}

try {
  const history = config.get('history') || []

  const response = await prompts([{
    type: 'select',
    name: 'type',
    message: 'Select the type of change you\'re committing',
    choices: ['feat', 'fix', 'refactor', 'test', 'chore', 'style', 'docs'].map(option => ({
        title: option,
        value: option
      })
    )
  }, {
    type: 'select',
    name: 'card',
    message: 'Which card do you work for?',
    choices: ['input manually', ...getCardNumbers(history)].map(option => ({
        title: option,
        value: option
      })
    )
  }, {
    type: prev => prev === 'input manually' ? 'text' : null,
    name: 'card',
    message: 'Input card number',
    validate: value => Boolean(value)
  }, {
    type: 'text',
    name: 'description',
    message: 'What did this commit do?',
    validate: value => Boolean(value)
  }], {
    onCancel: () => {
      throw new AbortedError()
    }
  })

  await execa('git', ['add', '.'])
  const commitMessage = `[${config.get('username')}] #${response.card} ${response.type}: ${response.description}`

  config.set('history', [...history, {
    username: config.get('username'),
    date: new Date(),
    ...response
  }])

  const { stdout } = await execa('git', ['commit', '-m', commitMessage])
  console.log(stdout)
} catch (e) {
  if (e instanceof AbortedError) {
    process.exitCode = 1
  }
  console.error(chalk.red(e.message))
}

function getCardNumbers (history) {
  const descHistory = orderBy(history, 'date', 'desc')
  return uniqBy(descHistory, 'card').slice(0, 5).map(h => h.card)
}
