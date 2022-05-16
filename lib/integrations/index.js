import {
  id as trelloId,
  displayName as trelloDisplayName,
  fetchCardOptions as fetchTrelloCardOptions
} from './trello.js'

export const integrations = [
  {
    id: trelloId,
    displayName: trelloDisplayName,
    fetchCardOptions: fetchTrelloCardOptions
  }
]
