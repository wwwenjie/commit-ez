import { execaSync } from 'execa'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

let _hasYarn
export const hasYarn = () => {
  if (_hasYarn != null) {
    return _hasYarn
  }
  try {
    execaSync('yarn --version', { stdio: 'ignore' })
    return (_hasYarn = true)
  } catch (e) {
    return (_hasYarn = false)
  }
}

export const __dirname = dirname(fileURLToPath(import.meta.url))

export const pkg = require('./package.json')
