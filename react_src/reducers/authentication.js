import { SAVE_TOKEN } from '../actions/authentication'

export default function authentication(state = null, action) {
    switch(action.type) {
        case SAVE_TOKEN:
            return action.token
        default:
            return state
    }
}