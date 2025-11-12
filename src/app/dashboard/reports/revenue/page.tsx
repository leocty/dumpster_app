'use client';

import { useEffect, useState } from 'react';
import { reportsApi } from '@/app/lib/reportsApi';
import type { RevenueReport } from '@/app/types/reports';
import {
  CurrencyDollarIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  CalendarIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

export default function RevenueReportPage() {
  const [report, setReport] = useState<RevenueReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    // Set default dates (current month)
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
    
    loadReport();
  }, []);

  const loadReport = async (start?: string, end?: string) => {
    try {
      setLoading(true);
      const data = await reportsApi.getRevenueReport(start, end);
      setReport(data);
      setError(null);
    } catch (err) {
      setError('Error loading revenue report');
      console.error('Error loading revenue report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterApply = () => {
    loadReport(startDate, endDate);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ExclamationCircleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <p className="text-red-600">{error || 'Could not load revenue report'}</p>
          <button
            onClick={() => loadReport()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { summary, revenueByCustomer, revenueByMonth, additionalCharges } = report;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Revenue Report</h1>
        
        {/* Date Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-gray-500" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleFilterApply}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <ChartBarIcon className="w-4 h-4" />
            Apply
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Revenue Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Revenue"
            value={`$${summary.totalRevenue.toLocaleString()}`}
            icon={<CurrencyDollarIcon className="w-6 h-6" />}
            color="bg-green-500"
          />
          <SummaryCard
            title="Paid Amount"
            value={`$${summary.paidAmount.toLocaleString()}`}
            icon={<CurrencyDollarIcon className="w-6 h-6" />}
            color="bg-blue-500"
          />
          <SummaryCard
            title="Pending Amount"
            value={`$${summary.pendingAmount.toLocaleString()}`}
            icon={<ExclamationCircleIcon className="w-6 h-6" />}
            color="bg-yellow-500"
          />
          <SummaryCard
            title="Total Contracts"
            value={summary.totalContracts.toString()}
            icon={<DocumentTextIcon className="w-6 h-6" />}
            color="bg-purple-500"
          />
        </div>
      </div>

      {/* Additional Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          title="Paid Contracts"
          value={summary.paidContracts.toString()}
          icon={<DocumentTextIcon className="w-6 h-6" />}
          color="bg-green-500"
        />
        <SummaryCard
          title="Pending Contracts"
          value={summary.pendingContracts.toString()}
          icon={<DocumentTextIcon className="w-6 h-6" />}
          color="bg-yellow-500"
        />
        <SummaryCard
          title="Avg Contract Value"
          value={`$${summary.averageContractValue.toLocaleString()}`}
          icon={<CurrencyDollarIcon className="w-6 h-6" />}
          color="bg-indigo-500"
        />
      </div>

      {/* Revenue by Customer */}
      {revenueByCustomer.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Revenue by Customer</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contracts
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {revenueByCustomer.map((customer, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {customer.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        ${customer.totalRevenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.contractCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Revenue by Month */}
      {revenueByMonth.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Revenue by Month</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contracts
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {revenueByMonth.map((month, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {month.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        ${month.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {month.contractCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Additional Charges */}
      {additionalCharges.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Charges</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Charge Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Count
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {additionalCharges.map((charge, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {charge.chargeType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        ${charge.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {charge.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Summary Card Component
interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

function SummaryCard({ title, value, icon, color }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-lg text-white`}>{icon}</div>
      </div>
    </div>
  );
}
