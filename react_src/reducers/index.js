import { combineReducers } from 'redux'
import authedUser from './authedUser'
import loading from './loading'
import authentication from './authentication'

export default combineReducers({
    authedUser,
    loading,
    authentication
})