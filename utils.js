import { FORMAT } from './constants.js'
import { config } from './lib/config.js'
import { createRequire } from 'module'
import chalk from 'chalk'
import semver from 'semver'

const require = createRequire(import.meta.url)

export const isTwStyle = () => {
  return config.get('format') === FORMAT.THOUGHTWORKS
}

// use for prompts cancel
export const onCancel = () => {
  process.exit(1)
}

export const pkg = require('./package.json')

export const checkNodeVersion = (wanted, id) => {
  if (!semver.satisfies(process.version, wanted, { includePrerelease: true })) {
    console.log(chalk.red(
      'You are using Node ' + process.version + ', but this version of ' + id +
      ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
    ))
    process.exit(1)
  }
}
