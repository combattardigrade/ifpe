import React, { Component, Fragment } from 'react'
import { Route } from 'react-router-dom'

import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'

class Admin extends Component {
    render() {
        const { match } = this.props
        console.log(match)
        return (
            <div>
                <Route path={match.path} exact component={AdminLogin} />
                <Route path={`${match.path}/login`} component={AdminLogin} />
                <Route path={`${match.path}/dashboard`} component={AdminDashboard} />
            </div>
        )
    }
}

export default Admin

