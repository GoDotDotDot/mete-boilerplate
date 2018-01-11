import { createSelector } from 'reselect'

const selectHome = state => state.get('home')
// const selectGlobal = state => state.get('global')

const makeSelectUsername = () =>
  createSelector(selectHome, homeState => homeState.get('name'))

const makeSelectRepos = () =>
  createSelector(selectHome, homeState => homeState.get('repoData'))

const makeSelectLoading = () =>
  createSelector(selectHome, homeState => homeState.get('loading'))

const makeSelectError = () =>
  createSelector(selectHome, homeState => homeState.get('error'))
export {
  selectHome,
  makeSelectUsername,
  makeSelectRepos,
  makeSelectLoading,
  makeSelectError
}
