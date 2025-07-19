import React, { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const DataTable = ({ 
  columns, 
  data = [], 
  loading = false,
  onEdit,
  onDelete,
  onView,
  className 
}) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  const getStatusVariant = (status) => {
    const statusMap = {
      draft: "default",
      sent: "info",
      paid: "success",
      overdue: "danger",
      pending: "warning",
      completed: "success",
      failed: "danger"
    };
    return statusMap[status?.toLowerCase()] || "default";
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse flex items-center space-x-4 p-4 bg-white rounded-lg border">
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="w-20 h-6 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-xl border border-gray-100 overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center space-x-1 hover:text-primary transition-colors"
                    >
                      <span>{column.label}</span>
                      <ApperIcon 
                        name={
                          sortColumn === column.key 
                            ? sortDirection === "asc" ? "ChevronUp" : "ChevronDown"
                            : "ChevronsUpDown"
                        } 
                        className="w-3 h-3" 
                      />
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedData.map((row, index) => (
              <motion.tr
                key={row.Id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {column.render ? (
                      column.render(row[column.key], row)
                    ) : column.key === "status" ? (
                      <Badge variant={getStatusVariant(row[column.key])}>
                        {row[column.key]}
                      </Badge>
                    ) : column.key.includes("amount") || column.key.includes("total") ? (
                      <span className="font-medium text-gray-900">
                        ${parseFloat(row[column.key] || 0).toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-gray-900">{row[column.key]}</span>
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {onView && (
                      <Button
                        size="sm"
                        variant="ghost"
                        icon="Eye"
                        onClick={() => onView(row)}
                      />
                    )}
                    {onEdit && (
                      <Button
                        size="sm"
                        variant="ghost"
                        icon="Edit"
                        onClick={() => onEdit(row)}
                      />
                    )}
                    {onDelete && (
                      <Button
                        size="sm"
                        variant="ghost"
                        icon="Trash2"
                        onClick={() => onDelete(row)}
                      />
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length === 0 && !loading && (
        <div className="text-center py-12">
          <ApperIcon name="FileText" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No data available</p>
        </div>
      )}
    </div>
  );
};

export default DataTable;