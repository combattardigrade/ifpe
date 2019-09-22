import React, { Component } from 'react'
import { connect } from 'react-redux'


class AdminDashboard extends Component {
    render() {
        return (
            <h1>Dashboard</h1>
        )
    }
}

function mapStateToProps() {
    return {
        
    }
}

export default connect(mapStateToProps)(AdminDashboard)