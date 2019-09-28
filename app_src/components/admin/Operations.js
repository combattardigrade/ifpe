import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { getUnusualOperations } from '../../utils/api'
const qs = require('query-string')

// bootstrap
import { Row, Col, Button, Table } from 'react-bootstrap'

class Users extends Component {

    state = {
        loading: true,
        count: '',
        pages: ''
    }

    componentDidMount() {
        let self = this
        const { match: { params }, dispatch } = this.props
        const query = qs.parse(this.props.location.search)
        
        getUnusualOperations(query)
            .then(res => res.json())
            .then(res => {
                console.log(res)
                self.setState({count: res.count, pages: res.pages, operations: res.result, loading: false})
            })
    }

    render() {
        const { match: { params } } = this.props
        const { loading, operations, count, pages } = this.state
        const query = qs.parse(this.props.location.search)
        
        return (
            <Row style={{ marginTop: 40 }}>
                <Col md={{ span: 10, offset: 1 }}>
                    <h6>Total: {count} | Total de páginas: {pages}</h6>
                    <h3>Operaciones Inusuales ({query.status === 'all' ? 'Todas' : query.status === 'pendiente' ? "Pendientes" : "Completadas"})</h3>
                    <Table striped bordered hover style={{ marginTop: 10 }}>
                        <thead>
                            <tr>
                                <td><b>ID</b></td>
                                <td><b>Alerta</b></td>
                                <td><b>Tipo Alerta</b></td>
                                <td><b>Elemento</b></td>
                                <td><b>Indicador</b></td>
                                <td><b>Estado</b></td>
                                <td><b>Nivel</b></td>
                                <td><b>Descripción</b></td>
                                <td><b>Fecha de detección</b></td>
                                <td><b>Cliente</b></td>
                                <td><b>Perfil Cliente</b></td>
                                <td><b>Dictaminar</b></td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                loading === false
                                    ?
                                    Object.values(operations).map((op) => (
                                        
                                        <tr key={op.id}>     
                                            <td>{op.id}</td>                                       
                                            <td>{op.tituloAlerta}</td>
                                            <td>{op.tipoAlerta}</td>
                                            <td>{op.riesgoCliente.elemento}</td>
                                            <td>{op.riesgoCliente.indicador}</td>
                                            <td><b>{op.dictamen}</b></td>
                                            <td><b>{op.riesgoCliente.nivel}</b></td>
                                            <td>{op.riesgoCliente.descripcion}</td>
                                            <td>{op.createdAt}</td>
                                            <td>{op.user.id}</td>
                                            <td>
                                                <Link to={"/admin/user/" + op.user.id}>
                                                    <Button>Ver perfil</Button>
                                                </Link>
                                            </td>
                                            <td>
                                                <Link to={"/admin/user/" + op.user.id}>
                                                    <Button variant="success">Dictaminar</Button>
                                                </Link>
                                            </td>
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
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                    </tr>
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>



        )
    }
}

function mapStateToProps({ users }) {
    return {
        users
    }
}

export default connect(mapStateToProps)(Users)