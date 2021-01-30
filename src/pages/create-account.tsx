import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import Helmet from 'react-helmet';
import { Link, useHistory } from 'react-router-dom';
import uberLogo from '../images/eats-logo-1a01872c77.svg';
import { FormError } from '../components/FormError';
import { Button } from '../components/button';
import { UserRole } from '../__generated__/globalTypes';
import { CreateAccountMutation, CreateAccountMutationVariables } from '../__generated__/CreateAccountMutation';

const CREATE_ACCOUNT_MUTATION = gql`
  mutation CreateAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

const CreateAccount = () => {
  const { register, errors, handleSubmit, formState, getValues } = useForm<ICreateAccountForm>({
    mode: 'onChange',
    defaultValues: {
      role: UserRole.Client,
    },
  });

  const history = useHistory();
  const onCompleted = (data: CreateAccountMutation) => {
    const {
      createAccount: { ok },
    } = data;
    if (ok) {
      //redirect
      alert('Account Created! Log in now');
      history.push('/');
    }
  };

  const [CreateAccountMutation, { loading, data: createAccountMutationResult }] = useMutation<
    CreateAccountMutation,
    CreateAccountMutationVariables
  >(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
  });

  const onSubmit = () => {
    const { email, password, role } = getValues();
    if (!loading) {
      CreateAccountMutation({
        variables: {
          createAccountInput: {
            email,
            password,
            role,
          },
        },
      });
    }
    history.push('/');
  };

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28 ">
      <Helmet>
        <title>Create Account | Uber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col items-center px-5 ">
        <img src={uberLogo} alt="Logo" className="w-48 lg:w-60 mb-12" />
        <h1 className="w-full font-semibold text-left text-2xl lg:text-3xl mb-5">Let's get started</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 my-5 w-full">
          <input
            ref={register({
              required: 'Email is required',
              // eslint-disable-next-line no-useless-escape
              pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            name="email"
            type="email"
            required
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && <FormError errorMessage={errors.email?.message} />}
          {errors.email?.type === 'pattern' && <FormError errorMessage={'Please enter a valid email'} />}
          <input
            ref={register({ required: 'Password is required' })}
            name="password"
            type="password"
            required
            placeholder="Password"
            className="input"
          />
          {errors.password?.message && <FormError errorMessage={errors.password?.message} />}
          <select ref={register({ required: true })} name="role" className="input">
            {Object.keys(UserRole).map((role, index) => (
              <option key={index}>{role}</option>
            ))}
          </select>
          <Button canClick={formState.isValid} actionText={'Create Account'} loading={loading} />
          {createAccountMutationResult?.createAccount.error && (
            <FormError errorMessage={createAccountMutationResult.createAccount.error} />
          )}
        </form>
        <div>
          Already have an account?{' '}
          <Link className="text-lime-500 hover:underline" to="/">
            Log in now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
