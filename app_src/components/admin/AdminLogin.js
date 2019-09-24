import React, { Component } from 'react'
import { connect } from 'react-redux'
import { handleLogin, handleLoginCSRF } from '../../actions/authentication'
import { Redirect } from 'react-router-dom'
import Recaptcha from 'react-google-recaptcha'
// components
import Loading from '../Loading'
import { Row, Col, Form, Button, Alert } from 'react-bootstrap'

class AdminLogin extends Component {
    state = {
        loading: true,
        serverRes: '',
    }

    recaptchaRef = React.createRef()

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

        const recaptchaValue = this.recaptchaRef.current.getValue()

        if (!email || !password || !recaptchaValue) {
            this.setState({ serverRes: 'Ingresa todos los campos requeridos' })
            return
        }

        const params = {
            email,
            password,
            _csrf: csrf,
            'g-recaptcha-response': recaptchaValue
        }

        dispatch(handleLogin(params, (res) => {
            'message' in res
                ? this.setState({ serverRes: res.message })
                : this.setState({ redirect: true })
        }))

        // reset recaptcha
        this.recaptchaRef.current.reset()
    }

    closeAlert = () => {
        this.setState({ serverRes: '' })
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
            <Row style={{ marginTop: 40 }}>
                <Col md={{ span: 6, offset: 3 }}>
                    <h2>Iniciar sesión</h2>
                    
                    <Alert show={serverRes != '' ? true : false} onClose={this.closeAlert} variant="danger" dismissible>
                        {serverRes}
                    </Alert>
                    
                    <Form method="post" onSubmit={this.handleSubmit} style={{marginTop:20}}>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control name="email" type="email" placeholder="Enter email" value={this.state.email} onChange={this.handleEmailChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control name="password" type="password" placeholder="Enter password" value={this.state.password} onChange={this.handlePassChange} />
                        </Form.Group>
                        <Form.Group>
                            <Recaptcha
                                ref={this.recaptchaRef}
                                sitekey={RECAPTCHA_SITE_KEY}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" size="lg" block>
                            Entrar
                        </Button>
                    </Form>
                </Col>
            </Row>
        )
    }
}

function mapStateToProps({ authentication }) {
    return {
        authentication
    }
}

export default connect(mapStateToProps)(AdminLogin)