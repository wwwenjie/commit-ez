import { FORMAT } from '../../constants.js'

export const id = FORMAT.THOUGHTWORKS

export const displayName = 'Thoughtworks'

export const example = '[name] #N/A feat: your commit message here'

/**
 * @param {CommitHistory} history
 * @return {string} commitMessage
 */
export const getCommitMessage = (history) => {
  const scopeMessage = history.scope ? `(${history.scope})` : ''

  return `[${history.card.username}] #${history.card.number} ${history.type}${scopeMessage}: ${history.description}`
}
