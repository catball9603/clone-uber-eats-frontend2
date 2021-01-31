import { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import Restaurant from '../../components/Restaurant';
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { category, categoryVariables } from '../../__generated__/category';

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface ICategoryParams {
  slug: string;
}

const Category = () => {
  const [page, setPage] = useState(1);
  const params = useParams<ICategoryParams>();
  const { data, loading } = useQuery<category, categoryVariables>(CATEGORY_QUERY, {
    variables: {
      input: {
        page: 1,
        slug: params.slug,
      },
    },
  });

  console.log(data);
  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);
  return (
    <div>
      <Helmet>
        <title>Category | Uber-eats</title>
      </Helmet>
      <div className="bg-gray-800 w-full py-5 flex justify-center items-center text-white">CATEGORY</div>
      {!loading && (
        <div className="max-w-screen-2xl mx-auto mt-8 pb-20">
          <div className="px-3">{data?.category.category?.slug} Results</div>
          <div className="grid grid-cols-1 md:grid-cols-3 px-3 mb:px-0 gap-x-5 mb:gap-y-7 mt-8">
            {data?.category.restaurants?.map((restaurant) => (
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
              Page {page} / {data?.category.totalPages}
            </span>
            {page !== data?.category.totalPages ? (
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

export default Category;
