import React from 'react';

interface IDishOptionProps {
  isSelected: boolean;
  name: string;
  extra?: number | null;
  dishId: number;
  addOptionToItem: (dishId: number, optionName: string) => void;
  removeOptionFromItem: (dishId: number, optionName: string) => void;
}

const DishOption: React.FC<IDishOptionProps> = ({
  isSelected,
  name,
  extra,
  dishId,
  addOptionToItem,
  removeOptionFromItem,
}) => {
  const onClick = () => {
    if (isSelected) {
      removeOptionFromItem(dishId, name);
    } else {
      addOptionToItem(dishId, name);
    }
  };
  return (
    <span onClick={onClick} className={`border px-2 py-1 ${isSelected ? 'border-gray-800' : 'hover:border-gray-800'}`}>
      <span className="mr-2">{name}</span>
      {<span className="text-sm text-gray-600">({extra})</span>}
    </span>
  );
};

export default DishOption;
