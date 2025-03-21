import React from "react";

export interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
  date: string;
  onClick: () => void;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  imageUrl,
  date,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="bg-gradient-to-tr from-indigo-50 to-violet-50 rounded-md shadow max-h-64 overflow-y-auto cursor-pointer transition-transform hover:scale-101 max-w-xs"
    >
      {imageUrl && (
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      )}

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-500 text-sm">{date}</p>
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-gray-600 text-sm mt-2">{description}</p>
      </div>
    </div>
  );
};
