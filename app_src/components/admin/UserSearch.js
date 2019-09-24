import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Row, Col, Button, Form, Table, Alert } from 'react-bootstrap'
import { searchUserByEmail, searchUserByFullName } from '../../utils/api'
import MyAlert from './MyAlert'


class UserSearch extends Component {

    state = {
        email: true,
        name: false,
        
        emailSearch: '',
        searchResults: [],
        serverRes: ''

    }

    handleEmailSearch = (e) => {
        e.preventDefault()
        e.target.value !== '' ?
            searchUserByEmail(e.target.value)
                .then(res => res.json())
                .then((res) => {
                    this.setState({ searchResults: res.searchUser })
                })

            :
            this.setState({ searchResults: [] })
    }

    handleSearch = (e) => {
        e.preventDefault()

        if (this.state.email === true) {
            return
        }

        const primerNombre = e.target.primerNombre.value
        const apellidoPaterno = e.target.apellidoPaterno.value
        const apellidoMaterno = e.target.apellidoMaterno.value

        if(!primerNombre || !apellidoPaterno || !apellidoMaterno) {
            this.setState({serverRes: 'Ingresa todos los campos requeridos'})
            return
        }

        searchUserByFullName({primerNombre, apellidoPaterno, apellidoMaterno})
            .then(res => res.json())
            .then(res => {                
                this.setState({ searchResults: res.searchUser })
            })
    }

    handleSearchSelect = (rn) => () => {
        rn === 'name'
            ? this.setState({ email: false, name: true })
            : this.setState({ email: true, name: false })
    }

    closeAlert = () => {
        this.setState({ serverRes: '' })
    }

    render() {

        const { email, name, searchResults, serverRes } = this.state

        return (
            <Fragment>
                <Row style={{ marginTop: 40 }}>
                    <Col md={{ span: 6, offset: 3 }}>
                       
                        
                        <Form onSubmit={this.handleSearch}>

                            <h3>Búsqueda de Cliente</h3>
                            
                            <Form.Group style={{ marginTop: 20 }}>
                                <Form.Check type="radio" inline label="Busqueda por email" id="radio-email" checked={email} onChange={this.handleSearchSelect('email')} />
                                <Form.Check type="radio" inline label="Busqueda por nombre" id="radio-name" checked={name} onChange={this.handleSearchSelect('name')} />
                            </Form.Group>

                            <MyAlert serverRes={serverRes} error={true} closeAlert={this.closeAlert} />
                            
                            {
                                email === true
                                    ?
                                    <Form.Group>
                                        <Form.Control size="lg" type="text" placeholder="Busqueda por email" onChange={this.handleEmailSearch} />
                                    </Form.Group>
                                    :
                                    <Form.Row>
                                        <Form.Group as={Col} md="4">
                                            <Form.Control name="primerNombre" size="lg" type="text" placeholder="Primer Nombre" />
                                        </Form.Group>
                                        <Form.Group as={Col} md="4">
                                            <Form.Control name="apellidoPaterno" size="lg" type="text" placeholder="Apellido Paterno" />
                                        </Form.Group>
                                        <Form.Group as={Col} md="4">
                                            <Form.Control name="apellidoMaterno" size="lg" type="text" placeholder="Apellido Materno" />
                                        </Form.Group>
                                        <Form.Label>

                                        </Form.Label>
                                    </Form.Row>
                            }

                            <Button type="submit" variant="primary" size="lg">Buscar</Button>
                        </Form>
                    </Col>
                </Row>

                <Row style={{ marginTop: 40 }}>
                    <Col md={{ span: 6, offset: 3 }}>
                        <Table>
                            <thead>
                                <tr>

                                    <td>UserID</td>
                                    <td>Email</td>
                                    <td>Nombre completo</td>
                                    <td>Tipo de cuenta</td>
                                    <td>Nivel de cuenta</td>
                                    <td>Ver perfil</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    searchResults.length === 0
                                        ?
                                        <tr>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                            <td>-</td>
                                        </tr>
                                        :
                                        Object.values(searchResults).map((result) => {
                                            //console.log(result);
                                            //let primerNombre = 'primerNombre' in 
                                            //let fullName = result.userProfile.primerNombre + ' ' + result.userProfile.apellidoPaterno + ' ' + result.userProfile.apellidoMaterno;
                                            return (<tr key={result.id}>
                                                <td>{result.id}</td>
                                                <td>{result.email}</td>
                                                <td>-</td>
                                                <td>{result.accountType}</td>
                                                <td>{result.accountLevel}</td>
                                                <td>
                                                    <Link to={"/admin/user/" + result.id}>
                                                        <Button>Ver perfil</Button>
                                                    </Link>
                                                </td>
                                            </tr>)
                                        })
                                }
                            </tbody>
                        </Table>

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

export default connect(mapStateToProps)(UserSearch)
