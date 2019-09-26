import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button, Table, Tabs, Tab, Modal } from 'react-bootstrap'
import { getClientProfile } from '../../utils/api'
import { Link } from 'react-router-dom'
import Loading from '../Loading'

class UserProfile extends Component {
    state = {
        loading: true,
        user: {},
        docHash: '',
        showModal: false
    }

    componentDidMount() {
        const { match: { params }, dispatch } = this.props
        getClientProfile(params.userId)
            .then(res => res.json())
            .then((res) => {
                console.log(res)
                this.setState({ loading: false, user: res.user })
            })
    }

    handleShowDocument(docHash) {
        this.setState({ showModal: true, docHash: docHash })
    }

    render() {

        const { user, loading } = this.state

        if (loading) {
            return <Loading />
        }
        console.log(user.documents.length)
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
                                                    <td>{user.userProfile.primerNombre + ' ' + user.userProfile.segundoNombre + ' ' + user.userProfile.apellidoPaterno + ' ' + user.userProfile.apellidoMaterno}</td>
                                                </tr>
                                                <tr>
                                                    <td>Email</td>
                                                    <td>{user.email}</td>
                                                </tr>
                                                <tr>
                                                    <td>Celular</td>
                                                    <td>{'+' + user.countryCode + ' ' + user.phone}</td>
                                                </tr>
                                                <tr>
                                                    <td>Domicilio</td>
                                                    <td></td>
                                                </tr>

                                                <tr>
                                                    <td>Nacionalidad</td>
                                                    <td>{user.nationality}</td>
                                                </tr>
                                                <tr>
                                                    <td>Género</td>
                                                    <td>{user.userProfile.gender}</td>
                                                </tr>
                                                <tr>
                                                    <td>Fecha de nacimiento</td>
                                                    <td>{user.userProfile.dateOfBirth}</td>
                                                </tr>
                                                <tr>
                                                    <td>Estado de nacimiento</td>
                                                    <td>{user.userProfile.stateOfBirth}</td>
                                                </tr>
                                                <tr>
                                                    <td>Ocupación</td>
                                                    <td>{user.userProfile.occupation}</td>
                                                </tr>
                                                <tr>
                                                    <td>Origen de los recursos</td>
                                                    <td>{user.sourceOfResources}</td>
                                                </tr>
                                                <tr>
                                                    <td>CURP</td>
                                                    <td>{user.userProfile.curp}</td>
                                                </tr>
                                                <tr>
                                                    <td>RFC</td>
                                                    <td>{user.userProfile.rfc}</td>
                                                </tr>
                                                <tr>
                                                    <td>Nivel de riesgo</td>
                                                    <td>{user.userProfile.nivelRiesgo}</td>
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
                                                    <td>{user.accountType}</td>
                                                </tr>
                                                <tr>
                                                    <td>Nivel de cuenta:</td>
                                                    <td>{user.accountLevel}</td>
                                                </tr>
                                                <tr>
                                                    <td>Estado de la cuenta:</td>
                                                    <td>{user.status}</td>
                                                </tr>
                                                <tr>
                                                    <td>Email verificado:</td>
                                                    <td>{user.emailVerified == 1 ? 'Sí' : 'No'}</td>
                                                </tr>
                                                <tr>
                                                    <td>Celular verificado:</td>
                                                    <td>{user.phoneVerified == 1 ? 'Sí' : 'No'}</td>
                                                </tr>
                                                <tr>
                                                    <td>Localización (GPS) apertura cuenta:</td>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <td>Fecha de creación:</td>
                                                    <td>{user.createdAt}</td>
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
                                                    <td><b>Ver documento</b></td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    user.documents.length >= 1
                                                        ?
                                                        Object.values(user.documents).map((doc) => (
                                                            <tr key={doc.id}>
                                                                <td>{doc.name}</td>
                                                                <td>{doc.status}</td>
                                                                <td>
                                                                    <Button onClick={e => { e.preventDefault(); this.handleShowDocument(doc.hash) }}>Ver documento</Button>
                                                                </td>

                                                            </tr>
                                                        ))

                                                        :
                                                        <tr>
                                                            <td>-</td>
                                                            <td>-</td>
                                                        </tr>
                                                }

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
                                                    
                                                    <td>TxID</td>
                                                    <td>Tipo</td>
                                                    <td>Metodo</td>
                                                    <td>Divisa</td>
                                                    <td>Monto</td>
                                                    <td>Comisión</td>
                                                    <td>IVA</td>
                                                    <td>Procedencia</td>
                                                    <td>Destino</td>
                                                    <td>Clave de rastreo</td>                                                    
                                                    <td>Fecha</td>
                                                    <td>Estado</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    user.transactions.length >= 1
                                                        ?
                                                        Object.values(user.transactions).map((tx) => (
                                                            <tr key={tx.id}>
                                                                <td>{tx.id}</td>
                                                                <td>{tx.operation}</td>
                                                                <td>{tx.method}</td>
                                                                <td>{tx.currency}</td>                                                                
                                                                <td>{tx.amount}</td>                                                                
                                                                <td>{tx.fees}</td>
                                                                <td>{tx.tax}</td>
                                                                <td>{tx.fromAccount}</td>
                                                                <td>{tx.toAccount}</td>
                                                                <td>{tx.trackingKey}</td>
                                                                <td>{tx.createdAt}</td>
                                                                <td>{tx.status}</td>
                                                            </tr>
                                                        ))
                                                        :
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
                                                }

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


                <MyModal showModal={this.state.showModal} docHash={this.state.docHash} onHide={() => this.setState({ showModal: false })} />





            </Fragment>
        )
    }
}

function MyModal(props) {
    return (
        <Modal onHide={props.onHide} show={props.showModal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title>Documento</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <img style={{ width: '100%', height: '100%', maxHeight: '80vh' }} src={process.env.API_HOST + "/document/" + props.docHash} />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

function mapStateToProps({ }) {
    return {

    }
}

export default connect(mapStateToProps)(UserProfile)