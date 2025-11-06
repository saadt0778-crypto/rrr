
import React from 'react';
import { ElementData } from '../types';

interface ElementCellProps {
  element: ElementData;
  colorClass: string;
  onClick: (element: ElementData) => void;
}

const ElementCell: React.FC<ElementCellProps> = ({ element, colorClass, onClick }) => {
  const gridPosition = {
    gridColumnStart: element.col,
    gridRowStart: element.row,
  };

  return (
    <button
      style={gridPosition}
      onClick={() => onClick(element)}
      className={`relative p-1 md:p-2 text-white rounded-md transition-all duration-300 transform hover:scale-110 hover:z-10 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${colorClass}`}
    >
      <div className="text-xs md:text-sm font-bold text-left">{element.atomicNumber}</div>
      <div className="text-sm md:text-2xl font-bold">{element.symbol}</div>
      <div className="text-[8px] md:text-xs truncate">{element.nameAr}</div>
    </button>
  );
};

export default ElementCell;
