import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getUnusualOperation } from '../../utils/api'
import Loading from '../Loading'
// bootstrap
import { Row, Col, Button, Table } from 'react-bootstrap'

class UnusualOPeration extends Component {
    state = {
        loading: true,
        operation: {}
    }

    componentDidMount() {
        let { match: { params }, } = this.props
        getUnusualOperation(params.operationId)
            .then(res => res.json())
            .then(res => {
                console.log(res)
                this.setState({ loading: false, operation: res.unusualOperation })
            })
    }

    render() {

        const { operation, loading } = this.state

        if (loading) {
            return <Loading />
        }
        console.log(operation)
        return (
            <Row style={{ marginTop: 40 }}>
                <Col md={{ span: 5, offset: 1 }}>
                    <h3>Operación Inusual</h3>

                    <Table striped bordered hover style={{ marginTop: 10 }}>
                        <thead>
                            <tr>
                                <td>Campo</td>
                                <td>Valor</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Alerta</td>
                                <td>{operation.tituloAlerta}</td>
                            </tr>
                            <tr>
                                <td>Tipo Alerta</td>
                                <td>{operation.tipoAlerta}</td>
                            </tr>
                            <tr>
                                <td>Dictamen</td>
                                <td>Pendiente</td>
                            </tr>
                            <tr>
                                <td>Elemento de riesgo</td>
                                <td>{operation.riesgoCliente.elemento}</td>
                            </tr>
                            <tr>
                                <td>Indicador de riesgo</td>
                                <td>{operation.riesgoCliente.indicador}</td>
                            </tr>
                            <tr>
                                <td>Nivel de riesgo</td>
                                <td>{operation.riesgoCliente.nivel}</td>
                            </tr>
                            <tr>
                                <td>Descripción</td>
                                <td>{operation.riesgoCliente.descripcion}</td>
                            </tr>
                            <tr>
                                <td>Coincidencia en Matriz de Riesgo</td>
                                <td>{operation.riesgoCliente.valor}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
                <Col md={{ span: 5 }}>
                    <h3>Datos del Cliente</h3>
                    <Table striped bordered hover style={{ marginTop: 10 }}>
                        <thead>
                            <tr>
                                <td>Campo</td>
                                <td>Valor</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Nombre</td>
                                <td>{operation.user.accountType == 'persona_fisica' ?
                                    operation.user.userProfile.primerNombre + operation.user.userProfile.segundoNombre
                                    + operation.user.userProfile.apellidoPaterno + operation.user.userProfile.apellidoMaterno
                                    : operation.user.companyProfile.razonSocial
                                }</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>{operation.user.email}</td>
                            </tr>
                            <tr>
                                <td>Teléfono</td>
                                <td>{'+' + operation.user.countryCode + ' ' + operation.user.phone}</td>
                            </tr>
                            <tr>
                                <td>Tipo de persona</td>
                                <td>{operation.user.accountType}</td>
                            </tr>
                            <tr>
                                <td>Dirección</td>
                                <td>{
                                    operation.user.addresses[0].calle + ' ' +
                                    operation.user.addresses[0].ext + ' ' +
                                    operation.user.addresses[0].int + '. ' + 
                                    operation.user.addresses[0].asentamiento + '. ' +
                                    operation.user.addresses[0].municipio + '. ' +
                                    operation.user.addresses[0].estado + ', ' + 
                                    operation.user.addresses[0].pais
                                }</td>
                            </tr>
                            <tr>
                                <td>Nacionalidad</td>
                                <td>{operation.user.nationality}</td>
                            </tr>
                            <tr>
                                <td>Nacionalidad</td>
                                <td>{operation.user.nationality}</td>
                            </tr>
                            <tr>
                                <td>Tipo de persona</td>
                                <td>{operation.user.accountType}</td>
                            </tr>
                            <tr>
                                <td>Estado de la cuenta</td>
                                <td>{operation.user.status}</td>
                            </tr>
                            <tr>
                                <td>Fecha de registro</td>
                                <td>{operation.user.createdAt}</td>
                            </tr>
                            <tr>
                                <td>Perfil completo</td>
                                <td>
                                    <Link to={"/admin/user/" + operation.userId}>
                                        <Button>Ver perfil</Button>
                                    </Link>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        )
    }
}

function mapStateToProps() {
    return {

    }
}

export default connect(mapStateToProps)(UnusualOPeration)