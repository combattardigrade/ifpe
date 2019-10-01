import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getRiskFactors } from '../../utils/api'
const qs = require('query-string')
import Loading from '../Loading'
import MyAlert from './MyAlert'
import { editRiskFactor, getCSRFToken } from '../../utils/api'
// bootstrap
import { Row, Col, Button, Table, Modal, Form } from 'react-bootstrap'

class RiskMatrix extends Component {

    state = {
        loading: true,
        count: '',
        pages: '',
        riskFactors: [],
        alertError: true,
        serverRes: '',
        showModal: false
    }

    componentDidMount() {
        let self = this
        const { match: { params } } = this.props
        getCSRFToken()
            .then(res => this.setState({ csrf: res.csrf }))
        getRiskFactors(params)
            .then(res => res.json())
            .then(res => {
                console.log(res)
                self.setState({ count: res.count, pages: res.pages, riskFactors: res.result, loading: false })
            })
    }

    handleEdit = (riskFactorId, riskFactorElement) => {
        this.setState({ showModal: true, riskFactorId, riskFactorElement })
    }

    handleEditRiskFactor = (e) => {
        e.preventDefault()
        e.persist()
        const riskFactorId = e.target.riskFactorId.value
        const indicador = e.target.indicador.value
        const nivel = e.target.nivel.value
        const descripcion = e.target.descripcion.value
        const self = this

        if (!riskFactorId || !indicador || !nivel || !descripcion) {
            this.setState({ showAlert: true, alertError: true, serverRes: 'Ingresa todos los campos requeridos' })
            return
        }

        // api call
        editRiskFactor({
            riskFactorId,
            indicador,
            nivel,
            descripcion,
            _csrf: this.state.csrf
        })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                const { match: { params } } = this.props

                getRiskFactors(params)
                    .then(res => res.json())
                    .then(res => {
                        self.setState({ count: res.count, pages: res.pages, riskFactors: res.result, showAlert: true, alertError: false, serverRes: 'Factor de riesgo editado correctamente' })                        
                        e.target.indicador.value = ''                        
                        e.target.descripcion.value = ''
                    })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    render() {
        const { match: { params } } = this.props
        const { loading, riskFactors, count, pages } = this.state


        if (loading) {
            return <Loading />
        }

        return (
            <Fragment>
                <Row style={{ marginTop: 40 }}>
                    <Col md={{ span: 10, offset: 1 }}>
                        <h6>Total: {count} | Total de páginas: {pages}</h6>
                        <h3>Factores de Riesgo </h3>
                        <Table striped bordered hover style={{ marginTop: 10 }}>
                            <thead>
                                <tr>
                                    <td><b>ID</b></td>
                                    <td><b>Elemento</b></td>
                                    <td><b>Indicador</b></td>
                                    <td><b>Nivel Risgo</b></td>
                                    <td><b>Ponderación</b></td>
                                    <td><b>Descripción</b></td>
                                    <td><b>Fecha de modificación</b></td>
                                    <td><b>Editar</b></td>
                                    {/* <td><b>Eliminar</b></td> */}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    riskFactors.length > 0
                                        ?
                                        Object.values(riskFactors).map((rf) => (

                                            <tr key={rf.id}>
                                                <td>{rf.id}</td>
                                                <td>{rf.elemento}</td>
                                                <td>{rf.indicador}</td>
                                                <td>{rf.nivel}</td>
                                                <td>{rf.ponderacion}</td>
                                                <td>{rf.descripcion}</td>
                                                <td>{rf.updatedAt}</td>
                                                <td>
                                                    <Button onClick={e => { e.preventDefault; this.handleEdit(rf.id, rf.elemento) }}>Editar</Button>
                                                </td>
                                                {/* <td>
                                                    <Button variant="danger">Eliminar</Button>
                                                </td> */}
                                            </tr>
                                        ))
                                        :
                                        <tr>                                            
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                        </tr>
                                }
                            </tbody>
                        </Table>
                        {
                            parseInt(params.page) > 1
                                ?
                                <Link to={'/admin/matrizRiesgo/' + params.elemento + '/' + (parseInt(params.page) - 1)}>
                                    <Button variant="secondary">Página anterior</Button>
                                </Link>
                                :
                                null
                        }
                        <Link to={'/admin/matrizRiesgo/' + params.elemento + '/' + (parseInt(params.page) + 1)}>
                            <Button style={{ marginLeft: 10 }}>Página siguiente</Button>
                        </Link>
                    </Col>
                </Row>

                <MyModal
                    showModal={this.state.showModal}
                    handleEditRiskFactor={this.handleEditRiskFactor}
                    onHide={() => this.setState({ showModal: false })}
                    serverRes={this.state.serverRes}
                    closeAlert={() => { this.setState({ serverRes: '' }) }}
                    alertError={this.state.alertError}
                    riskFactorId={this.state.riskFactorId}
                    riskFactorElement={this.state.riskFactorElement}
                />
            </Fragment>
        )
    }
}

function MyModal(props) {
    return (
        <Modal onHide={props.onHide} show={props.showModal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title>Editar Factor de Riesgo #{props.riskFactorId}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row style={{ marginTop: 10 }}>
                    <Col md={{ span: 12 }}>
                        <MyAlert error={props.alertError} serverRes={props.serverRes} closeAlert={props.closeAlert} />
                        <Form onSubmit={props.handleEditRiskFactor}>
                            <input type="hidden" name="riskFactorId" value={props.riskFactorId} />
                            <Form.Group>
                                <Form.Label>Elemento:</Form.Label>
                                <Form.Control name="elemento" readOnly value={props.riskFactorElement} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Indicador:</Form.Label>
                                <Form.Control name="indicador" placeholder="Ingresar el indicador de riesgo" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Nivel de riesgo:</Form.Label>
                                <Form.Control name="nivel" as="select" defaultValue="bajo" >
                                    <option value="bajo">Bajo</option>
                                    <option value="medio">Medio</option>
                                    <option value="alto">Alto</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Descripción:</Form.Label>
                                <Form.Control name="descripcion" placeholder="Ingresa la descripción del factor de riesgo" />
                            </Form.Group>
                            <Form.Group>
                                <Button type="submit" style={{ marginTop: 10 }} variant="success">Guardar</Button>
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

export default connect(mapStateToProps)(RiskMatrix)