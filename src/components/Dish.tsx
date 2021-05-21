import React from 'react';
import { restaurant_restaurant_restaurant_menu_options } from '../__generated__/restaurant';

interface IDishProps {
  id?: number;
  name: string;
  description: string;
  price: number;
  isCustomer?: boolean;
  photo?: string | null;
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
  photo,
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
      className={`w-full px-6 py-5 border-2 flex hover:border-gray-800 transition-all ${
        isSelected ? 'border-gray-800 cursor-default' : ' cursor-pointer hover:border-gray-800 '
      }`}
    >
      <div className="flex-row w-2/5 ">
        <div className="w-full mb-3">
          <div className="text-lg font-medium">
            <div className="w-1/2 mb-5">
              {orderStarted && (
                <button
                  onClick={onClick}
                  style={{ borderRadius: 2 }}
                  className={`w-full p-2 focus:outline-none text-base text-white ${
                    isSelected ? 'bg-red-500' : 'bg-lime-500'
                  }`}
                >
                  {isSelected ? 'Remove' : 'Add'}
                </button>
              )}
            </div>
          </div>
          <p className="text-3xl font-bold mb-3">{name}</p>
          <p className="text-xl font-bold mb-1">price: {price}</p>
          <p className="text-base">{description}</p>
        </div>
        {isCustomer && options && options?.length !== 0 && (
          <div>
            {/* <h5 className="px-5 mb-3 font-medium">Dish Options:</h5> */}
            <div className="grid gap-2 justify-start">{dishOptions}</div>
          </div>
        )}
      </div>
      <div
        style={{
          backgroundImage: `url(${photo})`,
          borderRadius: 10,
        }}
        className="w-3/5 h-44 bg-cover object-cover bg-center "
      ></div>
    </div>
  );
};

export default Dish;
