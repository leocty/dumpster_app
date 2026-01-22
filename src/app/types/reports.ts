// Report Types for Backend Integration

export interface FinancialMetrics {
  currentMonthRevenue: number;
  pendingPayments: number;
  additionalCharges: number;
  totalRevenue: number;
  currentMonthExpenses?: number;
  totalExpenses?: number;
}

export interface OperationalMetrics {
  activeContracts: number;
  totalDumpsters: number;
  dumpstersInUse: number;
  dumpstersAvailable: number;
  todayTransfers: number;
  utilizationRate: number;
}

export interface CustomerMetrics {
  totalActiveCustomers: number;
  newCustomersThisMonth: number;
  customersWithOverduePayments: number;
}

export interface DriverMetrics {
  activeDrivers: number;
  pendingTransfers: number;
  pendingDriverPayments: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface ContractStatusCount {
  status: string;
  count: number;
}

export interface TopCustomer {
  customerId: number;
  customerName: string;
  contractCount: number;
  totalRevenue: number;
}

export interface DashboardReport {
  financialMetrics: FinancialMetrics;
  operationalMetrics: OperationalMetrics;
  customerMetrics: CustomerMetrics;
  driverMetrics: DriverMetrics;
  revenueChart: MonthlyRevenue[];
  contractDistribution: ContractStatusCount[];
  topCustomers: TopCustomer[];
}

// Revenue Report Types
export interface RevenueSummary {
  totalRevenue: number;
  paidAmount: number;
  pendingAmount: number;
  totalContracts: number;
  paidContracts: number;
  pendingContracts: number;
  averageContractValue: number;
}

export interface RevenueByCustomer {
  customerId: number;
  customerName: string;
  totalRevenue: number;
  contractCount: number;
}

export interface RevenueByMonth {
  month: string;
  revenue: number;
  contractCount: number;
}

export interface AdditionalCharge {
  chargeType: string;
  totalAmount: number;
  count: number;
}

export interface RevenueReport {
  summary: RevenueSummary;
  revenueByCustomer: RevenueByCustomer[];
  revenueByMonth: RevenueByMonth[];
  additionalCharges: AdditionalCharge[];
}

// Contract Report Types
export interface ContractSummary {
  totalContracts: number;
  activeContracts: number;
  finalizedContracts: number;
  pendingContracts: number;
  cancelledContracts: number;
  averageDuration: number;
  expiringIn30Days: number;
}

export interface ContractDetail {
  contractId: number;
  customerName: string;
  startDate: string;
  endDate: string;
  contractStatus: string;
  monthlyAmount: number;
  dumpsterSize: string;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
}

export interface ExpiringContract {
  contractId: number;
  customerName: string;
  endDate: string;
  daysUntilExpiry: number;
}

export interface ContractReport {
  summary: ContractSummary;
  contracts: ContractDetail[];
  statusDistribution: StatusDistribution[];
  expiringContracts: ExpiringContract[];
}

// Dumpster Utilization Report Types
export interface DumpsterUtilizationSummary {
  totalDumpsters: number;
  inUse: number;
  available: number;
  maintenance: number;
  utilizationRate: number;
  averageUsageDays: number;
}

export interface StatusBreakdown {
  status: string;
  count: number;
  percentage: number;
}

export interface SizeBreakdown {
  size: string;
  total: number;
  inUse: number;
  available: number;
}

export interface LocationBreakdown {
  location: string;
  dumpsterCount: number;
  utilizationRate: number;
}

export interface DumpsterDetail {
  dumpstersId: number;
  size: string;
  status: string;
  location: string;
  currentContract: string | null;
  daysInUse: number;
}

export interface DumpsterUtilizationReport {
  summary: DumpsterUtilizationSummary;
  statusBreakdown: StatusBreakdown[];
  sizeBreakdown: SizeBreakdown[];
  locationBreakdown: LocationBreakdown[];
  dumpsterDetails: DumpsterDetail[];
}
