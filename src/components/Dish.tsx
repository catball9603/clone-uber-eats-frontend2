import React from 'react';

interface IDishProps {
  name: string;
  description: string;
  price: number;
}

const Dish: React.FC<IDishProps> = ({ name, description, price }) => {
  return (
    <div className="px-8 py-4 border-2 hover:border-gray-800 transition-all">
      <div className="mb-5">
        <p className="text-lg font-medium">{name}</p>
        <p className="font-medium">{description}</p>
      </div>
      <span>${price}</span>
    </div>
  );
};

export default Dish;
