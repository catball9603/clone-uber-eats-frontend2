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
import MyRestaurants from '../pages/Owner/MyRestaurants';
import AddRestaurant from '../pages/Owner/AddRestaurant';

const clientRoutes = [
  {
    path: '/',
    component: <Restaruants />,
  },
  {
    path: '/confirm',
    component: <ConfirmEmail />,
  },
  {
    path: '/edit-profile',
    component: <EditProfile />,
  },
  {
    path: '/search',
    component: <Search />,
  },
  {
    path: '/category/:slug',
    component: <Category />,
  },
  {
    path: '/restaurant/:id',
    component: <Restaurant />,
  },
];

const commonRoutes = [
  {
    path: '/confirm',
    component: <ConfirmEmail />,
  },
  {
    path: '/edit-profile',
    component: <EditProfile />,
  },
];

const restaurantRoutes = [
  {
    path: '/',
    component: <MyRestaurants />,
  },
  { path: '/add-restaurant', component: <AddRestaurant /> },
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
        {data.me.role === 'Client' &&
          clientRoutes.map((route) => (
            <Route exact key={route.path} path={route.path}>
              {route.component}
            </Route>
          ))}
        {data.me.role === 'Owner' &&
          restaurantRoutes.map((route) => (
            <Route exact key={route.path} path={route.path}>
              {route.component}
            </Route>
          ))}
        {commonRoutes.map((route) => (
          <Route exact key={route.path} path={route.path}>
            {route.component}
          </Route>
        ))}
        <Route component={NotFound404} />
      </Switch>
    </Router>
  );
};

export default LoggedInRouter;
