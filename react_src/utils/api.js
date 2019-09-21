const API = 'http://localhost:3000/app/'


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
        
        .catch(err => {
            console.log(err)
        })        
}


// Notes
// CSRF tokens in cookies
// https://stackoverflow.com/questions/20504846/why-is-it-common-to-put-csrf-prevention-tokens-in-cookies
// Using cookies with react and redux 
// https://medium.com/@rossbulat/using-cookies-in-react-redux-and-react-router-4-f5f6079905dc
// cookies, jwt security
// https://medium.com/@jcbaey/authentication-in-spa-reactjs-and-vuejs-the-right-way-e4a9ac5cd9a3