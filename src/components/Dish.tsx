import React from 'react';
import { restaurant_restaurant_restaurant_menu_options } from '../__generated__/restaurant';

interface IDishProps {
  id?: number;
  name: string;
  description: string;
  price: number;
  isCustomer?: boolean;
  options?: restaurant_restaurant_restaurant_menu_options[] | null;
  orderStarted?: boolean;
  addItemToOrder?: (dishId: number) => void;
  removeFromOrder?: (dishId: number) => void;
  isSelected?: boolean;
}

const Dish: React.FC<IDishProps> = ({
  id = 0,
  name,
  description,
  price,
  isCustomer = false,
  options,
  orderStarted = false,
  addItemToOrder,
  removeFromOrder,
  isSelected,
  children: dishOptions,
}) => {
  const onClick = () => {
    if (orderStarted) {
      if (!isSelected && addItemToOrder) {
        addItemToOrder(id);
      }
      if (isSelected && removeFromOrder) {
        return removeFromOrder(id);
      }
    }
  };

  return (
    <div
      className={`px-8 py-4 border-2 hover:border-gray-800 transition-all ${
        isSelected ? 'border-gray-800 cursor-default' : ' cursor-pointer hover:border-gray-800'
      }`}
    >
      <div className="mb-5">
        <div className="grid grid-cols-2 text-lg font-medium">
          <p>{name}</p>
          {orderStarted && (
            <button
              onClick={onClick}
              className={`ml-10 px-5 py-2 focus:outline-none text-base text-white ${
                isSelected ? 'bg-red-500' : 'bg-lime-500'
              }`}
            >
              {isSelected ? 'Remove' : 'Add'}
            </button>
          )}
        </div>
        <p className="font-medium">{description}</p>
      </div>
      <span>${price}</span>
      {isCustomer && options && options?.length !== 0 && (
        <div>
          <h5 className="mt-8 mb-3 font-medium">Dish Options:</h5>
          <div className="grid gap-2 justify-start">{dishOptions}</div>
        </div>
      )}
    </div>
  );
};

export default Dish;
