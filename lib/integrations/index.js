import {
  id as trelloId,
  displayName as trelloDisplayName,
  fetchCardOptions as fetchTrelloCardOptions
} from './trello.js'

/**
 * @typedef {Object} CardOptionValue
 * @property {string|number} number - id of the card
 * @property {string} name - name of the card
 */

/**
 * @typedef {Object} CardOption
 * @property {string} title - card title which display to user to select
 * @property {CardOptionValue} value - card id and name
 */

export const integrations = [
  {
    id: trelloId,
    displayName: trelloDisplayName,
    fetchCardOptions: fetchTrelloCardOptions
  }
]
