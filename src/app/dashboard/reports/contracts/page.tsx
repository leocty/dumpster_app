'use client';

import { useEffect, useState } from 'react';
import { reportsApi } from '@/app/lib/reportsApi';
import type { ContractReport } from '@/app/types/reports';
import {
  DocumentTextIcon,
  ExclamationCircleIcon,
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default function ContractReportPage() {
  const [report, setReport] = useState<ContractReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Set default dates (current year)
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), 0, 1);
    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
    
    loadReport();
  }, []);

  const loadReport = async (start?: string, end?: string, filterStatus?: string) => {
    try {
      setLoading(true);
      const data = await reportsApi.getContractReport(start, end, filterStatus);
      setReport(data);
      setError(null);
    } catch (err) {
      setError('Error loading contract report');
      console.error('Error loading contract report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterApply = () => {
    loadReport(startDate, endDate, status);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
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
          <p className="text-red-600">{error || 'Could not load contract report'}</p>
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

  const { summary, contracts, statusDistribution, expiringContracts } = report;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Contract Report</h1>
        
        {/* Filters */}
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
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="PENDING">Pending</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
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
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Contract Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Contracts"
            value={summary.totalContracts.toString()}
            icon={<DocumentTextIcon className="w-6 h-6" />}
            color="bg-blue-500"
          />
          <SummaryCard
            title="Active Contracts"
            value={summary.activeContracts.toString()}
            icon={<DocumentTextIcon className="w-6 h-6" />}
            color="bg-green-500"
          />
          <SummaryCard
            title="Inactive Contracts"
            value={summary.inactiveContracts.toString()}
            icon={<DocumentTextIcon className="w-6 h-6" />}
            color="bg-gray-500"
          />
          <SummaryCard
            title="Avg Duration (days)"
            value={summary.averageDuration.toFixed(0)}
            icon={<ClockIcon className="w-6 h-6" />}
            color="bg-purple-500"
          />
        </div>
      </div>

      {/* Additional Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          title="Pending Contracts"
          value={summary.pendingContracts.toString()}
          icon={<DocumentTextIcon className="w-6 h-6" />}
          color="bg-yellow-500"
        />
        <SummaryCard
          title="Cancelled Contracts"
          value={summary.cancelledContracts.toString()}
          icon={<DocumentTextIcon className="w-6 h-6" />}
          color="bg-red-500"
        />
        <SummaryCard
          title="Expiring in 30 Days"
          value={summary.expiringIn30Days.toString()}
          icon={<ExclamationCircleIcon className="w-6 h-6" />}
          color="bg-orange-500"
        />
      </div>

      {/* Status Distribution */}
      {statusDistribution.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Status Distribution</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statusDistribution.map((item, index) => (
                <div key={index} className="text-center">
                  <div className={`inline-block px-4 py-2 rounded-lg ${getStatusBadgeColor(item.status)} font-semibold mb-2`}>
                    {item.status}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{item.count}</p>
                  <p className="text-sm text-gray-500">{item.percentage.toFixed(1)}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Expiring Contracts Alert */}
      {expiringContracts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ExclamationCircleIcon className="w-6 h-6 text-orange-500" />
            Contracts Expiring Soon
          </h2>
          <div className="bg-orange-50 border border-orange-200 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-orange-200">
                <thead className="bg-orange-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-orange-800 uppercase tracking-wider">
                      Days Until Expiry
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-orange-100">
                  {expiringContracts.map((contract, index) => (
                    <tr key={index} className="hover:bg-orange-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {contract.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contract.endDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          contract.daysUntilExpiry <= 7 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {contract.daysUntilExpiry} days
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Contracts List */}
      {contracts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Contract Details</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monthly Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dumpster Size
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contracts.map((contract, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{contract.contractId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {contract.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contract.startDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contract.endDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(contract.status)}`}>
                          {contract.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        ${contract.monthlyAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contract.dumpsterSize}
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
