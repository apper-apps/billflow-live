import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatCard from "@/components/molecules/StatCard";
import DataTable from "@/components/molecules/DataTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { getDashboardStats, getRecentTransactions } from "@/services/api/dashboardService";

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [statsData, transactionsData] = await Promise.all([
        getDashboardStats(),
        getRecentTransactions()
      ]);
      
      setStats(statsData);
      setTransactions(transactionsData);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const transactionColumns = [
    { key: "type", label: "Type", sortable: true },
    { key: "number", label: "Number", sortable: true },
    { key: "contactName", label: "Contact", sortable: true },
    { key: "date", label: "Date", sortable: true },
    { key: "amount", label: "Amount", sortable: true },
    { key: "status", label: "Status", sortable: true }
  ];

  const quickActions = [
    { name: "New Invoice", icon: "FileText", href: "/sales/invoices/new", color: "blue" },
    { name: "Create Quote", icon: "Calculator", href: "/sales/quotes/new", color: "purple" },
    { name: "Add Purchase", icon: "ShoppingCart", href: "/purchases/new", color: "green" },
    { name: "Check Inventory", icon: "Package", href: "/inventory", color: "orange" },
  ];

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button icon="Download">
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <motion.button
              key={action.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col items-center p-4 text-center bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-${action.color}-500 to-${action.color}-600 flex items-center justify-center mb-3`}>
                <ApperIcon name={action.icon} className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900">{action.name}</span>
            </motion.button>
          ))}
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        
        {transactions.length === 0 ? (
          <Empty
            title="No recent transactions"
            description="Your recent transactions will appear here once you start creating invoices and orders."
            icon="Receipt"
            actionText="Create Invoice"
          />
        ) : (
          <DataTable
            columns={transactionColumns}
            data={transactions}
            loading={loading}
          />
        )}
      </Card>
    </div>
  );
};

export default Dashboard;