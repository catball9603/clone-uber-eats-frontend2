import React from 'react';
import Restaruants from '../pages/Client/Restaurants';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Header from '../components/Header';
import NotFound404 from '../components/NotFound404';
import { UseMe } from '../hooks/useMe';
import { ConfirmEmail } from '../pages/User/ConfirmEmail';
import EditProfile from '../pages/User/EditProfile';
import Search from '../pages/Client/Search';
import Category from '../pages/Client/Category';
import Restaurant from '../pages/Client/RstaurantDetail';

const ClientRoutes = [
  <Route key={1} path="/" exact component={Restaruants} />,
  <Route key={2} path="/confirm" component={ConfirmEmail} />,
  <Route key={3} path="/edit-profile" component={EditProfile} />,
  <Route key={4} path="/search" component={Search} />,
  <Route key={5} path="/category/:slug" component={Category} />,
  <Route key={6} path="/restaurant/:id" component={Restaurant} />,
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

        <Route component={NotFound404} />
      </Switch>
    </Router>
  );
};

export default LoggedInRouter;
