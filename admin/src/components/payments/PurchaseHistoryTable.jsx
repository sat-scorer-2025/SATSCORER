import React, { useState } from 'react';
import { format } from 'date-fns';

const PurchaseHistoryTable = ({ transactions, isLoading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Purchase History</h2>
      <div className="overflow-x-auto">
        {isLoading ? (
          <p className="text-gray-600 text-center">Loading transactions...</p>
        ) : currentTransactions.length === 0 ? (
          <p className="text-gray-600 text-center">No transactions found.</p>
        ) : (
          <table className="w-full border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-600">
                <th className="p-4 font-medium">Cashfree Order ID</th>
                <th className="p-4 font-medium">Student</th>
                <th className="p-4 font-medium">Course</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Payment Method</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Address</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((txn) => (
                <tr
                  key={txn.cashfreeOrderId || txn._id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-gray-800">{txn.cashfreeOrderId || 'N/A'}</td>
                  <td className="p-4 text-gray-800">{txn.userId?.email || 'N/A'}</td>
                  <td className="p-4 text-gray-800">{txn.courseId?.title || 'N/A'}</td>
                  <td className="p-4 text-gray-800">
                    {txn.paymentDate ? format(new Date(txn.paymentDate), 'dd-MM-yyyy') : 'N/A'}
                  </td>
                  <td className="p-4 text-gray-800">₹{txn.amount?.toLocaleString('en-IN') || '0'}</td>
                  <td className="p-4 text-gray-800">{txn.paymentMethod || 'N/A'}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        txn.status === 'completed'
                          ? 'bg-teal-100 text-teal-700'
                          : txn.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 text-gray-800">{txn.userId?.address || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 disabled:bg-gray-400 transition-colors"
          disabled={currentPage === 1 || isLoading}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span className="text-gray-600">Page {currentPage} of {totalPages}</span>
        <button
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 disabled:bg-gray-400 transition-colors"
          disabled={currentPage === totalPages || isLoading}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PurchaseHistoryTable;
