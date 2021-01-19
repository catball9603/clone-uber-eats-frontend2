import React from 'react';

interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
}

export const Button: React.FC<IButtonProps> = ({ canClick, loading, actionText }) => (
  <button className={`btn ${canClick ? 'bg-lime-500 hover:bg-lime-600' : 'bg-gray-300 pointer-events-none'}`}>
    {loading ? 'Loading...' : actionText}
  </button>
);
