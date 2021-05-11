import React from 'react';
import uberLogo from '../images/eats-logo-1a01872c77.svg';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useLocation } from 'react-router-dom';

export const LogOutHeader: React.FC = () => {
  const location = useLocation();
  console.log(location);
  return (
    <>
      {location.pathname !== '/' ? (
        <></>
      ) : (
        <div className="w-full h-20 ">
          <div className="h-full max-w-screen-2xl mx-auto flex justify-between items-center px-6 ">
            <Link to="/">
              <img src={uberLogo} alt="Logo" className="w-44" />
            </Link>

            <div className="text-lg mt-2 transition-all duration-200 ease hover:text-lime-600 hover:underline">
              <Link to="/log-in">
                <span>Log In</span>
                <FontAwesomeIcon icon={faSignInAlt} className="text-2xl ml-2" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
