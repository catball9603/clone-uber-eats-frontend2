import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { restaurantsPageQuery, restaurantsPageQueryVariables } from '../../__generated__/restaurantsPageQuery';

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
  const { data, loading } = useQuery<restaurantsPageQuery, restaurantsPageQueryVariables>(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page: 1,
      },
    },
  });

  return (
    <div>
      <form className="bg-gray-800 w-full py-40 flex justify-center items-center">
        <input className="input w-3/12" type="Search" placeholder="Search restaurants..." />
      </form>
      {!loading && (
        <div className="max-w-screen-2xl mx-auto mt-8">
          <div className="flex justify-around max-w-md mx-auto cursor-pointer ">
            {data?.allCategories.categories?.map((category) => (
              <div className="flex flex-col items-center group">
                <div
                  key={category.id}
                  style={{ backgroundImage: `url(${category.coverImg})` }}
                  className="w-16 h-16 rounded-full bg-cover bg-center border-transparent  group-hover:border-green-500 border-2"
                ></div>
                <span className="text-sm font-semibold mt-2">{category.name}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-x-5 gap-y-7 mt-10">
            {data?.restaurants.results?.map((restaurant) => (
              <div>
                <div
                  key={restaurant.id}
                  style={{ backgroundImage: `url(${restaurant.coverImg})` }}
                  className="bg-green-300 py-52 bg-cover bg-center mb-5"
                ></div>
                <h3 className="text-xl  pb-2">{restaurant.name}</h3>
                <h3 className="pt-2 border-t-2 text-gray-400">{restaurant.category?.name}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Restaurants;
