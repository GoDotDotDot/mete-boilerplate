import {takeLatest, put} from 'redux-saga/effects'
import {SEARCH_USERS_REPO} from 'constants/home'
import {githubRepoLoaded} from 'actions/home'
import request from 'utils/request'

function parseRepoDataToList (data) {
  // return Array.prototype.map.call(data, (ele) => ele.full_name)
  return data
}

function * getGithubReps (action) {
  const data = yield request(`https://api.github.com/users/${action.name}/repos?type=all&sort=updated`)
  yield put(githubRepoLoaded(parseRepoDataToList(data)))
}

export default function * homeSaga () {
  yield takeLatest(SEARCH_USERS_REPO, getGithubReps)
}
