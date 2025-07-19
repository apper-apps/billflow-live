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
import { getInventoryItems, getWarehouses, getStores } from "@/services/api/inventoryService";
import { toast } from "react-toastify";

const Inventory = () => {
  const [activeTab, setActiveTab] = useState("items");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    { id: "items", label: "Items", icon: "Package" },
    { id: "warehouses", label: "Warehouses", icon: "Warehouse" },
    { id: "stores", label: "Stores", icon: "Store" }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      let result = [];
      switch (activeTab) {
        case "items":
          result = await getInventoryItems();
          break;
        case "warehouses":
          result = await getWarehouses();
          break;
        case "stores":
          result = await getStores();
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
    toast.info(`Edit ${item.name || item.sku}`);
  };

  const handleDelete = (item) => {
    toast.success(`${item.name || item.sku} deleted successfully`);
    setData(prev => prev.filter(d => d.Id !== item.Id));
  };

  const handleView = (item) => {
    toast.info(`Viewing ${item.name || item.sku}`);
  };

  const filteredData = data.filter(item =>
    !searchTerm || 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getColumns = () => {
    if (activeTab === "items") {
      return [
        { key: "sku", label: "SKU", sortable: true },
        { key: "name", label: "Item Name", sortable: true },
        { key: "category", label: "Category", sortable: true },
        { key: "stock", label: "Stock", sortable: true },
        { key: "reorderLevel", label: "Reorder Level", sortable: true },
        { key: "price", label: "Price", sortable: true },
        { key: "status", label: "Status", sortable: true }
      ];
    } else if (activeTab === "warehouses") {
      return [
        { key: "name", label: "Warehouse Name", sortable: true },
        { key: "location", label: "Location", sortable: true },
        { key: "capacity", label: "Capacity", sortable: true },
        { key: "utilization", label: "Utilization", sortable: true },
        { key: "manager", label: "Manager", sortable: true },
        { key: "status", label: "Status", sortable: true }
      ];
    } else {
      return [
        { key: "name", label: "Store Name", sortable: true },
        { key: "location", label: "Location", sortable: true },
        { key: "manager", label: "Manager", sortable: true },
        { key: "itemsCount", label: "Items", sortable: true },
        { key: "revenue", label: "Revenue", sortable: true },
        { key: "status", label: "Status", sortable: true }
      ];
    }
  };

  const getCreateButtonText = () => {
    const mapping = {
      items: "Add Item",
      warehouses: "Add Warehouse",
      stores: "Add Store"
    };
    return mapping[activeTab];
  };

  const getCreateButtonIcon = () => {
    const mapping = {
      items: "Plus",
      warehouses: "Building",
      stores: "MapPin"
    };
    return mapping[activeTab];
  };

  const getStockStatus = (stock, reorderLevel) => {
    if (stock === 0) return { variant: "danger", text: "Out of Stock" };
    if (stock <= reorderLevel) return { variant: "warning", text: "Low Stock" };
    return { variant: "success", text: "In Stock" };
  };

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Track and manage your inventory across warehouses and stores</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <Button variant="outline" icon="Upload">
            Import Items
          </Button>
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
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                  : "text-gray-600 hover:text-green-600 hover:bg-gray-50"
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
          {activeTab === "items" && (
            <Button variant="outline" icon="AlertTriangle">
              Low Stock Alerts
            </Button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <Card>
        {loading ? (
          <Loading type="table" />
        ) : filteredData.length === 0 ? (
          <Empty
            title={`No ${activeTab} found`}
            description={`Start by adding your first ${activeTab.slice(0, -1)} to manage your inventory.`}
            icon={getCreateButtonIcon()}
            actionText={getCreateButtonText()}
          />
        ) : (
          <DataTable
            columns={getColumns()}
            data={filteredData.map(item => ({
              ...item,
              status: activeTab === "items" ? getStockStatus(item.stock, item.reorderLevel).text : item.status
            }))}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        )}
      </Card>

      {/* Summary Stats */}
      {activeTab === "items" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{filteredData.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Package" className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-orange-600">
                  {filteredData.filter(item => item.stock <= item.reorderLevel && item.stock > 0).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="AlertTriangle" className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">
                  {filteredData.filter(item => item.stock === 0).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="XCircle" className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${filteredData.reduce((sum, item) => sum + (item.stock * item.price), 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="DollarSign" className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Inventory;