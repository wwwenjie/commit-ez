import fetch from 'node-fetch'
import { config } from '../config.js'
import prompts from 'prompts'
import { onCancel } from '../../utils.js'

export const id = 'TRELLO'

export const displayName = 'Trello'

/**
 * @typedef {Object} CardOptionValue
 * @property {string|number} cardNumber - id of the card
 * @property {string} cardDescription - description of the card
 */

/**
 * @typedef {Object} CardOption
 * @property {string} title - card title which display to user
 * @property {CardOptionValue} value - card id and description
 */

/**
 * Get cards from trello, return card options
 *
 * @returns {CardOption[]}
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

  const response = await fetch('https://api.trello.com/1/members/me/cards?' + authQuery, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
  })
  const cards = await response.json()

  return cards.map(card => ({
    title: `#${card.idShort} ${card.name}`,
    value: {
      cardNumber: card.idShort,
      cardDescription: card.name,
    }
  }))
}

export const setToken = async () => {
  const { key, token } = await prompts([{
    type: 'text',
    name: 'key',
    message: 'Input trello key',
    validate: value => Boolean(value)
  }, {
    type: 'text',
    name: 'token',
    message: 'Input trello token',
  }], { onCancel })

  config.set(id, {
    key,
    token,
  })
}
