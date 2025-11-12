import { api } from './api';
import type {
  DashboardReport,
  RevenueReport,
  ContractReport,
  DumpsterUtilizationReport,
} from '../types/reports';

/**
 * Reports API Service
 * Handles all API calls to the backend reports endpoints
 */

export const reportsApi = {
  /**
   * Get Dashboard Report with all KPIs
   * @returns Promise<DashboardReport>
   */
  getDashboardReport: async (): Promise<DashboardReport> => {
    const response = await api.get<DashboardReport>('/reports/dashboard');
    return response.data;
  },

  /**
   * Get Revenue Report
   * @param startDate - Optional start date (YYYY-MM-DD)
   * @param endDate - Optional end date (YYYY-MM-DD)
   * @returns Promise<RevenueReport>
   */
  getRevenueReport: async (
    startDate?: string,
    endDate?: string
  ): Promise<RevenueReport> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await api.get<RevenueReport>(
      `/reports/revenue?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get Contract Report
   * @param startDate - Optional start date (YYYY-MM-DD)
   * @param endDate - Optional end date (YYYY-MM-DD)
   * @param status - Optional contract status filter
   * @returns Promise<ContractReport>
   */
  getContractReport: async (
    startDate?: string,
    endDate?: string,
    status?: string
  ): Promise<ContractReport> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (status) params.append('status', status);

    const response = await api.get<ContractReport>(
      `/reports/contracts?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get Dumpster Utilization Report
   * @returns Promise<DumpsterUtilizationReport>
   */
  getDumpsterUtilizationReport: async (): Promise<DumpsterUtilizationReport> => {
    const response = await api.get<DumpsterUtilizationReport>(
      '/reports/dumpster-utilization'
    );
    return response.data;
  },

  /**
   * Health check for reports API
   * @returns Promise<string>
   */
  healthCheck: async (): Promise<string> => {
    const response = await api.get<string>('/reports/health');
    return response.data;
  },
};

export default reportsApi;
