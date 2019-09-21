import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

// components
import Loading from './Loading'
import Login from './Login'
import withAuth from './withAuth'

// actions



class App extends Component {

  componentDidMount() {
    //this.props.dispatch(handleInitialData())
  }

  render() {
    
    const { loading, authedUser } = this.props

    return (
      <Router>
        <Fragment>
          {
            loading === true
            ? <Loading />
            :
            <Fragment>
              <Route path='/login' exact component={Login} />
              <Route path='/secret' exact component={withAuth(Secret)} />
              
            </Fragment>
          }
        </Fragment>
      </Router>
    )
  }
}




function Secret() {
  return (
    <h1>hello</h1>
  )
}




function mapStateToProps({ authedUser, loading }) {
  return {
    authedUser,
    loading
  }
}

export default connect(mapStateToProps)(App)