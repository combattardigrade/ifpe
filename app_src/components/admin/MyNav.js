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
                    <Nav activeKey={location.pathname + location.search}>
                        <LinkContainer to="/admin/listas" exact>
                            <Nav.Link >Búsqueda en listas</Nav.Link>
                        </LinkContainer>
                    </Nav>

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