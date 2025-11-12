'use client';

import { useEffect, useState } from 'react';
import { useBusinessExpenses } from '@/app/hooks/useBusinessExpenses';
import type { BusinessExpenses } from '@/app/types/BusinessExpenses';
import {
  CurrencyDollarIcon,
  CalendarIcon,
  ChartBarIcon,
  ExclamationCircleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import dayjs from 'dayjs';

export default function ExpensesReportPage() {
  const { getBusinessExpenses } = useBusinessExpenses();
  const [expenses, setExpenses] = useState<BusinessExpenses[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState<BusinessExpenses[]>([]);

  useEffect(() => {
    // Set default dates (current month)
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
    
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const response = await getBusinessExpenses(1, 1000, '', ''); // Get all expenses
      if (response) {
        setExpenses(response.data);
      }
      setError(null);
    } catch (err) {
      setError('Error loading expenses');
      console.error('Error loading expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (expenses.length > 0 && startDate && endDate) {
      filterExpensesByDate();
    }
  }, [expenses, startDate, endDate]);

  const filterExpensesByDate = () => {
    const filtered = expenses.filter(expense => {
      const expenseDate = dayjs(expense.date).format('YYYY-MM-DD');
      return expenseDate >= startDate && expenseDate <= endDate;
    });
    setFilteredExpenses(filtered);
  };

  const handleFilterApply = () => {
    filterExpensesByDate();
  };

  // Calculate summary metrics
  const calculateSummary = () => {
    const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.totalAmount, 0);
    const expensesByArea = filteredExpenses.reduce((acc, exp) => {
      acc[exp.specificArea] = (acc[exp.specificArea] || 0) + exp.totalAmount;
      return acc;
    }, {} as Record<string, number>);

    const expensesByPaymentMethod = filteredExpenses.reduce((acc, exp) => {
      acc[exp.paymentMethod] = (acc[exp.paymentMethod] || 0) + exp.totalAmount;
      return acc;
    }, {} as Record<string, number>);

    const expensesByMonth = filteredExpenses.reduce((acc, exp) => {
      const month = dayjs(exp.date).format('YYYY-MM');
      acc[month] = (acc[month] || 0) + exp.totalAmount;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalExpenses,
      totalCount: filteredExpenses.length,
      averageExpense: filteredExpenses.length > 0 ? totalExpenses / filteredExpenses.length : 0,
      expensesByArea: Object.entries(expensesByArea).map(([area, amount]) => ({ area, amount })),
      expensesByPaymentMethod: Object.entries(expensesByPaymentMethod).map(([method, amount]) => ({ method, amount })),
      expensesByMonth: Object.entries(expensesByMonth).map(([month, amount]) => ({ month, amount })).sort((a, b) => a.month.localeCompare(b.month)),
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ExclamationCircleIcon className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <p className="text-red-600">{error}</p>
          <button
            onClick={loadExpenses}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const summary = calculateSummary();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Business Expenses Report</h1>
        
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
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Expenses Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SummaryCard
            title="Total Expenses"
            value={`$${summary.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={<CurrencyDollarIcon className="w-6 h-6" />}
            color="bg-red-500"
          />
          <SummaryCard
            title="Total Transactions"
            value={summary.totalCount.toString()}
            icon={<DocumentTextIcon className="w-6 h-6" />}
            color="bg-blue-500"
          />
          <SummaryCard
            title="Average Expense"
            value={`$${summary.averageExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={<ChartBarIcon className="w-6 h-6" />}
            color="bg-purple-500"
          />
        </div>
      </div>

      {/* Expenses by Area */}
      {summary.expensesByArea.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Expenses by Area</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Area
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {summary.expensesByArea
                    .sort((a, b) => b.amount - a.amount)
                    .map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.area}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                          ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {((item.amount / summary.totalExpenses) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Expenses by Payment Method */}
      {summary.expensesByPaymentMethod.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Expenses by Payment Method</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {summary.expensesByPaymentMethod
                    .sort((a, b) => b.amount - a.amount)
                    .map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.method}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                          ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {((item.amount / summary.totalExpenses) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Expenses by Month */}
      {summary.expensesByMonth.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Expenses by Month</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {summary.expensesByMonth.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {dayjs(item.month).format('MMMM YYYY')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Expenses List */}
      {filteredExpenses.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Detailed Expenses</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Area
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Beneficiary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredExpenses
                    .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())
                    .map((expense) => (
                      <tr key={expense.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {dayjs(expense.date).format('YYYY-MM-DD')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {expense.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {expense.specificArea}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {expense.beneficiary || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {expense.paymentMethod}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                          ${expense.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {filteredExpenses.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No expenses found for the selected date range</p>
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
