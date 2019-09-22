import React, { Component, Fragment } from 'react'

import { Redirect } from 'react-router-dom'
import {  checkAdminAuth } from '../utils/api'
import { withCookies } from 'react-cookie';

// Route authentication
// https://medium.com/@faizanv/authentication-for-your-react-and-express-application-w-json-web-tokens-923515826e0

function withAdminAuth(ComponentToProtect) {
    class AdminAuth extends Component {
        state = {
            loading: true,
            redirect: false
        }
    
        componentDidMount() {            
            checkAdminAuth()
                .then(res => {  
                    if(res.status === 200) {
                        this.setState({loading: false})
                    } else {    
                        const error = new Error(res.error)
                        throw error
                    }
                })
                .catch((err) => {
                    console.log(err)
                    this.setState({loading: false, redirect: true})
                })
        }

        render() {
            const { loading, redirect } = this.state
            if(loading) {
                return null
            }
            if(redirect) {
                return <Redirect to={{pathname: '/admin/login', state: { from: this.props.location.pathname }}} />
            }

            return (
                <Fragment>
                    <ComponentToProtect {...this.props} />
                </Fragment>
            )
        }
    }

    return withCookies(AdminAuth)
}

export default withAdminAuth