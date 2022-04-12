import { FORMAT } from './constants.js'
import { config } from './lib/config.js'

export const isTwStyle = () => {
  return config.get('format') === FORMAT.THOUGHTWORKS
}

// use for prompts cancel
export const onCancel = () => {
  process.exit(1)
}
