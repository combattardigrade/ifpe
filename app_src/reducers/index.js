import { combineReducers } from 'redux'
import authedUser from './authedUser'
import loading from './loading'
import authentication from './authentication'
import users from './users'

export default combineReducers({
    authedUser,
    loading,
    authentication,
    users
})