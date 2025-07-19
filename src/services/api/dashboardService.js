import dashboardData from "@/services/mockData/dashboard.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getDashboardStats = async () => {
  await delay(300);
  return [...dashboardData.stats];
};

export const getRecentTransactions = async () => {
  await delay(400);
  return [...dashboardData.recentTransactions];
};