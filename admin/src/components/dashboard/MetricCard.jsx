import React from 'react';
import { assets } from '../../assets/assets';

const MetricCard = ({ title, value, icon, change }) => {
  return (
    <div className="bg-white/80 backdrop-blur-md p-4 rounded-lg shadow-sm border border-gray-300">
      <div className="flex items-center">
        <img src={icon} alt={`${title} icon`} className="w-8 h-8 mr-3" />
        <div>
          <h3 className="text-lg font-medium text-gray-600">{title}</h3>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {change && (
            <span className={`text-sm ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
              {change}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
