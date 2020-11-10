import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'


class MyNav extends Component {
    render() {
        const { location } = this.props

        return (
            <Navbar style={{ backgroundColor: '#212529' }} variant="dark" expand="lg">
                <LinkContainer to="/">
                    <Navbar.Brand>Sistema Automatizado</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav activeKey={location.pathname + location.search}>
                        <LinkContainer to="/admin/dashboard" exact>
                            <Nav.Link >Inicio</Nav.Link>
                        </LinkContainer>

                    </Nav>
                    <NavDropdown title="Clientes" id="collasible-nav-dropdown" className="dropdown-link">
                        <LinkContainer to="/admin/search/user">
                            <NavDropdown.Item>Buscar cliente </NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/admin/users/all?accountLevel=1&accountLevelGte=1">
                            <NavDropdown.Item>Todos </NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/admin/users/persona_fisica?accountLevel=1&accountLevelGte=1">
                            <NavDropdown.Item>Personas físicas </NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/admin/users/persona_moral?accountLevel=1&accountLevelGte=1">
                            <NavDropdown.Item>Personas morales </NavDropdown.Item>
                        </LinkContainer>
                    </NavDropdown>
                    <NavDropdown title="Operaciones" id="collasible-nav-dropdown2" className="dropdown-link">
                        <LinkContainer to="/admin/operations/inusuales?status=pendiente&page=1">
                            <NavDropdown.Item>Operaciones inusuales (pendientes)</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/admin/operations/inusuales?status=all&page=1">
                            <NavDropdown.Item>Operaciones inusuales (todas)</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/admin/operations/internas_preocupantes=all&page=1">
                            <NavDropdown.Item>Operaciones internas preocupantes (pendientes)</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/admin/operations/internas_preocupantes=all&page=1">
                            <NavDropdown.Item>Operaciones internas preocupantes (todas)</NavDropdown.Item>
                        </LinkContainer>
                    </NavDropdown>
                    <NavDropdown title="Listas" id="collasible-nav-dropdown2" className="dropdown-link">
                        <LinkContainer to="/admin/listas/busqueda" exact>
                            <Nav.Link >Búsqueda Manual</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/admin/listas/addName" exact>
                            <Nav.Link >Añadir Nombre a Lista</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/admin/lista/bloqueadas/1" exact>
                            <Nav.Link >Ver Personas Bloqueadas</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/admin/lista/sancionadas/1" exact>
                            <Nav.Link >Ver Personas Sancionadas</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/admin/lista/boletinadas/1" exact>
                            <Nav.Link >Ver Personas Boletinadas</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/admin/lista/peps/1" exact>
                            <Nav.Link > Ver PEPs</Nav.Link>
                        </LinkContainer>
                    </NavDropdown>
                    <NavDropdown title="Matriz de Riesgo" id="collasible-nav-dropdown2" className="dropdown-link">
                        <LinkContainer to="/admin/matrizRiesgo/all/1" exact>
                            <Nav.Link >Ver Factores de Riesgo</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/admin/matrizRiesgo/agregar" exact>
                            <Nav.Link >Agregar Factor de Riesgo</Nav.Link>
                        </LinkContainer>                        
                    </NavDropdown>
                    <NavDropdown title="Reportes" id="collasible-nav-dropdown2" className="dropdown-link">                        
                        <LinkContainer to="/admin/reporte" exact>
                            <Nav.Link >Generar nuevo reporte</Nav.Link>
                        </LinkContainer>    
                        <LinkContainer to="/admin/reportes/1" exact>
                            <Nav.Link >Ver Reportes</Nav.Link>
                        </LinkContainer>                    
                    </NavDropdown>

                </Navbar.Collapse>
            </Navbar>
        )
    }
}

function mapStateToProps({ }) {
    return {

    }
}

export default withRouter(connect(mapStateToProps)(MyNav))