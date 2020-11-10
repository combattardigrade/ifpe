import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

class AdminDashboard extends Component {
    render() {
        return (
            <div>
                <h1>Dashboard</h1>
                <Link to='users/all'>Usuarios</Link>
            </div>
        )
    }
}

function mapStateToProps() {
    return {
        
    }
}

export default connect(mapStateToProps)(AdminDashboard)