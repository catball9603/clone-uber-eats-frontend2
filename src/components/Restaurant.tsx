import React from 'react';

interface IRestaurantProps {
  id: number;
  coverImg: string;
  name: string;
  categoryName?: string;
}

const Restaurant: React.FC<IRestaurantProps> = ({ id, coverImg, name, categoryName }) => {
  return (
    <div>
      <div
        key={id}
        style={{ backgroundImage: `url(${coverImg})` }}
        className="bg-green-300 py-52 bg-cover bg-center mb-3"
      ></div>
      <h3 className="text-lg font-semibold pb-1">{name}</h3>
      <h3 className="pt-1 text-sm border-t-2 text-gray-400">{categoryName}</h3>
    </div>
  );
};

export default Restaurant;
