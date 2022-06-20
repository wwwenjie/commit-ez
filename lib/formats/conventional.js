import { FORMAT } from '../../constants.js'

export const id = FORMAT.CONVENTIONAL

export const displayName = 'Conventional'

export const example = 'feat: your commit message here'

/**
 * @param {CommitHistory} history
 * @return {string} commitMessage
 */
export const getCommitMessage = (history) => {
  const scopeMessage = history.scope ? `(${history.scope})` : ''

  return `${history.type}${scopeMessage}: ${history.description}`
}
