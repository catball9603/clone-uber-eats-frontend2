/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Helmet } from 'react-helmet';
import { useHistory, useLocation } from 'react-router-dom';
import Restaurant from '../../components/Restaurant';
import { RESTAURANT_FRAGMENT } from '../../fragments';
import { searchRestaurant, searchRestaurantVariables } from '../../__generated__/searchRestaurant';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const SEARCH_RESTAURANTS = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

const Search = () => {
  const [page, setPage] = useState(1);
  const location = useLocation();
  const history = useHistory();
  const [callQuery, { loading, data, called }] = useLazyQuery<searchRestaurant, searchRestaurantVariables>(
    SEARCH_RESTAURANTS,
  );
  useEffect(() => {
    const [_, query] = location.search.split('?term=');
    //searchTerm이 없을때 replace됨
    if (!query) {
      return history.replace('/');
    }
    //searchTerm:query가 있는 경우에만 실행
    callQuery({
      variables: {
        input: {
          page: 1,
          query,
        },
      },
    });
  }, [history, location]);
  console.log(loading, data, called);
  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);
  return (
    <div>
      <Helmet>
        <title>Search | Uber-eats</title>
      </Helmet>
      <div className="bg-gray-800 w-full py-5 flex justify-center items-center text-white">SEARCH</div>
      {!loading && (
        <div className="max-w-screen-2xl mx-auto mt-8 pb-20">
          <div className="px-3"> Results</div>
          <div className="grid grid-cols-1 md:grid-cols-3 px-3 mb:px-0 gap-x-5 mb:gap-y-7 mt-8">
            {data?.searchRestaurant.restaurants?.map((restaurant) => (
              <Restaurant
                key={restaurant.id}
                coverImg={restaurant.coverImg}
                id={restaurant.id}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-7">
            {page > 1 ? (
              <button onClick={onPrevPageClick} className="focus:outline-none text-2xl font-bold">
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
            ) : (
              <div></div>
            )}
            <span>
              Page {page} / {data?.searchRestaurant.totalPages}
            </span>
            {page !== data?.searchRestaurant.totalPages ? (
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

export default Search;
