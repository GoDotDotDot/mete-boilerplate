import {CHANGE_USERNAME, SEARCH_USERS_REPO} from 'constants/home'

export function changeUsername (name) {
  return {
    type: CHANGE_USERNAME,
    name
  }
}
export function searchUsersGithubRepo () {
  return {
    type: SEARCH_USERS_REPO
  }
}
