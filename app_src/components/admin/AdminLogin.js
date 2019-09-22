import React, { Component } from 'react'
import { connect } from 'react-redux'
import { handleLogin, handleLoginCSRF } from '../../actions/authentication'
import { Redirect } from 'react-router-dom'
import Recaptcha from 'react-recaptcha'
// components
import Loading from '../Loading'

class AdminLogin extends Component {
    state = {
        loading: true,
        serverRes: ''
    }

    componentDidMount() {
        document.title = "Admin Login"
        const { dispatch } = this.props
        dispatch(handleLoginCSRF(() => this.setState({ loading: false })))
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const email = e.target.email.value
        const password = e.target.password.value

        const { dispatch, authentication } = this.props
        const csrf = authentication.csrf

        if (!email || !password) {
            this.setState({ serverRes: 'Ingresa todos los campos requeridos' })
            return
        }

        dispatch(handleLogin(email, password, csrf, (res) => {
            'message' in res
                ? this.setState({ serverRes: res.message })
                : this.setState({ redirect: true })
        }))


    }

    render() {
        const { serverRes, redirect, loading } = this.state
        const RECAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY
        
        if (loading === true) {
            return <Loading />
        }

        if (redirect) {
            return <Redirect to={{ pathname: '/admin/dashboard', state: { from: this.props.location.pathname } }} />
        }

        return (
            <div>
                <h1>Admin Login</h1>
                <div>{serverRes}</div>
                <form method="post" onSubmit={this.handleSubmit}>
                    <input type="text" name="email" />
                    <input type="password" name="password" />
                    <button type="submit" >Login</button>
                    <Recaptcha
                        sitekey={RECAPTCHA_SITE_KEY}
                    />
                </form>

            </div>
        )
    }
}

function mapStateToProps({ authentication }) {
    return {
        authentication
    }
}

export default connect(mapStateToProps)(AdminLogin)