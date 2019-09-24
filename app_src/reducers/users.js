import { SAVE_USERS } from '../actions/users'

export default function users(state = null, action) {
    switch(action.type) {
        case SAVE_USERS:
            return {
                ...state,
                users: action.users
            }
        default:
            return state
    }
}