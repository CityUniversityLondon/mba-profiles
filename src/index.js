import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import reducer from './reducers'
import './index.css';
import App from './App';
import MainPage from './MainPage';
import registerServiceWorker from './registerServiceWorker';

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
    	<Route exact path="/:filter?" component={MainPage} />

    </Router>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker();
