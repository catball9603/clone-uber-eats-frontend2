import React from 'react';
import Restaruants from '../pages/client/Restaruants';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import Header from '../components/Header';
import { UseMe } from '../hooks/useMe';

const ClientRoutes = [<Route key={1} path="/" exact component={Restaruants} />];

const LoggedInRouter = () => {
  const { data, loading, error } = UseMe();

  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-semibold text-xl tracking-wide">Loading...</span>
      </div>
    );
  }

  return (
    <Router>
      <Header />
      <Switch>
        {data.me.role === 'Client' && ClientRoutes}
        <Redirect from="*" to="/" />
      </Switch>
    </Router>
  );
};

export default LoggedInRouter;
