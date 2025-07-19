import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SearchBar from "@/components/molecules/SearchBar";
import DataTable from "@/components/molecules/DataTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { getPurchaseOrders, getPurchaseInvoices, getVendors } from "@/services/api/purchaseService";
import { toast } from "react-toastify";

const Purchases = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    { id: "orders", label: "Purchase Orders", icon: "ShoppingCart" },
    { id: "invoices", label: "Purchase Invoices", icon: "FileText" },
    { id: "vendors", label: "Vendors", icon: "Users" }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      let result = [];
      switch (activeTab) {
        case "orders":
          result = await getPurchaseOrders();
          break;
        case "invoices":
          result = await getPurchaseInvoices();
          break;
        case "vendors":
          result = await getVendors();
          break;
      }
      
      setData(result);
    } catch (err) {
      setError(`Failed to load ${activeTab}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleEdit = (item) => {
    toast.info(`Edit ${activeTab.slice(0, -1)} ${item.number || item.name}`);
  };

  const handleDelete = (item) => {
    toast.success(`${activeTab.slice(0, -1)} ${item.number || item.name} deleted successfully`);
    setData(prev => prev.filter(d => d.Id !== item.Id));
  };

  const handleView = (item) => {
    toast.info(`Viewing ${activeTab.slice(0, -1)} ${item.number || item.name}`);
  };

  const filteredData = data.filter(item =>
    !searchTerm || 
    item.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vendorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getColumns = () => {
    if (activeTab === "vendors") {
      return [
        { key: "name", label: "Vendor Name", sortable: true },
        { key: "email", label: "Email", sortable: true },
        { key: "phone", label: "Phone", sortable: true },
        { key: "totalOrders", label: "Orders", sortable: true },
        { key: "totalAmount", label: "Total Amount", sortable: true },
        { key: "status", label: "Status", sortable: true }
      ];
    }
    
    return [
      { key: "number", label: "Number", sortable: true },
      { key: "vendorName", label: "Vendor", sortable: true },
      { key: "date", label: "Date", sortable: true },
      { key: "amount", label: "Amount", sortable: true },
      { key: "status", label: "Status", sortable: true }
    ];
  };

  const getCreateButtonText = () => {
    const mapping = {
      orders: "New Purchase Order",
      invoices: "New Invoice",
      vendors: "Add Vendor"
    };
    return mapping[activeTab];
  };

  const getCreateButtonIcon = () => {
    const mapping = {
      orders: "ShoppingCart",
      invoices: "FileText",
      vendors: "UserPlus"
    };
    return mapping[activeTab];
  };

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchases</h1>
          <p className="text-gray-600 mt-1">Manage your purchase orders, invoices, and vendor relationships</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button icon={getCreateButtonIcon()}>
            {getCreateButtonText()}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Card className="p-1">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-secondary to-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:text-secondary hover:bg-gray-50"
              }`}
            >
              <span className="mr-2">
                <ApperIcon name={tab.icon} className="w-4 h-4" />
              </span>
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* Search and Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <SearchBar
          placeholder={`Search ${activeTab}...`}
          onSearch={handleSearch}
          showFilters={true}
          className="md:w-96"
        />
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" icon="Filter">
            Filter
          </Button>
          <Button variant="outline" icon="Download">
            Export
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <Card>
        {loading ? (
          <Loading type="table" />
        ) : filteredData.length === 0 ? (
          <Empty
            title={`No ${activeTab} found`}
            description={`Start by creating your first ${activeTab.slice(0, -1)} to manage your purchases.`}
            icon={getCreateButtonIcon()}
            actionText={getCreateButtonText()}
          />
        ) : (
          <DataTable
            columns={getColumns()}
            data={filteredData}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        )}
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total {activeTab}</p>
              <p className="text-2xl font-bold text-gray-900">{filteredData.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Package" className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${filteredData.reduce((sum, item) => sum + (parseFloat(item.amount || item.totalAmount) || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredData.filter(item => item.status === "pending" || item.status === "sent").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredData.filter(item => {
                  const itemDate = new Date(item.date);
                  const currentDate = new Date();
                  return itemDate.getMonth() === currentDate.getMonth() && 
                         itemDate.getFullYear() === currentDate.getFullYear();
                }).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Calendar" className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Purchases;