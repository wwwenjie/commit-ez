import { FORMAT } from './constants.js'
import { config } from './lib/config.js'

export const getCommitMessage = ({ type, description, username, card }) => {
  const format = config.get('format')

  if (format === FORMAT.THOUGHTWORKS) {
    return `[${username}] #${card.number} ${type}: ${description}`
  }

  if (format === FORMAT.CONVENTIONAL) {
    return `${type}: ${description}`
  }
}
