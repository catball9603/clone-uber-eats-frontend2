import React from 'react';
import { Link } from 'react-router-dom';

interface IRestaurantProps {
  id: number;
  coverImg: string;
  name: string;
  categoryName?: string;
}

const Restaurant: React.FC<IRestaurantProps> = ({ id, coverImg, name, categoryName }) => {
  return (
    <Link to={`/restaurants/${id}`}>
      <div>
        <div key={id} style={{ backgroundImage: `url(${coverImg})` }} className=" py-32  bg-cover bg-center mb-3"></div>
        <h3 className="text-lg font-semibold pb-1 ">{name}</h3>
        <h3 className="pt-1 text-sm border-t-2 text-gray-400 mb-8">{categoryName}</h3>
      </div>
    </Link>
  );
};

export default Restaurant;
