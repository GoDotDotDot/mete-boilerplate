/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage component.
 */
import { defineMessages } from 'react-intl'

export default defineMessages({
  search: {
    id: 'app.pages.HomePage.search',
    defaultMessage: 'Search'
  },
  message: {
    id: 'app.pages.HomePage.message',
    defaultMessage: 'search users github repo with the input value you typed by click search button.'
  },
  errorMsg: {
    id: 'app.pages.HomePage.errorMsg',
    defaultMessage: 'Not Found!'
  }
})
