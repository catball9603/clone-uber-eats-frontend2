import React from 'react';

interface IProps {
  errorMessage: string;
}

const FormError: React.FC<IProps> = ({ errorMessage }) => {
  return <span className="text-sm text-red-500">{errorMessage}</span>;
};

export default FormError;
