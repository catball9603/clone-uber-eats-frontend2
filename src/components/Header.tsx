import React from 'react';
import uberLogo from '../images/eats-logo-1a01872c77.svg';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { UseMe } from '../hooks/useMe';

const Header: React.FC = () => {
  const { data } = UseMe();
  console.log(data);
  return (
    <div className="py-6 px-8">
      <div className="w-full max-w-screen-2xl mx-auto flex justify-between items-center ">
        <img src={uberLogo} alt="Logo" className="w-44" />
        <span className="text-lg">
          <Link to="/my-profile">
            <FontAwesomeIcon icon={faUser} className="text-2xl" />
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Header;
