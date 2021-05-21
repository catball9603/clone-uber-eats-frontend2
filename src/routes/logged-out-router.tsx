import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Footer from '../components/Footer';
import { LogOutHeader } from '../components/LogOutHeader';
import Restaurants from '../pages/Client/Restaurants';
import CreateAccount from '../pages/create-account';
import Login from '../pages/login';

const LoggedOutRouter = () => {
  return (
    <div className="relative min-h-screen">
      <Router>
        <LogOutHeader />
        <div className="pb-48">
          <Switch>
            <Route path="/" exact component={Restaurants} />
            <Route path="/log-in" component={Login} />
            <Route path="/create-account" component={CreateAccount} />
            <Route component={Login} />
          </Switch>
        </div>
        <div className="absolute bottom-0 w-full">
          <Footer />
        </div>
      </Router>
    </div>
  );
};

export default LoggedOutRouter;
