import React from 'react';
import { Link } from 'react-router-dom';
import uberLogo from '../images/eats-logo-1a01872c77 copy.svg';

const Footer: React.FC = () => {
  return (
    <footer className="w-full h-48 bg-gray-900 bottom-0">
      <div className="max-w-screen-2xl mx-auto h-1/2 lg:h-2/3 pt-6 px-6 flex flex-col lg:flex-row  lg:justify-between">
        <div className="w-full lg:w-1/2">
          <Link to="/">
            <img src={uberLogo} alt="Logo" className="w-36" />
          </Link>
        </div>
        <div className="w-full lg:w-1/2 flex lg:justify-end lg:items-end text-white text-base py-5 lg:py-0">
          <div>
            <Link to="/" className="mr-7 hover:underline">
              Privacy Policy
            </Link>
            <Link to="/" className="mr-7  hover:underline">
              Terms
            </Link>
            <Link to="/" className="hover:underline">
              Pricing
            </Link>
          </div>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto h-1/2 lg:h-1/3 text-white px-6 py-2 lg:pt-3 text-sm flex flex-col justify-center lg:flex-row lg:justify-end">
        <p className="lg:mr-7">
          This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
        </p>
        <p className="flex flex-col  lg:flex-row lg:items-start">© 2021 Uber Technologies Inc.</p>
      </div>
    </footer>
  );
};

export default Footer;
