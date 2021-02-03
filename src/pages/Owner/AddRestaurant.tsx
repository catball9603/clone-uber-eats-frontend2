/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/button';
import { FormError } from '../../components/FormError';
import { createRestaurant, createRestaurantVariables } from '../../__generated__/createRestaurant';

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

const AddRestaurant = () => {
  const [uploading, setUploading] = useState(false);
  const onCompleted = (data: createRestaurant) => {
    const {
      createRestaurant: { ok, error },
    } = data;
    if (ok) {
      setUploading(false);
    }
  };
  const [createRestaurantMutation, { data }] = useMutation<createRestaurant, createRestaurantVariables>(
    CREATE_RESTAURANT_MUTATION,
    { onCompleted },
  );
  const { register, getValues, handleSubmit, errors, formState } = useForm<IFormProps>({
    mode: 'onChange',
  });

  const onSubmit = async () => {
    try {
      setUploading(true);
      const { file, name, address, categoryName } = getValues();
      const actualFile = file[0]; //file은 여러개
      const formBody = new FormData();
      formBody.append('file', actualFile);
      const { url: coverImg } = await (
        await fetch('http://localhost:4000/uploads/', {
          method: 'POST',
          body: formBody,
        })
      ).json();
      createRestaurantMutation({
        variables: {
          input: {
            name,
            address,
            categoryName,
            coverImg,
          },
        },
      });
      setUploading(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="container px-8 mt-10 lg:mt-28">
      <Helmet>
        <title>Create Restaurant | Uber Eats</title>
      </Helmet>
      <div className="max-w-screen-sm mx-auto flex flex-col items-center ">
        <h1 className="text-3xl font-bold">Add Restaurant</h1>
        <form className="grid gap-3 my-5 w-full" onSubmit={handleSubmit(onSubmit)}>
          <input
            className="input"
            type="text"
            name="name"
            placeholder="Name"
            ref={register({ required: 'Name is required.' })}
          />

          <input
            className="input"
            type="text"
            name="address"
            placeholder="Address"
            ref={register({ required: 'Address is required.' })}
          />
          <input
            className="input"
            type="text"
            name="categoryName"
            placeholder="Category Name"
            ref={register({ required: 'Category is required.' })}
          />
          <div>
            <input type="file" accept="image/*" name="file" ref={register({ required: true })} />
          </div>
          <Button canClick={formState.isValid} actionText={'Create Restaurant'} loading={uploading} />
          {data?.createRestaurant?.error && <FormError errorMessage={data.createRestaurant.error} />}
        </form>
      </div>
    </div>
  );
};

export default AddRestaurant;