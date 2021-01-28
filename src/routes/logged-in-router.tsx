import React from 'react';
import Restaruants from '../pages/Client/Restaurants';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import Header from '../components/Header';
import { UseMe } from '../hooks/useMe';
import { ConfirmEmail } from '../pages/User/ConfirmEmail';
import EditProfile from '../pages/User/EditProfile';

const ClientRoutes = [
  <Route key={1} path="/" exact component={Restaruants} />,
  <Route key={2} path="/confirm" exact component={ConfirmEmail} />,
  <Route key={3} path="/edit-profile" exact component={EditProfile} />,
];

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
        {/* <Redirect from="*" to="/" /> */}

        <Redirect to="/" />
      </Switch>
    </Router>
  );
};

export default LoggedInRouter;
