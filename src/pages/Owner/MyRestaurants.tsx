import { gql, useQuery } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Restaurant from '../../components/Restaurant';
import { myRestaurants } from '../../__generated__/myRestaurants';

export const MY_RESTAURANTS_QUERY = gql`
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
  const { data, loading } = useQuery<myRestaurants>(MY_RESTAURANTS_QUERY);

  return (
    <div>
      <Helmet>
        <title>My Restaurants | Uber Eats </title>
      </Helmet>
      {!loading && (
        <div className="container py-28 px-8 2xl:px-0">
          <h1 className="text-4xl font-bold mb-3">My Restaurants</h1>
          {data?.myRestaurants.ok && data.myRestaurants.restaurants.length === 0 ? (
            <>
              <div className="mt-10">
                <h4 className="text-xl mb-5">You have no restaurants.</h4>
                <Link className="inline-block" to="/add-restaurant">
                  <div className="text-lg flex items-center link">
                    <p>Create one</p>
                    <FontAwesomeIcon className="ml-5" icon={faArrowRight} />
                  </div>
                </Link>
              </div>
            </>
          ) : (
            <div className="mb-20">
              <Link className="inline-block" to="/add-restaurant">
                <div className="text-lg flex items-center link">
                  <p>Create more</p>
                  <FontAwesomeIcon className="ml-5" icon={faArrowRight} />
                </div>
              </Link>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 mb:gap-y-7 mt-12">
                {data?.myRestaurants.restaurants.map((restaurant) => (
                  <Restaurant
                    key={restaurant.id}
                    coverImg={restaurant.coverImg}
                    id={restaurant.id}
                    name={restaurant.name}
                    categoryName={restaurant.category?.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      <div></div>
    </div>
  );
};

export default MyRestaurants;
