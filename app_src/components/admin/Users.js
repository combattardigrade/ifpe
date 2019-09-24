import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
const qs = require('query-string')
import { loadUsers } from '../../actions/users'
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
        dispatch(loadUsers(params.accountType, query.accountLevel, query.accountLevelGte, query.page, function (count, pages) {
            self.setState({ count, pages, loading: false })
        }))
    }





    render() {
        const { users, match: { params } } = this.props
        const { loading, count, pages } = this.state

        // count total clients without admins
        let totalClients
        if (loading === false && params.accountType === 'all') {
            totalClients = (Object.values(users.users).filter(user => user.accountType !== 'admin')).length
        } else {
            totalClients = count
        }

        return (
            <Row style={{ marginTop: 40 }}>
                <Col md={{ span: 10, offset: 1 }}>
                    <h6>Total: {totalClients} | Total de páginas: {pages}</h6>
                    <h3>Clientes ({params.accountType === 'all' ? 'Todos' : params.accountType === 'persona_fisica' ? "Personas físicas" : "Personas morales"})</h3>
                    <Table striped bordered hover style={{ marginTop: 10 }}>
                        <thead>
                            <tr>
                                <td><b>ID</b></td>
                                <td><b>Email</b></td>
                                <td><b>Nombre completo</b></td>
                                <td><b>Tipo de cuenta</b></td>
                                <td><b>Nivel de cuenta</b></td>
                                <td><b>Nacionalidad</b></td>
                                <td><b>Nivel de riesgo</b></td>
                                <td><b>Fecha de registro</b></td>
                                <td><b>Perfil completo</b></td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                loading === false
                                    ?
                                    Object.values(users.users).filter(user => user.accountType !== 'admin').map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.email}</td>
                                            <td>{user.userProfile.primerNombre}</td>
                                            <td>{user.accountType}</td>
                                            <td>{user.accountLevel}</td>
                                            <td>{user.nationality}</td>
                                            <td>{user.userProfile.nivelRiesgo}</td>
                                            <td>{user.createdAt}</td>
                                            <td>
                                                <Link to={"/admin/user/" + user.id}>
                                                    <Button>Ver perfil</Button>
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