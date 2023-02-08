import { INTEGRATION } from '../../constants.js'
import { config } from '../config.js'
import ora from 'ora'
import fetch from 'node-fetch'
import prompts from 'prompts'
import { onCancel } from '../../utils.js'
import chalk from 'chalk'

export const id = INTEGRATION.JIRA

export const displayName = 'Jira'

/**
 * Get cards from trello, return card options
 *
 * @returns {Promise<CardOption[]>}
 */
export const fetchCardOptions = async () => {
  let { site, project, email, token } = config.get(id) || {}

  if (!site || !email || !token) {
    await setToken()
    site = config.get(id).site
    project = config.get(id).project
    email = config.get(id).email
    token = config.get(id).token
  }

  const spinner = ora(`Loading cards from ${displayName}`).start()
  let fetchUrl = `https://${site}/rest/api/3/search?jql=assignee=currentUser()`
  if (project) {
    fetchUrl = fetchUrl + `%20AND%20project=${project}`
  }
  const response = await fetch(fetchUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Basic ${Buffer.from(`${email}:${token}`).toString('base64')}`
    },
  }).catch((error) => {
    spinner.fail('Failed to fetch cards: ' + error.message)
    process.exit(1)
  })
  spinner.succeed()
  if (response.status === 401) {
    console.log('Invalid token, please set a new one')
    await setToken()
    return fetchCardOptions()
  }
  const res = await response.json()

  return res.issues.map(isuue => ({
    title: `#${isuue.key} ${isuue.fields.summary}`,
    value: {
      number: isuue.key,
      name: isuue.fields.summary,
    }
  }))
}

export const setToken = async () => {
  console.log('Please go to https://id.atlassian.com/manage-profile/security/api-tokens to get your token')
  const configStored = config.get(id) || {}
  const { site, project, email, token } = await prompts([{
    type: 'text',
    name: 'site',
    message: 'onRender',
    initial: configStored.site,
    onRender () {
      this.msg = `Input jira site ${chalk.gray('For example, your-domain.atlassian.net')}`
    },
    validate: value => Boolean(value)
  }, {
    type: 'text',
    name: 'project',
    message: 'onRender',
    initial: configStored.site,
    onRender () {
      this.msg = `Input project key if you want to distinguish projects ${chalk.gray(`(Return to skip) View projects at https://your-domain.atlassian.net/jira/projects`)}`
    }
  }, {
    type: 'text',
    name: 'email',
    message: 'Input jira email',
    initial: configStored.email,
    validate: value => Boolean(value)
  }, {
    type: 'password',
    name: 'token',
    message: 'Input jira token',
  }], { onCancel })

  config.set(id, {
    email,
    token,
    site: site.replace('https://', ''),
    project
  })
}
