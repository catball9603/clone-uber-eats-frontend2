import React from 'react';
import LoggedOutRouter from './routes/logged-out-router';
import { useReactiveVar } from '@apollo/client';
import LoggedInRouter from './routes/logged-in-router';
import { isLoggedInVar } from './apollo';

interface IProps {}

const App: React.FC<IProps> = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />;
};

export default App;
