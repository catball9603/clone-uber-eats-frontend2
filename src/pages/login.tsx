/* eslint-disable no-useless-escape */
import React from 'react';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import uberLogo from '../images/eats-logo-1a01872c77.svg';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';
import { FormError } from '../components/FormError';
import { Button } from '../components/button';

import { authTokenVar, isLoggedInVar } from '../apollo';
import { LOCALSTORAGE_TOKEN } from '../constans';
import { loginMutation, loginMutationVariables } from '../__generated__/loginMutation';

const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      error
      token
    }
  }
`;

interface ILoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const { register, getValues, errors, handleSubmit, formState } = useForm<ILoginForm>({
    mode: 'onChange',
  });

  const onCompleted = (data: loginMutation) => {
    const {
      login: { ok, token },
    } = data;
    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authTokenVar(token);
      isLoggedInVar(true);
    }
  };

  const [LoginMutation, { data: loginMutationResult, loading }] = useMutation<loginMutation, loginMutationVariables>(
    LOGIN_MUTATION,
    { onCompleted },
  );

  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      LoginMutation({
        variables: {
          loginInput: {
            email,
            password,
          },
        },
      });
    }
  };

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28 ">
      <Helmet>
        <title>Login | Uber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col items-center px-5 ">
        <img src={uberLogo} alt="Logo" className=" w-48 mb-12 lg:w-60" />
        <h1 className="w-full font-semibold text-left text-2xl lg:text-3xl mb-5">Welcom back</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 my-5 w-full">
          <input
            ref={register({
              required: 'Email is required',
              pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            name="email"
            type="email"
            required
            placeholder="email"
            className="input"
          />
          {errors.email?.message && <FormError errorMessage={errors.email?.message} />}
          {errors.email?.type === 'pattern' && <FormError errorMessage={'Please enter a valid email'} />}
          <input
            role="alert"
            ref={register({ required: 'Password is required' })}
            name="password"
            type="password"
            required
            placeholder="password"
            className="input"
          />
          {errors.password?.message && <FormError errorMessage={errors.password?.message} />}
          {errors.password?.type === 'minLength' && <FormError errorMessage={'Password must be more than 10 chars.'} />}
          <Button canClick={formState.isValid} actionText={'Next'} loading={loading} />
          {loginMutationResult?.login.error && <FormError errorMessage={loginMutationResult.login.error} />}
        </form>
        <div>
          New to Uber?{' '}
          <Link className="text-lime-500 hover:underline" to="/create-account">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
