'use client';

import { useEffect, useState } from 'react';
import { reportsApi } from '@/app/lib/reportsApi';
import type { DumpsterUtilizationReport } from '@/app/types/reports';
import {
  TruckIcon,
  ExclamationCircleIcon,
  ChartBarIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

export default function DumpsterUtilizationPage() {
  const [report, setReport] = useState<DumpsterUtilizationReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await reportsApi.getDumpsterUtilizationReport();
      setReport(data);
      setError(null);
    } catch (err) {
      setError('Error loading dumpster utilization report');
      console.error('Error loading dumpster utilization report:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'in use':
      case 'in_use':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'out of service':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <p className="text-red-600">{error || 'Could not load utilization report'}</p>
          <button
            onClick={loadReport}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { summary, statusBreakdown, sizeBreakdown, locationBreakdown, dumpsterDetails } = report;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dumpster Utilization Report</h1>
        <button
          onClick={loadReport}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <ChartBarIcon className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Utilization Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Dumpsters"
            value={summary.totalDumpsters.toString()}
            icon={<TruckIcon className="w-6 h-6" />}
            color="bg-blue-500"
          />
          <SummaryCard
            title="In Use"
            value={summary.inUse.toString()}
            icon={<TruckIcon className="w-6 h-6" />}
            color="bg-red-500"
          />
          <SummaryCard
            title="Available"
            value={summary.available.toString()}
            icon={<TruckIcon className="w-6 h-6" />}
            color="bg-green-500"
          />
          <SummaryCard
            title="Utilization Rate"
            value={`${summary.utilizationRate.toFixed(1)}%`}
            icon={<ChartBarIcon className="w-6 h-6" />}
            color="bg-purple-500"
          />
        </div>
      </div>

      {/* Additional Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SummaryCard
          title="Maintenance"
          value={summary.maintenance.toString()}
          icon={<TruckIcon className="w-6 h-6" />}
          color="bg-yellow-500"
        />
        <SummaryCard
          title="Avg Usage Days"
          value={summary.averageUsageDays.toFixed(1)}
          icon={<ChartBarIcon className="w-6 h-6" />}
          color="bg-indigo-500"
        />
      </div>

      {/* Status Breakdown */}
      {statusBreakdown.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Status Breakdown</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {statusBreakdown.map((item, index) => (
                <div key={index} className="text-center">
                  <div className={`inline-block px-4 py-2 rounded-lg ${getStatusColor(item.status)} font-semibold mb-2`}>
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

      {/* Size Breakdown */}
      {sizeBreakdown.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Size Breakdown</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      In Use
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Available
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sizeBreakdown.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">
                        {item.inUse}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                        {item.available}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Location Breakdown */}
      {locationBreakdown.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPinIcon className="w-6 h-6" />
            Location Breakdown
          </h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dumpster Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilization Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {locationBreakdown.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.dumpsterCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${item.utilizationRate}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-700 font-semibold">
                            {item.utilizationRate.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Dumpster Details */}
      {dumpsterDetails.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Dumpster Details</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  {/*  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Contract
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Days In Use
                    </th>*/}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dumpsterDetails.map((dumpster, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{dumpster.dumpstersId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dumpster.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(dumpster.status)}`}>
                          {dumpster.status}
                        </span>
                      </td>
                   { /*  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dumpster.location || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dumpster.currentContract || 'None'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dumpster.daysInUse || 0}
                      </td>*/}
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
