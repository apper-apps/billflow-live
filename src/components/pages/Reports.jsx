import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { getReportsData } from "@/services/api/reportsService";
import { toast } from "react-toastify";

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0]
  });
  const [reportsData, setReportsData] = useState({
    salesReports: [],
    purchaseReports: [],
    inventoryReports: [],
    financialReports: []
  });

  const loadReportsData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await getReportsData(dateRange);
      setReportsData(data);
    } catch (err) {
      setError("Failed to load reports data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportsData();
  }, [dateRange]);

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExportReport = (reportType) => {
    toast.success(`${reportType} report exported successfully`);
  };

  const reportCategories = [
    {
      title: "Sales Reports",
      description: "Analyze your sales performance and customer trends",
      icon: "TrendingUp",
      color: "blue",
      reports: [
        { name: "Sales Summary", description: "Overview of sales by period" },
        { name: "Customer Analysis", description: "Top customers and buying patterns" },
        { name: "Product Performance", description: "Best and worst selling items" },
        { name: "Sales Team Performance", description: "Individual salesperson metrics" }
      ]
    },
    {
      title: "Purchase Reports",
      description: "Track your procurement and vendor performance",
      icon: "ShoppingCart",
      color: "purple",
      reports: [
        { name: "Purchase Summary", description: "Overview of purchases by period" },
        { name: "Vendor Analysis", description: "Vendor performance and reliability" },
        { name: "Cost Analysis", description: "Purchase cost trends and savings" },
        { name: "Purchase Orders", description: "PO status and delivery tracking" }
      ]
    },
    {
      title: "Inventory Reports",
      description: "Monitor stock levels and inventory valuation",
      icon: "Package",
      color: "green",
      reports: [
        { name: "Stock Summary", description: "Current inventory levels by location" },
        { name: "Stock Movements", description: "In/out transactions and transfers" },
        { name: "Reorder Reports", description: "Items requiring restock" },
        { name: "Inventory Valuation", description: "Total inventory value analysis" }
      ]
    },
    {
      title: "Financial Reports",
      description: "Financial performance and accounting summaries",
      icon: "DollarSign",
      color: "orange",
      reports: [
        { name: "Profit & Loss", description: "Income statement for the period" },
        { name: "Cash Flow", description: "Cash inflows and outflows" },
        { name: "Accounts Receivable", description: "Outstanding customer payments" },
        { name: "Accounts Payable", description: "Outstanding vendor payments" }
      ]
    }
  ];

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadReportsData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Generate comprehensive business reports and insights</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button icon="Download">
            Export All Reports
          </Button>
        </div>
      </div>

      {/* Date Range Filter */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-end md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1">
            <Input
              label="Start Date"
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateRangeChange("startDate", e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Input
              label="End Date"
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateRangeChange("endDate", e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => {
              const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
              setDateRange({
                startDate: thirtyDaysAgo.toISOString().split("T")[0],
                endDate: new Date().toISOString().split("T")[0]
              });
            }}>
              Last 30 Days
            </Button>
            <Button variant="outline" onClick={() => {
              const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
              setDateRange({
                startDate: firstDayOfMonth.toISOString().split("T")[0],
                endDate: new Date().toISOString().split("T")[0]
              });
            }}>
              This Month
            </Button>
          </div>
        </div>
      </Card>

      {/* Report Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reportCategories.map((category, index) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${category.color}-100`}>
                    <ApperIcon name={category.icon} className={`w-6 h-6 text-${category.color}-600`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  icon="Download"
                  onClick={() => handleExportReport(category.title)}
                >
                  Export
                </Button>
              </div>

              <div className="space-y-3">
                {category.reports.map((report) => (
                  <div
                    key={report.name}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{report.name}</p>
                      <p className="text-sm text-gray-600">{report.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" icon="Eye">
                        View
                      </Button>
                      <Button variant="ghost" size="sm" icon="Download">
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$248,500</p>
              <p className="text-xs text-green-600 mt-1">+12.5% from last month</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">$156,300</p>
              <p className="text-xs text-red-600 mt-1">+5.2% from last month</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="CreditCard" className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Profit</p>
              <p className="text-2xl font-bold text-gray-900">$92,200</p>
              <p className="text-xs text-green-600 mt-1">+18.3% from last month</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">$34,800</p>
              <p className="text-xs text-orange-600 mt-1">15 pending invoices</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;