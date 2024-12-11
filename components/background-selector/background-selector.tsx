"use client"; // Menandai ini sebagai komponen klien

import React from 'react';

interface BackgroundSelectorProps {
  backgrounds: string[];
  onSelect: (background: string) => void;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ backgrounds, onSelect }) => {
  return (
    <div className="flex flex-wrap mt-4">
      {backgrounds.map((bg, index) => (
        <div key={index} onClick={() => onSelect(bg)} className="cursor-pointer m-2">
          <img src={bg} alt={`Background ${index}`} className="w-24 h-24 object-cover border-2 border-gray-300 rounded" />
        </div>
      ))}
    </div>
  );
};

export default BackgroundSelector;