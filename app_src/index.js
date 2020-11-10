import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { CookiesProvider } from 'react-cookie'
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import reducer from './reducers'
import middleware from './middleware'

const store = createStore(reducer, middleware)

// alert configuration
const options = {
    // you can also just use 'bottom center'
    position: positions.BOTTOM_CENTER,
    timeout: 5000,
    offset: '30px',
    // you can also just use 'scale'
    transition: transitions.SCALE
  }

ReactDOM.render(
    <CookiesProvider>
        <Provider store={store} >
            <AlertProvider template={AlertTemplate} {...options}>
                <App />
            </AlertProvider>
        </Provider>
    </CookiesProvider>,
    document.getElementById('root')
)