import reportsData from "@/services/mockData/reports.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getReportsData = async (dateRange) => {
  await delay(500);
  
  // Filter data based on date range if needed
  return {
    ...reportsData,
    dateRange
  };
};

export const generateReport = async (reportType, filters) => {
  await delay(800);
  
  const reportMap = {
    "sales": reportsData.salesReports,
    "purchases": reportsData.purchaseReports,
    "inventory": reportsData.inventoryReports,
    "financial": reportsData.financialReports
  };
  
  return reportMap[reportType] || [];
};

export const exportReport = async (reportType, format = "pdf") => {
  await delay(1000);
  
  return {
    success: true,
    filename: `${reportType}_report_${new Date().toISOString().split("T")[0]}.${format}`,
    downloadUrl: `/api/reports/download/${reportType}.${format}`
  };
};