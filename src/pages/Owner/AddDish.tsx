import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
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
  [key: string]: string;
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
  const { register, getValues, handleSubmit, formState, setValue } = useForm<IFormProps>({
    mode: 'onChange',
  });

  const onSubmit = () => {
    const { name, price, description, ...rest } = getValues();
    const optionsObeject = optionsNumber.map((theId) => ({
      name: rest[`${theId}-optionName`],
      extra: +rest[`${theId}-optionExtra`],
    }));

    createDishMutation({
      variables: {
        input: {
          name,
          description,
          price: +price,
          restaurantId: +restaurantId,
          options: optionsObeject,
        },
      },
    });
    history.goBack();
  };

  const [optionsNumber, setOptionsNumber] = useState<number[]>([]);

  const onAddOptionClick = () => {
    setOptionsNumber((current) => [Date.now(), ...current]);
  };
  const onDeleteClick = (idToDelete: number) => {
    setOptionsNumber((current) => current.filter((id) => id !== idToDelete));
    setValue(`${idToDelete}-optionName`, '');
    setValue(`${idToDelete}-optionExtra`, '');
  };
  return (
    <div className="container flex flex-col items-center mt-32 px-8 2xl:px-0">
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
        <div className="my-10">
          <h4 className="text-lg font-medium mb-3">Dish Options</h4>
          <span className="bg-gray-900 p-2 mt-5 cursor-pointer text-white" onClick={onAddOptionClick}>
            Add Dish Option
          </span>
          {optionsNumber.length !== 0 &&
            optionsNumber.map((id) => (
              <div key={id} className="mt-3">
                <input
                  ref={register}
                  name={`${id}-optionName`}
                  type="text"
                  className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2 mr-2"
                  placeholder="Option Name"
                />
                <input
                  ref={register}
                  name={`${id}-optionExtra`}
                  type="number"
                  min={0}
                  className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2"
                  placeholder="Option Extra"
                />
                <span
                  className="cursor-pointer text-white bg-red-500 ml-3 py-3 px-4 text-base"
                  onClick={() => onDeleteClick(id)}
                >
                  Delete
                </span>
              </div>
            ))}
        </div>

        <Button loading={loading} canClick={formState.isValid} actionText="Create Dish" />
      </form>
    </div>
  );
};

export default AddDish;
