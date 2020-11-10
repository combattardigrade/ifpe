export const SAVE_USERS = 'SAVE_USERS'
import { getUsersByTypeAndLevel } from '../utils/api'

export function loadUsers(accountType = 'all', accountLevel = 0, accountLevelGte = 0, page = 1, cb) {
    return (dispatch) => {
        return getUsersByTypeAndLevel({ accountType, accountLevel, accountLevelGte, page })
            .then(res => res.json())
            .then(res => {
                if('result' in res) {
                    //console.log(JSON.stringify(res.result[0]))
                    dispatch(saveUsers(res.result))
                    cb(res.count,res.pages)
                }
            })
    }
}

export function saveUsers(users) {
    return {
        type: SAVE_USERS,
        users
    }
}