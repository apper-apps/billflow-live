import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SearchBar from "@/components/molecules/SearchBar";
import DataTable from "@/components/molecules/DataTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Icon from "@/components/atoms/Icon";
import { getSalesInvoices, getSalesOrders, getSalesQuotes } from "@/services/api/salesService";
import { toast } from "react-toastify";

const Sales = () => {
  const [activeTab, setActiveTab] = useState("invoices");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    { id: "invoices", label: "Invoices", icon: "FileText" },
    { id: "orders", label: "Sales Orders", icon: "ShoppingCart" },
    { id: "quotes", label: "Quotes", icon: "Calculator" }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      let result = [];
      switch (activeTab) {
        case "invoices":
          result = await getSalesInvoices();
          break;
        case "orders":
          result = await getSalesOrders();
          break;
        case "quotes":
          result = await getSalesQuotes();
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
    toast.info(`Edit ${activeTab.slice(0, -1)} ${item.number}`);
  };

  const handleDelete = (item) => {
    toast.success(`${activeTab.slice(0, -1)} ${item.number} deleted successfully`);
    setData(prev => prev.filter(d => d.Id !== item.Id));
  };

  const handleView = (item) => {
    toast.info(`Viewing ${activeTab.slice(0, -1)} ${item.number}`);
  };

  const filteredData = data.filter(item =>
    !searchTerm || 
    item.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.contactName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: "number", label: "Number", sortable: true },
    { key: "contactName", label: "Customer", sortable: true },
    { key: "date", label: "Date", sortable: true },
    { key: "amount", label: "Amount", sortable: true },
    { key: "status", label: "Status", sortable: true }
  ];

  const getCreateButtonText = () => {
    const mapping = {
      invoices: "New Invoice",
      orders: "New Order",
      quotes: "New Quote"
    };
    return mapping[activeTab];
  };

  const getCreateButtonIcon = () => {
    const mapping = {
      invoices: "FileText",
      orders: "ShoppingCart",
      quotes: "Calculator"
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
          <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
          <p className="text-gray-600 mt-1">Manage your sales quotes, orders, and invoices</p>
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
                  ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-primary hover:bg-gray-50"
              }`}
>
              <span className="mr-2">
                <Icon name={tab.icon} className="w-4 h-4" />
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
            description={`Start by creating your first ${activeTab.slice(0, -1)} to track your sales.`}
            icon={getCreateButtonIcon()}
            actionText={getCreateButtonText()}
          />
        ) : (
          <DataTable
            columns={columns}
            data={filteredData}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        )}
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total {activeTab}</p>
              <p className="text-2xl font-bold text-gray-900">{filteredData.length}</p>
</div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="FileText" className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${filteredData.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0).toLocaleString()}
              </p>
</div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon name="DollarSign" className="w-6 h-6 text-green-600" />
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
              <Icon name="Clock" className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Sales;