import React from 'react';
import { isLoggedInVar } from '../apollo';

type IProps = {};

const LoggedInRouter: React.FC<IProps> = () => {
  const onClick = () => {
    isLoggedInVar(false);
  };
  return (
    <div>
      <h1>logged-in-router</h1>
      <button className="bg-red-200" onClick={onClick}>
        Click in Logout
      </button>
    </div>
  );
};

export default LoggedInRouter;
