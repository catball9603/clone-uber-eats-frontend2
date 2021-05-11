import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { LogOutHeader } from '../components/LogOutHeader';
import Restaurants from '../pages/Client/Restaurants';
import CreateAccount from '../pages/create-account';
import Login from '../pages/login';

const LoggedOutRouter = () => {
  return (
    <Router>
      <LogOutHeader />
      <Switch>
        <Route path="/" exact component={Restaurants} />
        <Route path="/log-in" component={Login} />
        <Route path="/create-account" component={CreateAccount} />
        <Route component={Login} />
      </Switch>
    </Router>
  );
};

export default LoggedOutRouter;
