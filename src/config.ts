import * as core from '@actions/core'
import yaml from 'js-yaml'
import fs from 'fs'

export interface Team {
  org: string
  name: string
}
interface Group {
  name: string
  reviewers?: number
  internal_reviewers?: number
  usernames?: string[]
  teams?: Team[]
}
export interface Config {
  groups: Group[]
}

export const missingReviewersOrInternalReviewers =
  'One of `reviewers` or `internal_reviewers` should be set'
export const missingUsernamesOrTeamsMessage =
  'One of `usernames` or `teams` should be set'
export const missingTeamOrgOrNameMessage = `Team requires both org and name values to be set`

export const getConfig = (): Config => {
  const configPath = core.getInput('config', {required: true})

  try {
    const config = yaml.safeLoad(fs.readFileSync(configPath, 'utf8')) as Config

    for (const group of config.groups) {
      if (!group.reviewers && !group.internal_reviewers) {
        throw new Error(missingReviewersOrInternalReviewers)
      }

      if (!group.usernames?.length && !group.teams?.length) {
        throw new Error(missingUsernamesOrTeamsMessage)
      }

      if (group?.teams?.length) {
        for (const team of group.teams) {
          if (!team.org || !team.name) {
            throw new Error(missingTeamOrgOrNameMessage)
          }
        }
      }
    }

    return config
  } catch (error) {
    core.setFailed(error.message)
  }

  return {groups: []}
}
