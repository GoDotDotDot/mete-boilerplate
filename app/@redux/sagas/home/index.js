import {takeLatest, put} from 'redux-saga/effects'
import {SEARCH_USERS_REPO} from '@redux/constants/home'
import {githubRepoLoaded, githubRepoError} from '@redux/actions/home'
import request from 'utils/request'
import {message} from 'antd'
function parseRepoDataToList (data) {
  // return Array.prototype.map.call(data, (ele) => ele.full_name)
  return data
}

function * getGithubReps (action) {
  try {
    const data = yield request(`https://api.github.com/users/${action.name}/repos?type=all&sort=updated`)
    yield put(githubRepoLoaded(parseRepoDataToList(data)))
  } catch (err) {
    yield put(githubRepoError(err.message))
    message.error(err.message)
  }
}

export default function * homeSaga () {
  yield takeLatest(SEARCH_USERS_REPO, getGithubReps)
}
