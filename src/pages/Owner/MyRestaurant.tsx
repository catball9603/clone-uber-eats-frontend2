import { gql, useQuery } from '@apollo/client';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { myRestaurant, myRestaurantVariables } from '../../__generated__/myRestaurant';

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

interface IParams {
  id: string;
}

const MyRestaurant = () => {
  const { id } = useParams<IParams>();
  const { data } = useQuery<myRestaurant, myRestaurantVariables>(MY_RESTAURANT_QUERY, {
    variables: {
      input: {
        id: +id,
      },
    },
  });

  return (
    <div>
      <Helmet>
        <title>My Restaurant | Uber Eats</title>
      </Helmet>
      <div
        className="bg-gray-800 py-32 bg-center bg-cover mb-10"
        style={{ backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})` }}
      ></div>
      <div className="container px-8 2xl:px-0">
        <h2 className="text-3xl font-bold mb-10">{data?.myRestaurant.restaurant?.name || 'Loading ...'}</h2>
        <Link to={`/restaurants/${id}/add-dish`} className="mr-8 text-white bg-gray-800 py-3 px-10">
          Add Dish <FontAwesomeIcon className="ml-4" icon={faArrowRight} />
        </Link>
        <Link to={``} className="text-white bg-lime-700 py-3 px-10">
          Buy Promotion <FontAwesomeIcon className="ml-4" icon={faArrowRight} />
        </Link>
        <div className="mt-10">
          {data?.myRestaurant.restaurant?.menu.length === 0 ? (
            <h4 className="text-xl mb-5">Please upload a dish!</h4>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MyRestaurant;
