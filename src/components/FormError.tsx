import React from 'react';

interface IProps {
  errorMessage: string;
}

export const FormError: React.FC<IProps> = ({ errorMessage }) => {
  return (
    <span role="alert" className="text-sm text-red-500">
      {errorMessage}
    </span>
  );
};
