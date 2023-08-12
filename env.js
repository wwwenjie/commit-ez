import { execaSync } from 'execa'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

let _hasYarn
let _hasPnpm

export const hasYarn = () => {
  if (_hasYarn != null) {
    return _hasYarn
  }
  try {
    execaSync('yarn --version', { stdio: 'ignore' })
    _hasYarn = true
  } catch (e) {
    _hasYarn = false
  }
  return _hasYarn
}

export const hasPnpm = () => {
  if (_hasPnpm != null) {
    return _hasPnpm
  }
  try {
    execaSync('pnpm --version', { stdio: 'ignore' })
    _hasPnpm = true
  } catch (e) {
    _hasPnpm = false
  }
  return _hasPnpm
}

export const __dirname = dirname(fileURLToPath(import.meta.url))

export const pkg = require('./package.json')
