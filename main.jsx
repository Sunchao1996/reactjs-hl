import React from 'react';
import ReactDOM from 'react-dom';
import {Route, IndexRoute, hashHistory, Router} from 'react-router';
import App from './public/javascripts/container/app';
import './public/stylesheets/main.less';
ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/">
            <IndexRoute component={App}/>
        </Route>
    </Router>
    ,
    document.getElementById('root')
);

