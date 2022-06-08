import * as core from '@actions/core'
import {
  getConfig,
  missingReviewersOrInternalReviewers,
  missingUsernamesOrTeamsMessage,
  missingTeamOrgOrNameMessage
} from '../src/config'

test('returns a valid and parsed config', () => {
  jest
    .spyOn(core, 'getInput')
    .mockImplementation(() => `${__dirname}/config/validConfigs.yml`)
  const setFailedSpy = jest.spyOn(core, 'setFailed')

  const config = getConfig()
  expect(config.groups.length).toEqual(5)
  expect(setFailedSpy).not.toHaveBeenCalled()
})

test('sends an error when reviewers and internal reviewers are not defined', () => {
  jest
    .spyOn(core, 'getInput')
    .mockImplementation(
      () => `${__dirname}/config/invalidReviewersAndInternalReviewers.yml`
    )
  const setFailedSpy = jest.spyOn(core, 'setFailed').mockImplementation()

  expect(getConfig()).toEqual({groups: []})
  expect(setFailedSpy).toHaveBeenCalledWith(missingReviewersOrInternalReviewers)
})

test('sends an error when usernames and teams are not defined', () => {
  jest
    .spyOn(core, 'getInput')
    .mockImplementation(
      () => `${__dirname}/config/invalidUsernamesAndTeams.yml`
    )
  const setFailedSpy = jest.spyOn(core, 'setFailed').mockImplementation()

  expect(getConfig()).toEqual({groups: []})
  expect(setFailedSpy).toHaveBeenCalledWith(missingUsernamesOrTeamsMessage)
})

test('sends an error when a team is missing org or name values', () => {
  jest
    .spyOn(core, 'getInput')
    .mockImplementation(() => `${__dirname}/config/invalidTeams.yml`)
  const setFailedSpy = jest.spyOn(core, 'setFailed').mockImplementation()

  expect(getConfig()).toEqual({groups: []})
  expect(setFailedSpy).toHaveBeenCalledWith(missingTeamOrgOrNameMessage)
})
