import React from 'react';
import ReactDOM from 'react-dom';
import Home from './views/homePage/index.jsx';
import App from './componment/app.jsx';
import About from './componment/about.jsx';
import './css/app.less'
import { HashRouter, Route, hashHistory, Switch } from 'react-router-dom';

const SliderComponent = () => (
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path="/about" component={About}/>
    </Switch>
  )
  ReactDOM.render((
    <HashRouter history={hashHistory}>
      <SliderComponent />
    </HashRouter>
  ), document.getElementById('root'));