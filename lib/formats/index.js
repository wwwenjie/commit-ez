import {
  id as twId,
  displayName as twDisplayName,
  example as twExample,
  getCommitMessage as twFormat
} from './thoughtworks.js'
import {
  id as conventionalId,
  displayName as conventionalDisplayName,
  example as conventionalExample,
  getCommitMessage as conventionalFormat
} from './conventional.js'

export const formats = [
  {
    id: twId,
    displayName: twDisplayName,
    example: twExample,
    getCommitMessage: twFormat
  },
  {
    id: conventionalId,
    displayName: conventionalDisplayName,
    example: conventionalExample,
    getCommitMessage: conventionalFormat
  }
]
