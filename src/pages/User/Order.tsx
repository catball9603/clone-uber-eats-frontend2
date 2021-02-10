/* eslint-disable react-hooks/exhaustive-deps */
import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { FULL_ORDER_FRAGMENT } from '../../fragments';
import { UseMe } from '../../hooks/useMe';
import { editOrder, editOrderVariables } from '../../__generated__/editOrder';
import { getOrder, getOrderVariables } from '../../__generated__/getOrder';
import { OrderStatus, UserRole } from '../../__generated__/globalTypes';
import { orderUpdates } from '../../__generated__/orderUpdates';

const GET_ORDER_QUERY = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        ...FullOrderParts
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const ORDER_SUBSCRIPTION = gql`
  subscription orderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const EDIT_ORDER_MUTATION = gql`
  mutation editOrder($input: EditOrderInput!) {
    editOrder(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  id: string;
}

const Order = () => {
  const params = useParams<IParams>();
  const { data: userData } = UseMe();
  const [editOrderMutation] = useMutation<editOrder, editOrderVariables>(EDIT_ORDER_MUTATION, {});
  const { data, subscribeToMore } = useQuery<getOrder, getOrderVariables>(GET_ORDER_QUERY, {
    variables: {
      input: {
        id: +params.id,
      },
    },
  });

  useEffect(() => {
    if (data?.getOrder.ok) {
      subscribeToMore({
        document: ORDER_SUBSCRIPTION,
        variables: {
          input: {
            id: +params.id,
          },
        },
        updateQuery: (prev, { subscriptionData: { data } }: { subscriptionData: { data: orderUpdates } }) => {
          if (!data) return prev;
          return {
            getOrder: {
              ...prev.getOrder,
              order: {
                ...data.orderUpdates,
              },
            },
          };
        },
      });
    }
  }, [data]);

  const onButtonClick = (newStatus: OrderStatus) => {
    editOrderMutation({
      variables: {
        input: {
          id: +params.id,
          status: newStatus,
        },
      },
    });
  };
  return (
    <div className="mt-32 container flex justify-center">
      <Helmet>
        <title>Order #{params.id} | Uber Eats</title>
      </Helmet>
      <div className="border border-gray-800 w-full max-w-screen-sm flex flex-col justify-center">
        <h4 className="bg-gray-800 w-full py-5 text-white text-center text-xl">Order #{params.id}</h4>
        <h5 className="p-5 pt-10 text-3xl text-center">${data?.getOrder.order?.total}</h5>
        <div className="p-5 text-xl grid gap-6">
          <div className="border-t pt-5 border-gray-700">
            Prepared By: {''}
            <span className="font-medium">{data?.getOrder.order?.restaurant?.name}</span>
          </div>
          <div className="border-t pt-5 border-gray-700">
            Dlivery To:{''}
            <span className="font-medium">{data?.getOrder.order?.customer?.email}</span>
          </div>
          <div className="border-t border-b py-5 border-gray-700">
            Driver To:{''}
            <span className="font-medium">{data?.getOrder.order?.driver?.email || 'Not yet.'}</span>
          </div>
          {userData?.me.role === 'Client' && (
            <span className="text-center mt-5 text-2xl text-lime-600">Status: {data?.getOrder.order?.status}</span>
          )}
          {userData?.me.role === UserRole.Owner && (
            <>
              {data?.getOrder.order?.status === OrderStatus.Pending && (
                <button onClick={() => onButtonClick(OrderStatus.Cooking)} className="btn">
                  Accept Order
                </button>
              )}
              {data?.getOrder.order?.status === OrderStatus.Cooking && (
                <button onClick={() => onButtonClick(OrderStatus.Cooked)} className="btn">
                  Order Cooked
                </button>
              )}
              {data?.getOrder.order?.status !== OrderStatus.Cooking &&
                data?.getOrder.order?.status !== OrderStatus.Pending && (
                  <span className="text-center mt-5 text-2xl text-lime-600">
                    Status: {data?.getOrder.order?.status}
                  </span>
                )}
            </>
          )}
          {userData?.me.role === UserRole.Delivery && (
            <>
              {data?.getOrder.order?.status === OrderStatus.Cooked && (
                <button onClick={() => onButtonClick(OrderStatus.PickedUp)} className="btn">
                  PickedUp
                </button>
              )}
              {data?.getOrder.order?.status === OrderStatus.PickedUp && (
                <button onClick={() => onButtonClick(OrderStatus.Delivered)} className="btn mb-3">
                  Delivered
                </button>
              )}
              {/* {data?.getOrder.order?.status !== OrderStatus.Cooked &&
                data?.getOrder.order?.status !== OrderStatus.PickedUp && (
                  <span className="text-center mt-5 text-2xl text-lime-600">
                    Status: {data?.getOrder.order?.status}
                  </span>
                )} */}
            </>
          )}
          {data?.getOrder.order?.status === OrderStatus.Delivered && (
            <span className=" text-center mt-1 mb-5 text-xl text-lime-600">Thank you for using Nuber Eats.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Order;
