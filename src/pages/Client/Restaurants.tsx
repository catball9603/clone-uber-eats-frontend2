import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { restaurantsPageQuery, restaurantsPageQueryVariables } from '../../__generated__/restaurantsPageQuery';
import Restaurant from '../../components/Restaurant';
import { faArrowRight, faArrowLeft, faDivide } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImg
        slug
        restaurantCount
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        id
        name
        coverImg
        category {
          name
        }
        address
        isPromoted
      }
    }
  }
`;

const Restaurants = () => {
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery<restaurantsPageQuery, restaurantsPageQueryVariables>(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page,
      },
    },
  });

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);
  return (
    <div>
      <form className="bg-gray-800 w-full py-40 flex justify-center items-center">
        <input className="input w-3/12" type="Search" placeholder="Search restaurants..." />
      </form>
      {!loading && (
        <div className="max-w-screen-2xl mx-auto mt-8 pb-20">
          <div className="flex justify-around max-w-sm mx-auto cursor-pointer ">
            {data?.allCategories.categories?.map((category) => (
              <div className="flex flex-col items-center group">
                <div
                  key={category.id}
                  style={{ backgroundImage: `url(${category.coverImg})` }}
                  className="w-16 h-16 rounded-full bg-cover bg-center border-transparent group-hover:border-green-500 border-2"
                ></div>
                <span className="text-sm font-semibold mt-2">{category.name}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-x-5 gap-y-7 mt-12">
            {data?.restaurants.results?.map((restaurant) => (
              <Restaurant
                coverImg={restaurant.coverImg}
                id={restaurant.id}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
            {page > 1 ? (
              <button onClick={onPrevPageClick} className="focus:outline-none text-2xl font-bold">
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
            ) : (
              <div></div>
            )}
            <span>
              Page {page} / {data?.restaurants.totalPages}
            </span>
            {page !== data?.restaurants.totalPages ? (
              <button onClick={onNextPageClick} className="focus:outline-none text-2xl font-bold">
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Restaurants;
