import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Row, Col, Button, Form, Table, Alert } from 'react-bootstrap'
import MyAlert from './MyAlert'
import { addNameToList, getCSRFToken } from '../../utils/api'
import Loading from '../Loading'

class AddListName extends Component {

    state = {
        loading: true,
        csrf: '',
        serverRes: '',
        alertError: true
    }

    componentDidMount() {
        document.title = 'Añadir nombre a lista de personas'
        getCSRFToken()
            .then(res => this.setState({ csrf: res.csrf, loading: false }))
    }

    closeAlert = () => {
        this.setState({ serverRes: '' })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const name = e.target.name.value
        const personType = e.target.personType.value
        const motive = e.target.motive.value
        const country = e.target.country.value
        const list = e.target.list.value
        const { csrf } = this.state

        if (!name || !personType || !motive || !country || !list) {
            this.setState({ serverRes: 'Ingresa todos los campos requeridos', alertError: true })
            return
        }

        addNameToList({
            name,
            personType,
            motive,
            country,
            list,
            _csrf: csrf
        })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                if (res.status == 'OK') {
                    this.setState({ serverRes: res.message, alertError: false })
                    e.target.name.value = ''                    
                    e.target.motive.value = ''
                    e.target.country.value = ''                    
                } else {
                    this.setState({ serverRes: res.message, alertError: true })
                }
            })
    }

    render() {

        const { serverRes, alertError, loading } = this.state

        if (loading) {
            return <Loading />
        }

        return (
            <Fragment>
                <Row style={{ marginTop: 40 }}>
                    <Col sm={{ offset: 12 }} md={{ span: 6, offset: 3 }}>
                        <h3>Añadir persona a lista</h3>
                        <MyAlert serverRes={serverRes} error={alertError} closeAlert={this.closeAlert} />
                        <Form onSubmit={this.handleSubmit} style={{ marginTop: 20 }}>
                            <Form.Group >
                                <Form.Label>Nombre completo:</Form.Label>
                                <Form.Control name="name" size="lg" type="text" placeholder="Ingresar nombre completo" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Tipo de persona:</Form.Label>
                                <Form.Control name="personType" as="select" size="lg" defaultValue="individual" >
                                    <option value="individual">Individuo</option>
                                    <option value="entity">Entidad</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Motivo:</Form.Label>
                                <Form.Control name="motive" size="lg" type="text" placeholder="Ingresar motivo" />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>País:</Form.Label>
                                <Form.Control name="country" size="lg" type="text" placeholder="Ingresar país" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Lista a la que se incluirá:</Form.Label>
                                <Form.Control name="list" as="select" size="lg" defaultValue="bloqueadas" >
                                    <option value="bloqueadas">Lista de Personas Bloqueadas</option>
                                    <option value="sancionadas">Listas de Personas Sancionadas (OFAC)</option>
                                    <option value="boletinadas">Listas de Personas Boletinadas</option>
                                    <option value="peps">Listas de PEPs</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Button type="submit">Añadir</Button>
                            </Form.Group>
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

export default connect(mapStateToProps)(AddListName)
