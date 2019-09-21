import { login, isAuthenticated } from '../utils/api'
import { setAuthedUser } from './authedUser'
export const SAVE_TOKEN = 'SAVE_TOKEN'




export function handleLogin(email, password, csrf, cb) {
    
    return (dispatch) => {
        return login({email,password,_csrf: csrf})
            
            .then((res) => {
                // save token in store
                if(res.token) {
                    dispatch(saveToken(res.token))
                }

                console.log(res)
                cb()
            })
            .catch((err) => {                
                console.log(err)
            })
    }
}

export function saveToken(token) {
    return {
        type: SAVE_TOKEN,
        token
    }
}
