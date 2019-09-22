import { login, getLoginCSRFToken } from '../utils/api'
import { showLoading, hideLoading } from './shared'
export const SAVE_TOKEN = 'SAVE_TOKEN'
export const SAVE_CSRF = 'SAVE_CSRF'

export function handleLoginCSRF(cb) {
    return (dispatch) => {
       
        return getLoginCSRFToken()
            .then(res =>{
                if('csrf' in res ) {
                    dispatch(saveCSRF(res.csrf))                
                }             
                cb()                
            })            
    }
}


export function handleLogin(params, cb) {
    
    return (dispatch) => {
        return login(params)
            
            .then((res) => {
                // remove?               
                // save token in store
                if(res.token) {
                    dispatch(saveToken(res.token))
                }                 
                cb(res)
            })
            .catch((err) => {             
                console.log(err)   
                cb({message: 'Error al intentar realizar la operación'})
            })
    }
}

export function saveToken(token) {
    return {
        type: SAVE_TOKEN,
        token
    }
}

export function saveCSRF(csrf) {
    return {
        type: SAVE_CSRF,
        csrf
    }
}
