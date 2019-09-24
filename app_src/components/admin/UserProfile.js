import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button, Table, Tabs, Tab } from 'react-bootstrap'

class UserProfile extends Component {
    state = {
        loading: true,
    }

    componentDidMount() {
        const { match: { params }, dispatch } = this.props

        // dispatch load userProfile action

    }

    render() {
        return (
            <Fragment>
                <Row style={{ marginTop: 40 }}>
                    <Col md={{ span: 10, offset: 1 }} >
                        <Tabs defaultActiveKey="perfil" id="uncontrolled-tab">
                            <Tab eventKey="perfil" title="Perfil">
                                <Row style={{ marginTop: 20 }}>
                                    <Col md={{ span: 12 }}>
                                        <h3>Datos generales del cliente</h3>
                                        <Table striped bordered hover >
                                            <tbody>
                                                <tr>
                                                    <td>Nombre completo</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>Email</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>Celular</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>Domicilio</td>
                                                    <td></td>
                                                </tr>

                                                <tr>
                                                    <td>Nacionalidad</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>Género</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>Fecha de nacimiento</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>Estado de nacimiento</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>Ocupación</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>Origen de los recursos</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>CURP</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>RFC</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>Nivel de riesgo</td>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </Tab>
                            <Tab eventKey="cuenta" title="Cuenta">
                                <Row style={{ marginTop: 20 }}>
                                    <Col md={{ span: 12 }}>
                                        <h3>Cuenta</h3>
                                        <Table striped bordered hover >
                                            <tbody>
                                                <tr>
                                                    <td>Tipo de cuenta:</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>Nivel de cuenta:</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>Bloqueos de cuenta:</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>Bloqueos de cuenta:</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>Email verificado:</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>Celular verificado:</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>Localización (GPS) apertura cuenta:</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>Fecha de creación:</td>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </Tab>
                            <Tab eventKey="documentos" title="Documentos">
                                <Row style={{ marginTop: 20 }}>
                                    <Col>
                                        <h3>Documentos</h3>
                                        <Table striped bordered hover >
                                            <thead>
                                                <tr>
                                                    <td><b>Documento</b></td>
                                                    <td><b>Estado</b></td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>-</td>
                                                    <td>-</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </Tab>
                            <Tab eventKey="operaciones" title="Operaciones">
                                <Row style={{ marginTop: 20 }}>
                                    <Col md={{ span: 12 }}>
                                        <h3>Operaciones</h3>
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <td>#</td>
                                                    <td>TxID</td>
                                                    <td>Tipo</td>
                                                    <td>Metodo</td>
                                                    <td>Monto</td>
                                                    <td>Procedencia</td>
                                                    <td>Destino</td>
                                                    <td>Clave de rastreo</td>
                                                    <td>Comisión</td>
                                                    <td>Fecha</td>
                                                    <td>Estado</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>#</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </Tab>

                            <Tab eventKey="balances" title="Perfil Transaccional">
                                <Row style={{ marginTop: 20 }}>
                                    <Col md={{ span: 12 }}>
                                        <h3>Balances</h3>
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <td>Balance</td>                                                    
                                                    <td>Volumen mensual actual</td>
                                                    <td>Volumen diario actual</td>
                                                    <td>Volumen diario promedio</td>
                                                    <td>Volumen mensual promedio</td>
                                                    
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    <td>-</td>
                                                    
                                                    
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>








            </Fragment>
        )
    }
}

function mapStateToProps({ }) {
    return {

    }
}

export default connect(mapStateToProps)(UserProfile)