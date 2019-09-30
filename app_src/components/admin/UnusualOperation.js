import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getUnusualOperation } from '../../utils/api'
import Loading from '../Loading'
// bootstrap
import { Form, Row, Col, Button, Table, Modal } from 'react-bootstrap'
import MyAlert from './MyAlert'
// api
import { sendUnusualOperationReport, getCSRFToken } from '../../utils/api'

class UnusualOPeration extends Component {
    
    state = {
        loading: true,
        operation: {},
        opinion: "improcedente",
        showModal: false,
        serverRes: '',
        csrf: '',
        alertError: true
    }

    componentDidMount() {
        let { match: { params }, } = this.props
        getUnusualOperation(params.operationId)
            .then(res => res.json())
            .then(res => {
                console.log(res)
                this.setState({ loading: false, operation: res.unusualOperation })
            })
        getCSRFToken()
            .then(res => this.setState({ csrf: res.csrf }))

    }

    handleOpinionChange = (e) => {
        e.preventDefault()
        this.setState({ opinion: e.target.value })
    }

    handleSendReport = (e) => {
        e.preventDefault()
        e.persist()

        const dictamen = e.target.dictamen.value
        const analisis = e.target.analisis.value
        const resultado = e.target.resultado.value
        let motivo, medidas

        let { match: { params }, } = this.props
        const { csrf } = this.state

        if (dictamen == "improcedente" && (!analisis || !resultado)) {
            this.setState({ serverRes: 'Ingresa todos los campos requeridos' })
            return
        }

        if (dictamen == 'procedente') {
            motivo = e.target.motivo.value
            medidas = e.target.medidas.value
            if (dictamen == 'procedente' && (!analisis || !resultado || !motivo || !medidas)) {
                this.setState({ serverRes: 'Ingresa todos los campos requeridos' })
                return
            }
        }

        let args = {
            analisis,
            resultado,
            dictamen,
            motivo,
            medidas,
            operationId: params.operationId,
            _csrf: csrf
        }
        sendUnusualOperationReport(args)
            .then(res => res.json())
            .then((res) => {

                if ('id' in res) {
                    this.setState({ alertError: false, serverRes: 'Reporte enviado correctamente', operation: res })

                } else {
                    this.setState({ alertError: true, serverRes: res.message })
                }

                // e.target.dictamen.value = ''
                e.target.analisis.value = ''
                e.target.resultado.value = ''

                if (motivo && medidas) {
                    e.target.motivo.value = ''
                    e.target.medidas.value = ''
                }

            })
    }

    render() {

        const { operation, loading } = this.state

        if (loading) {
            return <Loading />
        }

        return (
            <Fragment>
                <Row style={{ marginTop: 40 }}>
                    <Col sm={{ span: 12 }} md={{ span: 5, offset: 1 }}>
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
                                    <td>{operation.dictamen}</td>
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
                                    <td>Fecha de detección</td>
                                    <td>{operation.createdAt}</td>
                                </tr>
                                <tr>
                                    <td>Coincidencia en Matriz de Riesgo</td>
                                    <td>{operation.riesgoCliente.valor}</td>
                                </tr>
                                <tr>
                                    <td>Dictaminar</td>
                                    <td>
                                        {
                                            operation.dictamen != 'pendiente'
                                                ? <Button >Generar reporte</Button>
                                                :
                                                <Button onClick={e => { e.preventDefault(); this.setState({ showModal: true }) }} variant="success">Enviar dictamen</Button>
                                        }

                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                    <Col sm={{ span: 12 }} md={{ span: 5 }}>
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
                {
                    operation.dictamen != 'pendiente'
                        ?
                        <Row style={{ marginTop: 20 }}>
                            <Col sm={{ span: 12 }} md={{ span: 5, offset: 1 }}>
                                <h3>Datos del reporte</h3>
                                <Table striped bordered hover style={{ marginTop: 10 }}>
                                    <thead>
                                        <tr>
                                            <td>Campo</td>
                                            <td>Valor</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Dictaminado como</td>
                                            <td>{operation.dictamen}</td>
                                        </tr>
                                        <tr>
                                            <td>Análisis realizado</td>
                                            <td>{operation.analisis}</td>
                                        </tr>
                                        <tr>
                                            <td>Resultado del análisis realizado</td>
                                            <td>{operation.resultado}</td>
                                        </tr>
                                        <tr>
                                            <td>Motivo del reporte (cuando sí se reporta)</td>
                                            <td>{operation.motivo}</td>
                                        </tr>
                                        <tr>
                                            <td>Medidas (cuando sí se reporta)</td>
                                            <td>{operation.medidas}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        : null
                }


                <MyModal
                    showModal={this.state.showModal}
                    handleSendReport={this.handleSendReport}
                    onHide={() => this.setState({ showModal: false })}
                    report={this.state.opinion}
                    handleOpinionChange={this.handleOpinionChange}
                    serverRes={this.state.serverRes}
                    closeAlert={() => { this.setState({ serverRes: '' }) }}
                    error={this.state.alertError}
                />

            </Fragment>
        )
    }
}

function MyModal(props) {
    return (
        <Modal onHide={props.onHide} show={props.showModal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title>Enviar Dictamen</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row style={{ marginTop: 10 }}>
                    <Col md={{ span: 12 }}>
                        <MyAlert error={props.error} serverRes={props.serverRes} closeAlert={props.closeAlert} />
                        <Form onSubmit={props.handleSendReport}>
                            <Form.Group  >
                                <Form.Label>Dictamen:</Form.Label>
                                <Form.Control name="dictamen" as="select" defaultValue="improcedente" onChange={props.handleOpinionChange}>
                                    <option value="improcedente">No reportar como operación inusual</option>
                                    <option value="procedente">Reportar como operación  inusual</option>                                    
                                </Form.Control>
                                <Form.Group style={{ marginTop: 10 }} >
                                    <Form.Label>Análisis realizado:</Form.Label>
                                    <Form.Control name="analisis" as="textarea" rows="3" placeholder="Ingresar el análisis realizado como parte del dictamen" />
                                </Form.Group>
                                <Form.Group style={{ marginTop: 10 }} >
                                    <Form.Label>Resultado del Análisis y Dictamen:</Form.Label>
                                    <Form.Control name="resultado" as="textarea" rows="3" placeholder="Ingresar el resultado del análisis y dictamen" />
                                </Form.Group>
                                {
                                    props.report == 'procedente' && (
                                        <Fragment>
                                            <Form.Group style={{ marginTop: 10 }} controlId="exampleForm.ControlTextarea1">
                                                <Form.Label>Motivo del reporte:</Form.Label>
                                                <Form.Control name="motivo" type="text" placeholder="Ingresar el motivo por el cual se reporta la operación" />
                                            </Form.Group>
                                            <Form.Group style={{ marginTop: 10 }} controlId="exampleForm.ControlTextarea1">
                                                <Form.Label>Medidas:</Form.Label>
                                                <Form.Control name="medidas" as="textarea" rows="3" placeholder="Ingresar las medidas que se tomarán." />
                                            </Form.Group>
                                        </Fragment>
                                    )
                                }

                                <Button type="submit" style={{ marginTop: 10 }} variant="success">Enviar</Button>
                            </Form.Group>

                        </Form>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

function mapStateToProps() {
    return {

    }
}

export default connect(mapStateToProps)(UnusualOPeration)