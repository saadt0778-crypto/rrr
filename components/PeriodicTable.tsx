
import React, { useState } from 'react';
import { ElementData } from '../types';
import ElementCell from './ElementCell';
import ElementDetailModal from './ElementDetailModal';

interface PeriodicTableProps {
  elements: ElementData[];
}

const PeriodicTable: React.FC<PeriodicTableProps> = ({ elements }) => {
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);

  const handleElementClick = (element: ElementData) => {
    setSelectedElement(element);
  };

  const handleCloseModal = () => {
    setSelectedElement(null);
  };
  
  const groupColors: { [key: string]: string } = {
      'alkali-metal': 'bg-red-500',
      'alkaline-earth-metal': 'bg-orange-500',
      'transition-metal': 'bg-yellow-500',
      'post-transition-metal': 'bg-green-500',
      'metalloid': 'bg-teal-500',
      'diatomic-nonmetal': 'bg-blue-500',
      'polyatomic-nonmetal': 'bg-blue-600',
      'halogen': 'bg-indigo-500',
      'noble-gas': 'bg-purple-500',
      'lanthanide': 'bg-pink-500',
      'actinide': 'bg-rose-500',
      'nonmetal': 'bg-blue-500',
  };


  return (
    <>
      <div className="grid grid-cols-[repeat(18,minmax(0,1fr))] gap-1 p-1 md:p-4 max-w-7xl mx-auto" style={{ direction: 'ltr' }}>
        {elements.map((element) => (
          <ElementCell
            key={element.atomicNumber}
            element={element}
            colorClass={groupColors[element.groupBlock] || 'bg-gray-700'}
            onClick={handleElementClick}
          />
        ))}
      </div>
      <ElementDetailModal
        element={selectedElement}
        isOpen={selectedElement !== null}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default PeriodicTable;
