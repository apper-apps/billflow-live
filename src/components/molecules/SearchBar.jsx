import React, { useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { motion, AnimatePresence } from "framer-motion";

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  onFilter,
  showFilters = false,
  className 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.(searchTerm);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <div className={className}>
      <form onSubmit={handleSearch} className="flex items-center space-x-3">
        <div className="flex-1">
          <Input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleInputChange}
            icon="Search"
            iconPosition="left"
          />
        </div>
        
        {showFilters && (
          <Button
            type="button"
            variant="outline"
            icon="Filter"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
          >
            Filters
          </Button>
        )}
        
        <Button type="submit" icon="Search">
          Search
        </Button>
      </form>

      <AnimatePresence>
        {showFilterPanel && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 p-4 bg-gray-50 rounded-lg border"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Date From" type="date" />
              <Input label="Date To" type="date" />
              <Input label="Status" />
            </div>
            <div className="flex justify-end mt-4 space-x-3">
              <Button variant="ghost" onClick={() => setShowFilterPanel(false)}>
                Cancel
              </Button>
              <Button onClick={onFilter}>
                Apply Filters
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;