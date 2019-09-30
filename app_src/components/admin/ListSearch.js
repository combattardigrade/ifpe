import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Row, Col, Button, Form, Table, Alert } from 'react-bootstrap'
import MyAlert from './MyAlert'
import { generalListSearch, getCSRFToken } from '../../utils/api'

class ListSearch extends Component {

    state = {        
        csrf: '',
        searchResults: []
    }

    componentDidMount() {
        document.title = 'Búsqueda en listas'
        getCSRFToken()
            .then(res => this.setState({ csrf: res.csrf }))
    }

    handleSearch = (e) => {
        e.preventDefault()

        e.target.value !== ''
            ?
            generalListSearch({ name: e.target.value, _csrf: this.state.csrf })
                .then(res => res.json())
                .then((res) => {
                    console.log(res)
                    this.setState({ searchResults: res })
                })
            :
            this.setState({ searchResults: [] })
    }

    render() {

        const {  searchResults } = this.state

        return (
            <Fragment>
                <Row style={{ marginTop: 40 }}>
                    <Col md={{ span: 6, offset: 3 }}>
                        <h3>Búsqueda manual en listas</h3>
                        <Form style={{marginTop:20}}>                            
                            <Form.Group >
                                <Form.Control size="lg" type="text" placeholder="Ingresar nombre" onChange={this.handleSearch} />
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
                <Row style={{ marginTop: 40 }}>
                    <Col md={{ span: 6, offset: 3 }}>
                        <Table>
                            <thead>
                                <tr>
                                    <td>ID</td>
                                    <td>Nombre</td>
                                    <td>País</td>
                                    <td>Motivo</td>
                                    <td>Lista</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    'personasBloqueadas' in searchResults && (
                                        searchResults.personasBloqueadas.length > 0
                                            ?
                                            Object.values(searchResults.personasBloqueadas).map((result) => {
                                                //console.log(result);
                                                //let primerNombre = 'primerNombre' in 
                                                //let fullName = result.userProfile.primerNombre + ' ' + result.userProfile.apellidoPaterno + ' ' + result.userProfile.apellidoMaterno;
                                                return (<tr key={result.id}>
                                                    <td>{result.id}</td>
                                                    <td>{result.name}</td>
                                                    <td>{result.country}</td>
                                                    <td>{result.motive}</td>
                                                    <td>Personas Bloqueadas</td>
                                                </tr>)
                                            })
                                            : null
                                    )
                                }
                                {
                                    'personasSancionadas' in searchResults && (
                                        searchResults.personasSancionadas.length > 0
                                            ?
                                            Object.values(searchResults.personasSancionadas).map((result) => {
                                                //console.log(result);
                                                //let primerNombre = 'primerNombre' in 
                                                //let fullName = result.userProfile.primerNombre + ' ' + result.userProfile.apellidoPaterno + ' ' + result.userProfile.apellidoMaterno;
                                                return (<tr key={result.id}>
                                                    <td>{result.id}</td>
                                                    <td>{result.name}</td>
                                                    <td>{result.country}</td>
                                                    <td>{result.motive}</td>
                                                    <td>Personas Sancionadas (OFAC)</td>
                                                </tr>)
                                            })
                                            : null
                                    )
                                }
                                {
                                    'personasBoletinadas' in searchResults && (
                                        searchResults.personasBoletinadas.length > 0
                                            ?
                                            Object.values(searchResults.personasBoletinadas).map((result) => {
                                                //console.log(result);
                                                //let primerNombre = 'primerNombre' in 
                                                //let fullName = result.userProfile.primerNombre + ' ' + result.userProfile.apellidoPaterno + ' ' + result.userProfile.apellidoMaterno;
                                                return (<tr key={result.id}>
                                                    <td>{result.id}</td>
                                                    <td>{result.name}</td>
                                                    <td>{result.country}</td>
                                                    <td>{result.motive}</td>
                                                    <td>Personas Boletinadas</td>
                                                </tr>)
                                            })
                                            : null
                                    )
                                }
                                {
                                    'peps' in searchResults && (
                                        searchResults.peps.length > 0
                                            ?
                                            Object.values(searchResults.peps).map((result) => {
                                                //console.log(result);
                                                //let primerNombre = 'primerNombre' in 
                                                //let fullName = result.userProfile.primerNombre + ' ' + result.userProfile.apellidoPaterno + ' ' + result.userProfile.apellidoMaterno;
                                                return (<tr key={result.id}>
                                                    <td>{result.id}</td>
                                                    <td>{result.name}</td>
                                                    <td>{result.country}</td>
                                                    <td>{result.motive}</td>
                                                    <td>Personas Boletinadas</td>
                                                </tr>)
                                            })
                                            : null
                                    )
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

export default connect(mapStateToProps)(ListSearch)
