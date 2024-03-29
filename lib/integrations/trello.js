import fetch from 'node-fetch'
import { config } from '../config.js'
import prompts from 'prompts'
import { onCancel } from '../../utils.js'
import { INTEGRATION } from '../../constants.js'
import ora from 'ora'

export const id = INTEGRATION.TRELLO

export const displayName = 'Trello'

/**
 *
 *
 * @returns {Promise<CardOption[]>}
 */
export const fetchCardOptions = async () => {
  let { key, token } = config.get(id) || {}

  if (!key || !token) {
    await setToken()
    key = config.get(id).key
    token = config.get(id).token
  }

  const authQuery = new URLSearchParams({
    key,
    token,
  })

  const spinner = ora(`Loading cards from ${displayName}`).start()
  const response = await fetch('https://api.trello.com/1/members/me/cards?' + authQuery, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
  }).catch((error) => {
    spinner.fail('Failed to fetch cards: ' + error.message)
    process.exit(1)
  })
  spinner.succeed()
  if (response.status === 401) {
    console.log('Invalid token, please set a new one')
    await setToken()
    return fetchCardOptions()
  }
  const cards = await response.json()

  return cards.map(card => ({
    title: `#${card.idShort} ${card.name}`,
    value: {
      number: card.idShort,
      name: card.name,
    }
  }))
}

export const setToken = async () => {
  console.log('Please go to https://trello.com/app-key to get your key and token')
  const { key, token } = await prompts([{
    type: 'password',
    name: 'key',
    message: 'Input trello key',
    validate: value => Boolean(value)
  }, {
    type: 'password',
    name: 'token',
    message: 'Input trello token',
  }], { onCancel })

  config.set(id, {
    key,
    token,
  })
}
