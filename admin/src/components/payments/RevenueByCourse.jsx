import React from 'react';

const RevenueByCourse = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Revenue by Course</h2>
      <div className="overflow-x-auto">
        {data.length === 0 ? (
          <p className="text-gray-600 text-center">No revenue data available.</p>
        ) : (
          <table className="w-full border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-600">
                <th className="p-4 font-medium">Course</th>
                <th className="p-4 font-medium">Revenue</th>
                <th className="p-4 font-medium">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-800">{item.course}</td>
                  <td className="p-4 text-gray-800">₹{item.revenue.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-gray-800">{item.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RevenueByCourse;
