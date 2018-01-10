import { fromJS } from 'immutable'

import {CHANGE_USERNAME, SEARCH_USERS_REPO, GITHUB_REPO_LOADED} from 'constants/home'

const initialState = fromJS({
  name: 'godotdotdot',
  repoData: null,
  loading: false
})
function homeReducer (state = initialState, action) {
  switch (action.type) {
    case CHANGE_USERNAME:
      return state.set('name', action.name)
    case SEARCH_USERS_REPO:
      return state.set('loading', true)
    case GITHUB_REPO_LOADED:
      return state.set('repoData', action.repoData).set('loading', false)
    default:
      return state
  }
}
export default homeReducer
