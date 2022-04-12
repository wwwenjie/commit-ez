import { FORMAT } from './constants.js'
import { config } from './lib/config.js'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

export const isTwStyle = () => {
  return config.get('format') === FORMAT.THOUGHTWORKS
}

// use for prompts cancel
export const onCancel = () => {
  process.exit(1)
}

export const pkg = require('./package.json')
