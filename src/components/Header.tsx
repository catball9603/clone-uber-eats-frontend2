import React from 'react';
import uberLogo from '../images/eats-logo-1a01872c77.svg';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { UseMe } from '../hooks/useMe';

const Header: React.FC = () => {
  const { data } = UseMe();

  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-500 p-5 text-white text-center">
          <span>Please verify your email.</span>
        </div>
      )}
      <div className="py-6 px-8">
        <div className="w-full max-w-screen-2xl mx-auto flex justify-between items-center ">
          <Link to="/">
            <img src={uberLogo} alt="Logo" className="w-44" />
          </Link>

          <span className="text-lg">
            <Link to="/edit-profile">
              <FontAwesomeIcon icon={faUser} className="text-2xl" />
            </Link>
          </span>
        </div>
      </div>
    </>
  );
};

export default Header;
