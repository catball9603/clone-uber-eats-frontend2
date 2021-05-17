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
import RstaurantDetail from '../pages/Client/RstaurantDetail';
import MyRestaurants from '../pages/Owner/MyRestaurants';
import AddRestaurant from '../pages/Owner/AddRestaurant';
import MyRestaurant from '../pages/Owner/MyRestaurant';
import AddDish from '../pages/Owner/AddDish';
import Order from '../pages/User/Order';
import DashBoard from '../pages/Driver/DriverBoard';
import { UserRole } from '../__generated__/globalTypes';
import Footer from '../components/Footer';

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
    path: '/restaurants/:id',
    component: <RstaurantDetail />,
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
  {
    path: '/orders/:id',
    component: <Order />,
  },
];

const restaurantRoutes = [
  {
    path: '/',
    component: <MyRestaurants />,
  },
  { path: '/add-restaurant', component: <AddRestaurant /> },
  { path: '/restaurants/:id', component: <MyRestaurant /> },
  { path: '/restaurants/:restaurantId/add-dish', component: <AddDish /> },
];

const driverRoutes = [{ path: '/', component: <DashBoard /> }];

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
      <div className="relative min-h-screen">
        <Header />
        <div className="pb-48">
          <Switch>
            {data.me.role === UserRole.Client &&
              clientRoutes.map((route) => (
                <Route exact key={route.path} path={route.path}>
                  {route.component}
                </Route>
              ))}
            {data.me.role === UserRole.Owner &&
              restaurantRoutes.map((route) => (
                <Route exact key={route.path} path={route.path}>
                  {route.component}
                </Route>
              ))}
            {data.me.role === UserRole.Delivery &&
              driverRoutes.map((route) => (
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
        </div>
        <div className="absolute bottom-0 w-full">
          <Footer />
        </div>
      </div>
    </Router>
  );
};

export default LoggedInRouter;
