import React from 'react';
import { useForm } from 'react-hook-form';
import FormError from '../components/form-error';
import { ApolloError, gql, useMutation } from '@apollo/client';
import uberLogo from '../images/eats-logo-1a01872c77.svg';
import { Button } from '../components/button';
import { Link } from 'react-router-dom';

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      ok
      token
      error
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

  const [LoginMutation, { data: loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data: any) => {
      const { error, ok, token } = data;
      if (ok) {
        console.log(token);
      } else {
        console.log(error);
      }
    },
    onError: (error: ApolloError) => {
      console.log(error);
    },
  });
  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      LoginMutation({
        variables: {
          email,
          password,
        },
      });
    }
  };

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28 ">
      <div className="w-full max-w-screen-sm flex flex-col items-center px-5 ">
        <img src={uberLogo} alt="Logo" className="w-48 lg:w-60 mb-10" />
        <h1 className="w-full font-semibold text-left text-3xl lg:text-4xl mb-5">Welcom back</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 my-5 w-full">
          <input
            ref={register({ required: 'Email is required' })}
            name="email"
            type="email"
            required
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && <FormError errorMessage={errors.email.message} />}
          <input
            ref={register({ required: 'Password is required' })}
            name="password"
            type="password"
            required
            placeholder="Password"
            className="input"
          />
          {errors.password?.message && <FormError errorMessage={errors.password.message} />}
          {errors.password?.type === 'minLength' && <FormError errorMessage={'Password must be more than 10 chars.'} />}
          <Button canClick={formState.isValid} actionText={'Next'} loading={loading} />
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
