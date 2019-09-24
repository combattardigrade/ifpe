import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setAuthedUser } from '../actions/authedUser'
import { handleLogin } from '../actions/authentication'
import { getLoginCSRFToken } from '../utils/api'
import { Link } from  'react-router-dom'
import { Form, Button } from 'react-bootstrap'

class Login extends Component {
    // https://www.robinwieruch.de/react-warning-cant-call-setstate-on-an-unmounted-component
    _isMounted = false
    
    componentDidMount() {
        this._isMounted = true
        // get csrf token
        getLoginCSRFToken()
            .then(res => {
                if(this._isMounted) {
                    console.log(res)
                    this.setState({
                        csrf: res.csrf
                    })
                }
            })
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    state = {
        email: '',
        password: '',
        csrf: ''
    }
    
    handleEmailChange = (e) => {
        e.preventDefault()
        this.setState({
            email: e.target.value
        })
    }

    handlePassChange = (e) => {
        e.preventDefault()
        this.setState({
            password: e.target.value
        })
    }
    
    handleSubmit = (e) => {
        e.preventDefault()
        const { email, password, csrf } = this.state
        const { dispatch } = this.props
        dispatch(handleLogin(email,password,csrf,()=>{
            this.setState({
                redirect: true
            })
        }))
    }

    render() {
        return (
            <Form>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" value={this.state.email} onChange={this.handleEmailChange} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" value={this.state.password} onChange={this.handlePassChange} />
                </Form.Group>
                <Button variant="primary" onClick={this.handleSubmit}>
                    Entrar
                </Button>
            </Form>
        )
    }
}

function mapStateToProps({}) {
    return {

    }
}

export default connect(mapStateToProps)(Login)