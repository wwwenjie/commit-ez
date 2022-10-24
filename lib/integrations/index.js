import {
  id as trelloId,
  displayName as trelloDisplayName,
  fetchCardOptions as fetchTrelloCardOptions
} from './trello.js'
import {
  id as jiraId,
  displayName as jiraDisplayName,
  fetchCardOptions as fetchJiraCardOptions
} from './jira.js'

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
  },
  {
    id: jiraId,
    displayName: jiraDisplayName,
    fetchCardOptions: fetchJiraCardOptions
  }
]
