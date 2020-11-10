const API = 'http://localhost:3000/admin/'

// pld
export function getCSRFToken() {
    return fetch(API + 'csrf', {
        method: 'GET',
        credentials: 'include'
    })
        .then(res => res.json())
}

export function changeUserRiskLevel(params) {
    const url = API + 'pld/changeUserRiskLevel'
    return fetch(url, {
        method: 'PUT',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
}

export function deleteOperation(params) {
    const url = API + 'pld/reporte/deleteOperation/' + params.operationId
    return fetch(url, {
        method: 'DELETE',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
}

export function deleteReport(params) {
    const url = API + 'pld/reporte/' + params.reporteId
    return fetch(url, {
        method: 'DELETE',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
}

export function addReportOperation(params) {
    const url = API + 'pld/reporte/addOperation'
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
}

export function getReportOperations(params) {
    const url = API + 'pld/reporte/' + params.reportId
    return fetch(url, {
        method: 'GET',
        credentials: 'include'
    })
}

export function createReport(params) {
    const url = API + 'pld/reporte'
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
}

export function getAllReportsByPage(params) {
    const url = API + 'pld/reportes/' + params.page
    return fetch(url, {
        method: 'GET',
        credentials: 'include'
    })
}

export function editRiskFactor(params) {
    const url = API + 'pld/editRiskFactor'
    return fetch(url, {
        method: 'PUT',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
}

export function getRiskFactors(params) {
    const url = API + 'pld/getRiskFactors/' + params.elemento
        + '/' + params.page
    return fetch(url, {
        method: 'GET',
        credentials: 'include'
    })
}

export function addNameToList(params) {
    const url = API + 'pld/addNameToList'
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
}

export function getListByPage(params) {
    const url = API + 'pld/getListByPage/' + params.list + '/' + params.page
    return fetch(url, {
        method: 'GET',
        credentials: 'include'
    })
}

export function generalListSearch(params) {
    const url = API + 'pld/generalListSearch'
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
}

export function sendUnusualOperationReport(params) {
    const url = API + 'pld/sendUnusualOperationReport'
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
}

export function getUnusualOperation(operationId) {
    const url = API + 'pld/getUnusualOperation/' + operationId
    return fetch(url, {
        method: 'GET',
        credentials: 'include'
    })
}

export function getUnusualOperations(params) {
    const status = params.status ? params.status : 'all'
    const page = params.page ? parseInt(params.page) : 1
    const url = API + 'pld/getUnusualOperations/' + status + '/' + page
    return fetch(url, {
        method: 'GET',
        credentials: 'include'
    })
}


export function getClientProfile(userId) {
    return fetch(API + 'getClientProfile/' + userId, {
        method: 'GET',
        credentials: 'include'
    })
}

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