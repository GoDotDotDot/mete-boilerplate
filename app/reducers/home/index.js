import { fromJS } from 'immutable'

import {CHANGE_USERNAME, SEARCH_USERS_REPO} from 'constants/home'

const initialState = fromJS({
  name: 'default value'
})
function homeReducer (state = initialState, action) {
  switch (action.type) {
    case CHANGE_USERNAME:
      console.log('action:', action)
      console.log('state:', state)

      return state.set('name', action.name)
    case SEARCH_USERS_REPO:
      return state.set('name', action.name, 'home')
    default:
      return state
  }
}
export default homeReducer
