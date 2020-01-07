//import "babel-polyfill";//ES6 polyfill for IE10 and down
import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import reducer from './reducers'
import app from './app';


import {
  BrowserRouter as Router, Route 
} from 'react-router-dom';

const middleware = [ thunk ]
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}


const store = createStore(
  reducer,
  applyMiddleware(...middleware)
)



window.React =React
window.store =store

render(
  <Provider store={store}>
    <Router>	
    	<Route exact path="/study/undergraduate/alumni-stories:filter?" component={app} />

    </Router>
  </Provider>,
  document.getElementById('root')
)
