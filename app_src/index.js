import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { CookiesProvider } from 'react-cookie'
import reducer from './reducers'
import middleware from './middleware'

const store = createStore(reducer, middleware)

ReactDOM.render(
    <CookiesProvider>
        <Provider store={store} >
            <App />
        </Provider>
    </CookiesProvider>,
    document.getElementById('root')
)