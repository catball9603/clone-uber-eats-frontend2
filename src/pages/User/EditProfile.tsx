/* eslint-disable no-useless-escape */
import { gql, useApolloClient, useMutation } from '@apollo/client';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/button';
import { UseMe } from '../../hooks/useMe';
import { editProfile, editProfileVariables } from '../../__generated__/editProfile';

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  email?: string;
  password?: string;
}

const EditProfile = () => {
  const { data: userData } = UseMe();
  const client = useApolloClient();
  const onCompleted = (data: editProfile) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok && userData) {
      //update cache
      const {
        me: { email: prevEmail, id },
      } = userData;
      const { email: newEmail } = getValues();
      if (prevEmail !== newEmail) {
        client.writeFragment({
          id: `User:${id} `,
          fragment: gql`
            fragment EditedUser on User {
              verified
              email
            }
          `,
          data: {
            email: newEmail,
            verified: false,
          },
        });
      }
    }
  };
  const [editProfile, { loading }] = useMutation<editProfile, editProfileVariables>(EDIT_PROFILE_MUTATION, {
    onCompleted,
  });
  const { register, getValues, handleSubmit, formState } = useForm<IFormProps>({
    mode: 'onChange',
    defaultValues: {
      email: userData?.me.email,
    },
  });
  const onSubmit = () => {
    const { email, password } = getValues();
    editProfile({
      variables: {
        input: {
          email,
          ...(password !== '' && { password }),
        },
      },
    });
  };

  return (
    <div className="mt-52 flex flex-col justify-center items-center">
      <Helmet>
        <title>Edit Profile | Uber Eats</title>
      </Helmet>
      <h4 className="text-2xl mb-2 font-semibold">Edit Profile</h4>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 my-5 w-full max-w-screen-sm">
        <input
          ref={register({
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          name="email"
          className="input"
          type="email"
          placeholder="Email"
        />
        <input ref={register} name="password" className="input" type="password" placeholder="Password" />
        <Button loading={loading} actionText="save profile" canClick={formState.isValid} />
      </form>
    </div>
  );
};

export default EditProfile;
