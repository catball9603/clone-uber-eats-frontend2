import { gql, useQuery } from '@apollo/client';
import { faCompass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import { restaurant, restaurantVariables } from '../../__generated__/restaurant';

const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

interface IRestaurantParams {
  id: string;
}

const RestaurantDetail = () => {
  const params = useParams<IRestaurantParams>();
  const { data, loading } = useQuery<restaurant, restaurantVariables>(RESTAURANT_QUERY, {
    variables: {
      input: {
        restaurantId: +params.id,
      },
    },
  });
  console.log(data);
  return (
    <div>
      {!loading && (
        <div>
          <div
            className=" bg-gray-800 py-44 bg-cover bg-center "
            style={{ backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})` }}
          >
            <div className=" bg-white w-3/12 p-8 pl-44 ">
              <p className="text-4xl font-semibold mb-2">{data?.restaurant.restaurant?.name}</p>
              <Link to={`/category/${data?.restaurant.restaurant?.category?.slug}`}>
                <p className="text-sm font-light">{data?.restaurant.restaurant?.category?.name}</p>
              </Link>
              <div className="flex flex-row items-center mt-1">
                <FontAwesomeIcon icon={faCompass} />
                <p className="ml-2 text-sm font-light">{data?.restaurant.restaurant?.address}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
