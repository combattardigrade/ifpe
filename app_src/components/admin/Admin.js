import React, { Component, Fragment } from 'react'
import { Route } from 'react-router-dom'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'
import withAdminAuth from '../withAdminAuth'
import Users from './Users'
import UserProfile from './UserProfile'
import UserSearch from './UserSearch'
import MyNav from './MyNav'
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
                    <Route path={`${match.path}/operations/:operationType`} component={withAdminAuth(UserProfile)} />
                </Container>
            </div>
        )
    }
}

export default Admin

