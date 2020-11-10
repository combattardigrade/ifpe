import { SAVE_TOKEN, SAVE_CSRF } from '../actions/authentication'

export default function authentication(state = null, action) {
    switch(action.type) {
        case SAVE_TOKEN:
            return {
                ...state,
                token: action.token
            }
        case SAVE_CSRF:
            return {
                ...state,
                csrf: action.csrf
            }
        default:
            return state
    }
}