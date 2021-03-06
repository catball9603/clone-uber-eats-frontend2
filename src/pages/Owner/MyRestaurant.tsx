/* eslint-disable react-hooks/exhaustive-deps */
import { gql, useQuery, useSubscription } from '@apollo/client';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useHistory, useParams } from 'react-router-dom';
import Dish from '../../components/Dish';
import { DISH_FRAGMENT, FULL_ORDER_FRAGMENT, ORDERS_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';

import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory';
import { myRestaurant, myRestaurantVariables } from '../../__generated__/myRestaurant';
import { pendingOrders } from '../../__generated__/pendingOrders';

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
        orders {
          ...OrderParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDERS_FRAGMENT}
`;

const PENDING_ORDERS_SUBSCRIPTION = gql`
  subscription pendingOrders {
    pendingOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
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

  const { data: subscriptionData } = useSubscription<pendingOrders>(PENDING_ORDERS_SUBSCRIPTION);
  const history = useHistory();

  useEffect(() => {
    if (subscriptionData?.pendingOrders.id) {
      history.push(`/orders/${subscriptionData.pendingOrders.id}`);
    }
  }, [subscriptionData]);

  return (
    <div>
      <Helmet>
        <title>My Restaurant | Uber Eats</title>
      </Helmet>
      <div
        className="bg-gray-800 py-44 bg-center bg-cover"
        style={{ backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})` }}
      ></div>
      <div className="container px-8 2xl:px-0 pt-20">
        <h2 className="text-4xl 2xl:text-5xl font-bold mb-10">
          {data?.myRestaurant.restaurant?.name || 'Loading ...'}
        </h2>
        <div className="flex flex-col md:flex-row">
          <Link to={`/restaurants/${id}/add-dish`} className="md:mr-8 text-white bg-gray-800 py-3 px-10 mb-3 md:mb-0 ">
            Add Dish <FontAwesomeIcon className="ml-4" icon={faArrowRight} />
          </Link>
          <Link to={``} className="text-white bg-lime-700 py-3 px-10">
            Buy Promotion <FontAwesomeIcon className="ml-4" icon={faArrowRight} />
          </Link>
        </div>
        <div className="mt-10">
          {data?.myRestaurant.restaurant?.menu.length === 0 ? (
            <h4 className="text-xl mb-5">Please upload a dish!</h4>
          ) : (
            <div className="grid mt-16 md:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-10">
              {data?.myRestaurant.restaurant?.menu.map((dish) => (
                <Dish
                  key={dish.id}
                  name={dish.name}
                  price={dish.price}
                  description={dish.description}
                  photo={dish.photo}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mt-20 mb-10">
          <h4 className="text-2xl font-bold text-center">Sales</h4>
          <div className="py-20">
            <VictoryChart
              theme={VictoryTheme.material}
              domainPadding={50}
              width={window.innerWidth}
              height={500}
              containerComponent={<VictoryVoronoiContainer />}
            >
              <VictoryLine
                labels={({ datum }) => `$${datum.y}`}
                labelComponent={<VictoryTooltip renderInPortal dy={-20} />}
                interpolation="natural"
                style={{
                  labels: {
                    fontSize: 20,
                  },
                  data: {
                    stroke: '#228be6',
                    strokeWidth: 5,
                  },
                }}
                data={data?.myRestaurant.restaurant?.orders.map((order) => ({ x: order.createdAt, y: order.total }))}
              />
              <VictoryAxis
                tickLabelComponent={<VictoryLabel renderInPortal />}
                style={{ tickLabels: { fontSize: 20, fill: '#343a40' } }}
                tickFormat={(tick) => new Date(tick).toLocaleDateString('ko')}
              />
            </VictoryChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRestaurant;
