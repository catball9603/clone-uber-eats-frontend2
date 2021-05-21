import { gql, useMutation, useQuery } from '@apollo/client';
import { faCompass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import Dish from '../../components/Dish';
import DishOption from '../../components/DishOption';
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from '../../fragments';
import { createOrder, createOrderVariables } from '../../__generated__/createOrder';

import { CreateOrderItemInput } from '../../__generated__/globalTypes';
import { restaurant, restaurantVariables } from '../../__generated__/restaurant';

const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
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

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
      orderId
    }
  }
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

  const [orderStarted, setOrderStrated] = useState(false);
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);

  const triggerStartOrder = () => {
    setOrderStrated(true);
  };

  const getItem = (dishId: number) => {
    return orderItems.find((order) => order.dishId === dishId);
  };

  const isSelected = (dishId: number) => {
    return Boolean(getItem(dishId));
  };

  const addItemToOrder = (dishId: number) => {
    //dish 중복선택 체크해줌
    if (isSelected(dishId)) {
      return;
    }
    setOrderItems((current) => [{ dishId, options: [] }, ...current]);
  };

  const removeFromOrder = (dishId: number) => {
    setOrderItems((current) => current.filter((dish) => dish.dishId !== dishId));
  };

  const addOptionToItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }

    const oldItem = getItem(dishId);

    if (oldItem) {
      const hasOption = Boolean(oldItem.options?.find((aOption) => aOption.name === optionName));

      if (!hasOption) {
        removeFromOrder(dishId);
        setOrderItems((current) => [{ dishId, options: [{ name: optionName }, ...oldItem.options!] }, ...current]);
      }
    }
  };

  const getOptionFromItem = (item: CreateOrderItemInput, optionName: string) => {
    return item.options?.find((option) => option.name === optionName);
  };
  const isOptionSelected = (dishId: number, optionName: string) => {
    const item = getItem(dishId);
    if (item) {
      return Boolean(getOptionFromItem(item, optionName));
    }
    return false;
  };

  const removeOptionFromItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      removeFromOrder(dishId);
      setOrderItems((current) => [
        { dishId, options: oldItem.options?.filter((option) => option.name !== optionName) },
        ...current,
      ]);
      return;
    }
  };

  const triggerCancelOrder = () => {
    setOrderStrated(false);
    setOrderItems([]);
  };
  const history = useHistory();
  const onCompleted = (data: createOrder) => {
    const {
      createOrder: { orderId },
    } = data;
    if (data.createOrder.ok) {
      history.push(`/orders/${orderId}`);
    }
  };
  const [createOrderMutation, { loading: placingOrder }] = useMutation<createOrder, createOrderVariables>(
    CREATE_ORDER_MUTATION,
    {
      onCompleted,
    },
  );
  const triggerConfirmOrder = () => {
    if (placingOrder) {
      return;
    }
    if (orderItems.length === 0) {
      alert("Can't place empty order");
      return;
    }
    const ok = window.confirm('You are about to place an oreder');
    if (ok) {
      createOrderMutation({
        variables: {
          input: {
            restaurantId: +params.id,
            items: orderItems,
          },
        },
      });
    }
  };

  return (
    <div>
      {!loading && (
        // header
        <div>
          <div
            className="w-full h-96 bg-cover object-cover bg-center flex items-end"
            style={{ backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})` }}
          >
            <div className="w-full h-4/6 bg-gradient-to-t from-black text-lg text-white flex items-end">
              <div className="container pb-5 px-6">
                <p className="text-4xl md:text-5xl  font-semibold mb-1">{data?.restaurant.restaurant?.name}</p>
                <Link to={`/category/${data?.restaurant.restaurant?.category?.slug}`}>
                  <p className="text-base md:text-lg">{data?.restaurant.restaurant?.category?.name}</p>
                </Link>
                <div className="flex mt-5">
                  <FontAwesomeIcon icon={faCompass} />
                  <p className="ml-2 text-sm font-light">{data?.restaurant.restaurant?.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* orderStarted 부분  */}
          <div className="container px-8 mb-32 2xl:px-0 mt-20 flex flex-col items-end">
            {!orderStarted && (
              <button onClick={triggerStartOrder} className="btn px-8">
                Start Order
              </button>
            )}
            {orderStarted && (
              <div className="flex items-center">
                <button onClick={triggerConfirmOrder} className="btn px-8 mr-3 text-lg">
                  Confirm Order
                </button>
                <button onClick={triggerCancelOrder} className="btn px-8 bg-black hover:bg-gray-800 text-lg">
                  Cancel Order
                </button>
              </div>
            )}

            <div className="w-full grid mt-16 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
              {data?.restaurant.restaurant?.menu.map((dish) => (
                <Dish
                  isSelected={isSelected(dish.id)}
                  id={dish.id}
                  orderStarted={orderStarted}
                  key={dish.id}
                  name={dish.name}
                  price={dish.price}
                  photo={dish.photo}
                  description={dish.description}
                  isCustomer={true}
                  options={dish.options}
                  addItemToOrder={addItemToOrder}
                  removeFromOrder={removeFromOrder}
                >
                  {dish.options?.map((option, index) => (
                    <DishOption
                      key={index}
                      isSelected={isOptionSelected(dish.id, option.name)}
                      name={option.name}
                      extra={option.extra}
                      dishId={dish.id}
                      addOptionToItem={addOptionToItem}
                      removeOptionFromItem={removeOptionFromItem}
                    />
                  ))}
                </Dish>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
