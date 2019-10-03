import React, { Component, Fragment } from 'react'
import { Route } from 'react-router-dom'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'
import withAdminAuth from '../withAdminAuth'
import Users from './Users'
import UserProfile from './UserProfile'
import UserSearch from './UserSearch'
import MyNav from './MyNav'
import Operations from './Operations'
import UnusualOperation from './UnusualOperation'
import ListSearch from './ListSearch'
import ViewList from './ViewList'
import AddListName from './AddListName'
import RiskMatrix from './RiskMatrix'
import Report from './Report'
import ListReports from './ListReports'
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/custom.css'
import { Container } from 'react-bootstrap'

class Admin extends Component {
    render() {
        const { match } = this.props

        return (
            <div>
                <MyNav />
                <Container fluid>
                    <Route path={match.path} exact component={AdminLogin} />
                    <Route path={`${match.path}/login`} component={AdminLogin} />
                    <Route path={`${match.path}/dashboard`} component={withAdminAuth(AdminDashboard)} />
                    <Route path={`${match.path}/users/:accountType`} component={withAdminAuth(Users)} />
                    <Route path={`${match.path}/user/:userId`} component={withAdminAuth(UserProfile)} />
                    <Route path={`${match.path}/search/user`} component={withAdminAuth(UserSearch)} />
                    <Route path={`${match.path}/operations/:operationType`} component={withAdminAuth(Operations)} />
                    <Route path={`${match.path}/operation/:operationId`} component={withAdminAuth(UnusualOperation)} />
                    <Route path={`${match.path}/listas/busqueda`} component={withAdminAuth(ListSearch)} />                
                    <Route path={`${match.path}/lista/:list/:page`} component={withAdminAuth(ViewList)} />                
                    <Route path={`${match.path}/listas/addName`} component={withAdminAuth(AddListName)} />
                    <Route path={`${match.path}/matrizRiesgo/:elemento/:page`} component={withAdminAuth(RiskMatrix)} />
                    <Route path={`${match.path}/reportes/:page`} component={withAdminAuth(ListReports)} />
                    <Route path={`${match.path}/reporte/nuevo`} component={withAdminAuth(Report)} />
                </Container>
            </div>
        )
    }
}

export default Admin

