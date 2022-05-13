import { config } from './lib/config.js'
import chalk from 'chalk'
import semver from 'semver'
import fetch from 'node-fetch'
import { execaSync } from 'execa'
import { hasYarn, pkg, __dirname } from './env.js'
import { InvalidArgumentError } from 'commander'

// use for prompts cancel
export const onCancel = () => {
  process.exit(1)
}

export const commandParseInt = (value, _) => {
  const parsedValue = parseInt(value, 10)
  if (isNaN(parsedValue)) {
    throw new InvalidArgumentError('Not a number.')
  }
  return parsedValue
}

export const checkNodeVersion = (wanted, id) => {
  if (!semver.satisfies(process.version, wanted, { includePrerelease: true })) {
    console.log(chalk.red(
      'You are using Node ' + process.version + ', but this version of ' + id +
      ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
    ))
    process.exit(1)
  }
}

export const checkUpdate = () => {
  const { latest, current } = getVersions()
  if (semver.gt(latest, current)) {
    let upgradeMessage = chalk.bold.blue(`${pkg.name} v${current}`)
    upgradeMessage += `\nNew version available ${chalk.magenta(current)} → ${chalk.green(latest)}`

    const command = getGlobalInstallCommand()
    if (command) {
      upgradeMessage +=
        `\nRun ${chalk.yellow(`${command} ${pkg.name}`)} to update!\n`
    }

    console.log(upgradeMessage)
  }
}

export const getVersions = () => {
  const local = pkg.version

  const { latestVersion = local, lastChecked = 0 } = config.get('_version') || {}

  const cached = latestVersion
  const daysPassed = (Date.now() - lastChecked) / (60 * 60 * 1000 * 24)

  if (daysPassed > 1) {
    cacheLatestVersion().catch(() => {})
  }

  let latest = cached

  // if the installed version is updated but the cache doesn't update
  if (semver.gt(local, latest)) {
    latest = local
  }

  return ({
    current: local,
    latest,
  })
}

// fetch the latest version and save it on disk
// so that it is available immediately next time
async function cacheLatestVersion () {
  const response = await fetch('https://registry.npmjs.org/commit-ez/latest', {
    method: 'GET',
  })
  const info = await response.json()

  const { version } = info

  if (semver.valid(version)) {
    config.set('_version', { latestVersion: version, lastChecked: Date.now() })
  }
}

function getGlobalInstallCommand () {
  if (hasYarn()) {
    const { stdout: yarnGlobalDir } = execaSync('yarn', ['global', 'dir'])
    if (__dirname.includes(yarnGlobalDir)) {
      return 'yarn global add'
    }
  }

  const { stdout: npmGlobalPrefix } = execaSync('npm', ['config', 'get', 'prefix'])
  if (__dirname.includes(npmGlobalPrefix)) {
    return `npm i -g`
  }
}
