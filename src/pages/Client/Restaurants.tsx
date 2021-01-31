import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { restaurantsPageQuery, restaurantsPageQueryVariables } from '../../__generated__/restaurantsPageQuery';
import Restaurant from '../../components/Restaurant';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface IFormProps {
  searchTerm: string;
}

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
  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  const history = useHistory();
  const onSearchSubmit = () => {
    //search하는 page로 이동
    const { searchTerm } = getValues();
    console.log(getValues());
    // /search와 state를 url과 함께 보내는 방법
    history.push({
      pathname: '/search',
      search: `?term=${searchTerm}`,
    });
  };
  return (
    <div>
      <Helmet>
        <title>Home | Uber-eats</title>
      </Helmet>
      <form
        onSubmit={handleSubmit(onSearchSubmit)}
        className="bg-gray-800 w-full py-40 flex justify-center items-center"
      >
        <input
          ref={register({ required: true, min: 3 })}
          name="searchTerm"
          className="input w-3/4 md:w-1/2 xl:w-1/3"
          type="Search"
          placeholder="Search restaurants..."
        />
      </form>
      {!loading && (
        <div className="max-w-screen-2xl mx-auto mt-8 pb-20">
          <div className="flex justify-around max-w-sm mx-auto cursor-pointer ">
            {data?.allCategories.categories?.map((category) => (
              <Link key={category.id} to={`/category/${category.slug}`}>
                <div className="flex flex-col items-center group">
                  <div
                    style={{ backgroundImage: `url(${category.coverImg})` }}
                    className="w-16 h-16 rounded-full bg-cover bg-center border-transparent group-hover:border-green-500 border-2"
                  ></div>
                  <span className="text-sm font-semibold mt-2">{category.name}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 px-3 mb:px-0 gap-x-5 mb:gap-y-7 mt-12">
            {data?.restaurants.results?.map((restaurant) => (
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
