import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NotFound404 from '../components/NotFound404';
import CreateAccount from '../pages/create-account';
import Login from '../pages/login';

const LoggedOutRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/create-account" component={CreateAccount} />
        <Route component={NotFound404} />
      </Switch>
    </Router>
  );
};

export default LoggedOutRouter;
