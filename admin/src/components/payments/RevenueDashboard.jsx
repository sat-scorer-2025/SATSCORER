import React from 'react';
import { useOutletContext } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import KpiCard from './KpiCard';
import RevenueByCourse from './RevenueByCourse';

const RevenueDashboard = () => {
  const { startDate, setStartDate, endDate, setEndDate, kpis, revenueData } = useOutletContext();

  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <label className="text-gray-700 text-sm font-medium mr-2">From:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="p-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 w-32"
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <div className="flex items-center">
            <label className="text-gray-700 text-sm font-medium mr-2">To:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="p-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 w-32"
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <KpiCard
          title="Total Revenue"
          value={`₹${kpis.totalRevenue.toLocaleString('en-IN')}`}
          icon="currency-rupee"
        />
        <KpiCard title="Total Sales" value={kpis.totalSales} icon="shopping-cart" />
        <KpiCard
          title="Average Order Value"
          value={`₹${kpis.avgOrderValue.toLocaleString('en-IN')}`}
          icon="calculator"
        />
        <KpiCard title="New Students" value={kpis.newCustomers} icon="users" />
        <KpiCard title="Revenue Growth" value={`${kpis.revenueGrowth}%`} icon="trending-up" />
      </div>
      <RevenueByCourse data={revenueData} />
    </div>
  );
};

export default RevenueDashboard;