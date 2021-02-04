import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { Button } from '../../components/button';
import { createDish, createDishVariables } from '../../__generated__/createDish';
import { MY_RESTAURANT_QUERY } from './MyRestaurant';

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  restaurantId: string;
}

interface IFormProps {
  name: string;
  price: string;
  description: string;
}

const AddDish = () => {
  const history = useHistory();
  const { restaurantId } = useParams<IParams>();
  const onCompleted = () => {};
  const [createDishMutation, { loading, data }] = useMutation<createDish, createDishVariables>(CREATE_DISH_MUTATION, {
    onCompleted,
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          input: {
            id: +restaurantId,
          },
        },
      },
    ],
  });
  const { register, getValues, handleSubmit, formState } = useForm<IFormProps>({
    mode: 'onChange',
  });

  const onSubmit = () => {
    const { name, price, description } = getValues();
    createDishMutation({
      variables: {
        input: {
          name,
          description,
          price: +price,
          restaurantId: +restaurantId,
        },
      },
    });
    history.goBack();
  };

  return (
    <div className="container flex flex-col items-center mt-52 px-8 2xl:px-0">
      <Helmet>
        <title>Add Dish | Uber Eats</title>
      </Helmet>
      <h4 className="text-2xl font-semibold mb-3">Add Dish</h4>
      <form className=" w-full max-w-screen-sm grid gap-3 my-5" onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          className="input"
          ref={register({ required: 'Name is required.' })}
          name="name"
          placeholder="Name"
        />
        <input
          type="number"
          className="input"
          ref={register({ required: 'Price is required.' })}
          name="price"
          min={0}
          placeholder="Price"
        />
        <input
          type="text"
          className="input"
          ref={register({ required: 'Description is required.' })}
          name="description"
          placeholder="Description"
        />
        <Button loading={loading} canClick={formState.isValid} actionText="Create Dish" />
      </form>
    </div>
  );
};

export default AddDish;
