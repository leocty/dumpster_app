'use client';

import { useEffect, useState } from 'react';
import { reportsApi } from '@/app/lib/reportsApi';
import type { DashboardReport } from '@/app/types/reports';
import {
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  TruckIcon,
  UsersIcon,
  ExclamationCircleIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

export default function ReportsPage() {
  const [report, setReport] = useState<DashboardReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await reportsApi.getDashboardReport();
      setReport(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar el dashboard');
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
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
          <p className="text-red-600">{error || 'Could not load dashboard'}</p>
          <button
            onClick={loadDashboard}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { financialMetrics, operationalMetrics, customerMetrics, driverMetrics } = report;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
        <button
          onClick={loadDashboard}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <ChartBarIcon className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Financial Metrics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Financial Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Current Month Revenue"
            value={`$${financialMetrics.currentMonthRevenue.toLocaleString()}`}
            icon={<CurrencyDollarIcon className="w-6 h-6" />}
            color="bg-green-500"
          />
          <MetricCard
            title="Pending Payments"
            value={`$${financialMetrics.pendingPayments.toLocaleString()}`}
            icon={<ExclamationCircleIcon className="w-6 h-6" />}
            color="bg-yellow-500"
          />
          <MetricCard
            title="Additional Charges"
            value={`$${financialMetrics.additionalCharges.toLocaleString()}`}
            icon={<ArrowTrendingUpIcon className="w-6 h-6" />}
            color="bg-blue-500"
          />
          <MetricCard
            title="Total Revenue"
            value={`$${financialMetrics.totalRevenue.toLocaleString()}`}
            icon={<CurrencyDollarIcon className="w-6 h-6" />}
            color="bg-purple-500"
          />
        </div>
        
        {/* Expenses Metrics (if available) */}
        {(financialMetrics.currentMonthExpenses !== undefined || financialMetrics.totalExpenses !== undefined) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {financialMetrics.currentMonthExpenses !== undefined && (
              <MetricCard
                title="Current Month Expenses"
                value={`$${financialMetrics.currentMonthExpenses.toLocaleString()}`}
                icon={<CurrencyDollarIcon className="w-6 h-6" />}
                color="bg-red-500"
              />
            )}
            {financialMetrics.totalExpenses !== undefined && (
              <MetricCard
                title="Total Expenses"
                value={`$${financialMetrics.totalExpenses.toLocaleString()}`}
                icon={<CurrencyDollarIcon className="w-6 h-6" />}
                color="bg-orange-500"
              />
            )}
          </div>
        )}
      </div>

      {/* Operational Metrics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Operational Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            title="Active Contracts"
            value={operationalMetrics.activeContracts.toString()}
            icon={<DocumentTextIcon className="w-6 h-6" />}
            color="bg-indigo-500"
          />
          <MetricCard
            title="Dumpsters In Use"
            value={`${operationalMetrics.dumpstersInUse} / ${operationalMetrics.totalDumpsters}`}
            icon={<TruckIcon className="w-6 h-6" />}
            color="bg-cyan-500"
          />
          <MetricCard
            title="Utilization Rate"
            value={`${operationalMetrics.utilizationRate.toFixed(1)}%`}
            icon={<ArrowTrendingUpIcon className="w-6 h-6" />}
            color="bg-teal-500"
          />
          <MetricCard
            title="Available Dumpsters"
            value={operationalMetrics.dumpstersAvailable.toString()}
            icon={<TruckIcon className="w-6 h-6" />}
            color="bg-green-500"
          />
          <MetricCard
            title="Today's Transfers"
            value={operationalMetrics.todayTransfers.toString()}
            icon={<ChartBarIcon className="w-6 h-6" />}
            color="bg-orange-500"
          />
        </div>
      </div>

      {/* Customer & Driver Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Metrics */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer Metrics</h2>
          <div className="space-y-4">
            <MetricCard
              title="Active Customers"
              value={customerMetrics.totalActiveCustomers.toString()}
              icon={<UsersIcon className="w-6 h-6" />}
              color="bg-blue-500"
            />
            <MetricCard
              title="New This Month"
              value={customerMetrics.newCustomersThisMonth.toString()}
              icon={<ArrowTrendingUpIcon className="w-6 h-6" />}
              color="bg-green-500"
            />
            <MetricCard
              title="With Overdue Payments"
              value={customerMetrics.customersWithOverduePayments.toString()}
              icon={<ExclamationCircleIcon className="w-6 h-6" />}
              color="bg-red-500"
            />
          </div>
        </div>

        {/* Driver Metrics */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Driver Metrics</h2>
          <div className="space-y-4">
            <MetricCard
              title="Active Drivers"
              value={driverMetrics.activeDrivers.toString()}
              icon={<UsersIcon className="w-6 h-6" />}
              color="bg-purple-500"
            />
            <MetricCard
              title="Pending Transfers"
              value={driverMetrics.pendingTransfers.toString()}
              icon={<DocumentTextIcon className="w-6 h-6" />}
              color="bg-yellow-500"
            />
            <MetricCard
              title="Pending Payments"
              value={`$${driverMetrics.pendingDriverPayments.toLocaleString()}`}
              icon={<CurrencyDollarIcon className="w-6 h-6" />}
              color="bg-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Top Customers */}
      {report.topCustomers.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Top 5 Customers</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contracts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {report.topCustomers.map((customer) => (
                  <tr key={customer.customerId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {customer.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.contractCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${customer.totalRevenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

function MetricCard({ title, value, icon, color }: MetricCardProps) {
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
