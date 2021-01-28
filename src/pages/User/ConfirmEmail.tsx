/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { gql, useApolloClient, useMutation } from '@apollo/client';
import { verifyEmail, verifyEmailVariables } from '../../__generated__/verifyEmail';
import { UseMe } from '../../hooks/useMe';
import { useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

export const ConfirmEmail = () => {
  const { data: userData } = UseMe();
  const client = useApolloClient();
  const history = useHistory();
  const onCompleted = (data: verifyEmail) => {
    const {
      verifyEmail: { ok },
    } = data;
    if (ok && userData?.me.id) {
      client.writeFragment({
        id: `User:${userData.me.id} `,
        fragment: gql`
          fragment VerifiedUser on User {
            verified
          }
        `,
        data: {
          verified: true,
        },
      });
      history.push('/');
    }
  };
  const [verifyEmail] = useMutation<verifyEmail, verifyEmailVariables>(VERIFY_EMAIL_MUTATION, {
    onCompleted,
  });

  useEffect(() => {
    const [_, code] = window.location.href.split('code=');
    verifyEmail({
      variables: {
        input: {
          code,
        },
      },
    });
  }, []);
  return (
    <div className="h-screen flex flex-col items-center mt-52">
      <Helmet>
        <title>Verify Email | Uber Eats</title>
      </Helmet>
      <h2 className=" text-lg mb-2 font-semibold">Confirming email...</h2>
      <h4 className="text-gray-600 text-sm">Please wait, don't close this page...</h4>
    </div>
  );
};
