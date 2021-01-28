import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const NotFound404 = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <Helmet>
        <title>Not Found | Uber Eats</title>
      </Helmet>
      <p className="font-semibold text-2xl mb-3">Page Not Found.</p>
      <p className="mb-5 text-base">The page you're looking for does not exist or has moved.</p>
      <Link className="text-lime-600 font-semibold hover:underline" to="/">
        Go back home &rarr;
      </Link>
    </div>
  );
};

export default NotFound404;
