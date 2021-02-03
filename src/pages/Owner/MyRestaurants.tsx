import { gql, useQuery } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import { myRestaurants } from '../../__generated__/myRestaurants';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const MY_RESTAURANTS_QUERY = gql`
  query myRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

const MyRestaurants = () => {
  const { data } = useQuery<myRestaurants>(MY_RESTAURANTS_QUERY);

  return (
    <div>
      <Helmet>
        <title>My Restaurants | Uber Eats </title>
      </Helmet>
      <div className="px-8">
        <div className="container mt-32">
          <h1 className="text-4xl font-bold">My Restaurants</h1>
          {data?.myRestaurants.ok && data.myRestaurants.restaurants.length === 0 && (
            <div className="mt-10">
              <h4 className="text-xl mb-5">You have no restaurants.</h4>
              <Link to="/add-restaurant">
                <div className="text-lg flex items-center link">
                  <p>Create one</p>
                  <FontAwesomeIcon className="ml-5" icon={faArrowRight} />
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRestaurants;
