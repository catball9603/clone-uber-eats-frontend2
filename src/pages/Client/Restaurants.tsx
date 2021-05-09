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
import { sliderData } from '../../slide-data';
import Slider from 'react-slick';
import uberLogo from '../../images/eats-logo-1a01872c77 copy.svg';

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

  const settings = {
    dots: false,
    infinite: true,
    speed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    autoplay: true,
  };

  return (
    <div>
      <Helmet>
        <title>Home | Uber-eats</title>
      </Helmet>
      <div className="relative w-full h-96 sbg-lime-600">
        <Slider className="w-full h-full overflow-hidden absolute object-cover bg-center" {...settings}>
          {sliderData.map((slide, index) => (
            <img key={index} src={slide.img} alt={slide.alt} />
          ))}
          {console.log(sliderData.length)}
        </Slider>
        <form
          onSubmit={handleSubmit(onSearchSubmit)}
          className="absolute top-1/2 transform -translate-y-1/2 z-10 w-full flex justify-center items-start"
        >
          <input
            ref={register({ required: true, min: 3 })}
            name="searchTerm"
            className="input w-3/4 md:w-1/2 xl:w-1/3"
            type="Search"
            placeholder="Search restaurants..."
          />
        </form>
      </div>
      {!loading && (
        <>
          <div className="max-w-screen-2xl mx-auto mt-8 pb-10">
            <div className="flex justify-around max-w-sm mx-auto cursor-pointer ">
              {data?.allCategories.categories?.map((category) => (
                <Link key={category.id} to={`/category/${category.slug}`}>
                  <div className="flex flex-col items-center group">
                    <div
                      style={{ backgroundImage: `url(${category.coverImg})` }}
                      className="w-16 h-16 rounded-full bg-cover bg-center border-transparent transition duration-150 ease-linear group-hover:border-lime-500 border-2"
                    ></div>
                    <span className="text-sm font-semibold mt-2">{category.name}</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 px-6 mb:px-0 gap-x-5 mb:gap-y-7 mt-12">
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
          <footer className="w-full h-48 bg-gray-900">
            <div className="max-w-screen-2xl mx-auto h-1/2 lg:h-2/3 pt-6 px-6 flex flex-col lg:flex-row  lg:justify-between">
              <div className="w-full lg:w-1/2">
                <Link to="/">
                  <img src={uberLogo} alt="Logo" className="w-36" />
                </Link>
              </div>
              <div className="w-full lg:w-1/2 flex lg:justify-end lg:items-end text-white text-base py-5 lg:py-0">
                <div>
                  <Link to="/" className="mr-7 hover:underline">
                    Privacy Policy
                  </Link>
                  <Link to="/" className="mr-7  hover:underline">
                    Terms
                  </Link>
                  <Link to="/" className="hover:underline">
                    Pricing
                  </Link>
                </div>
              </div>
            </div>
            <div className="max-w-screen-2xl mx-auto h-1/2 lg:h-1/3 text-white px-6 pt-6 lg:pt-3 text-sm flex flex-col justify-center lg:flex-row lg:justify-end">
              <p className="lg:mr-7">
                This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
              </p>
              <p className="flex flex-col  lg:flex-row lg:items-start">© 2021 Uber Technologies Inc.</p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default Restaurants;
