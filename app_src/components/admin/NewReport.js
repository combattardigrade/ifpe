import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Row, Col, Button, Form, Table, Alert } from 'react-bootstrap'
import { getCSRFToken, createReport } from '../../utils/api'
import MyAlert from './MyAlert'
import Loading from '../Loading'


class NewReport extends Component {

    state = {
        loading: true,
        serverRes: '',
        alertError: true,
        csrf: ''
    }

    componentDidMount() {
        document.title = 'Generar nuevo reporte | Sistema Automatizado'
        getCSRFToken()
            .then(res => this.setState({ csrf: res.csrf, loading: false }))
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const alias = e.target.alias.value
        const { csrf } = this.state

        if(!alias) {
            this.setState({alertError: true, serverRes: 'Ingresa todos los campos requeridos.'})
            return
        }

        createReport({alias, _csrf: csrf})
            .then(res => res.json())
            .then(res => {
                console.log(res)
                if('message' in res) {
                    this.setState({alertError: true, serverRes: res.message})
                    return
                } else if ('id' in res) {
                    this.setState({alertError: false, serverRes: 'Reporte nuevo generado correctamente.'})
                    // redirect
                    return
                } else {
                    this.setState({alertError: true, serverRes: 'Ocurrió un error al intentar realizar la operación'})
                    return
                }
            })
    }

    render() {

        const { serverRes, alertError, loading } = this.state

        if (loading) {
            <Loading />
        }

        return (
            <Fragment>
                <Row style={{ marginTop: 40 }}>
                    <Col md={{ span: 6, offset: 3 }}>
                        <Form onSubmit={this.handleSubmit}>
                            <h3>Generar nuevo reporte</h3>
                            <MyAlert serverRes={serverRes} error={alertError} closeAlert={e => this.setState({ serverRes: '' })} />

                            <Form.Group>
                                <Form.Label>Alias del reporte: </Form.Label>
                                <Form.Control name="alias" type="text" placeholder="Ingresa un alias para identificar el reporte " />
                            </Form.Group>

                            <Button type="submit" variant="primary" size="lg">Generar reporte</Button>
                        </Form>
                    </Col>
                </Row>
            </Fragment>
        )
    }
}

function mapStateToProps() {
    return {

    }
}

export default connect(mapStateToProps)(NewReport)
