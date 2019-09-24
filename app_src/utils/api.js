const API = 'http://localhost:3000/admin/'

export function searchUserByFullName(params) {
    return fetch(API + 'searchUserByFullName?primerNombre=' + params.primerNombre +
        '&apellidoPaterno=' + params.apellidoPaterno + '&apellidoMaterno=' + params.apellidoMaterno, {
        method: 'GET',
        credentials: 'include'
    })
}

export function searchUserByEmail(email) {
    return fetch(API + 'searchUserByEmail?email=' + email, {
        method: 'GET',
        credentials: 'include'
    })
}


export function getUsersByTypeAndLevel(params) {
    const accountType = params.accountType ? params.accountType : 'all'
    const accountLevel = params.accountLevel ? parseInt(params.accountLevel) : 0
    const accountLevelGte = params.accountLevelGte ? parseInt(params.accountLevelGte) : 0
    const page = params.page ? parseInt(params.page) : 1
    
    const url = API + 'getUsersByTypeAndLevel?accountType=' +
        accountType + '&accountLevel=' + accountLevel +
        '&accountLevelGte=' + accountLevelGte + '&page=' + page
    return fetch(url, {
        method: 'GET',
        credentials: 'include'
    })
}

export function checkAdminAuth() {
    return fetch(API + 'checkPrivileges', {
        method: 'GET',
        credentials: 'include'
    })
}

export function checkToken() {
    return fetch(API + 'checkAuth', {
        method: 'GET',
        credentials: 'include'
    })
        //.then(res => res.json())
}

export function getLoginCSRFToken() {
    return fetch(API + 'login', {
        method: 'GET',
        credentials: 'include'
    })
        .then(res => res.json())
}

export function login(params) {  
    return fetch(API + 'login', {
        method: 'post',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    }) 
        .then(response => response.json())
        
              
}


// Notes
// CSRF tokens in cookies
// https://stackoverflow.com/questions/20504846/why-is-it-common-to-put-csrf-prevention-tokens-in-cookies
// Using cookies with react and redux 
// https://medium.com/@rossbulat/using-cookies-in-react-redux-and-react-router-4-f5f6079905dc
// cookies, jwt security
// https://medium.com/@jcbaey/authentication-in-spa-reactjs-and-vuejs-the-right-way-e4a9ac5cd9a3