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
import { getContacts } from "@/services/api/contactsService";
import { toast } from "react-toastify";

const Contacts = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    { id: "all", label: "All Contacts", icon: "Users" },
    { id: "customers", label: "Customers", icon: "User" },
    { id: "suppliers", label: "Suppliers", icon: "Truck" }
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const result = await getContacts(activeTab);
      setData(result);
    } catch (err) {
      setError("Failed to load contacts. Please try again.");
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

  const handleEdit = (contact) => {
    toast.info(`Edit contact ${contact.name}`);
  };

  const handleDelete = (contact) => {
    toast.success(`Contact ${contact.name} deleted successfully`);
    setData(prev => prev.filter(d => d.Id !== contact.Id));
  };

  const handleView = (contact) => {
    toast.info(`Viewing contact ${contact.name}`);
  };

  const filteredData = data.filter(contact =>
    !searchTerm || 
    contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "type", label: "Type", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "phone", label: "Phone", sortable: true },
    { key: "totalTransactions", label: "Transactions", sortable: true },
    { key: "totalAmount", label: "Total Amount", sortable: true },
    { key: "status", label: "Status", sortable: true }
  ];

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-1">Manage your customers and suppliers</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <Button variant="outline" icon="Upload">
            Import Contacts
          </Button>
          <Button icon="UserPlus">
            Add Contact
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
          placeholder="Search contacts..."
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
          <Button variant="outline" icon="Mail">
            Send Email
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <Card>
        {loading ? (
          <Loading type="table" />
        ) : filteredData.length === 0 ? (
          <Empty
            title="No contacts found"
            description="Start building your contact database by adding customers and suppliers."
            icon="Users"
            actionText="Add Contact"
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Contacts</p>
              <p className="text-2xl font-bold text-gray-900">{filteredData.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Customers</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredData.filter(contact => contact.type === "customer").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="User" className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredData.filter(contact => contact.type === "supplier").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Truck" className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${filteredData.reduce((sum, contact) => sum + (parseFloat(contact.totalAmount) || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Contacts;