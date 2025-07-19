import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = useState(["main"]);

  const navigation = [
    {
      id: "main",
      label: "Main",
      items: [
        { name: "Dashboard", icon: "LayoutDashboard", href: "/" },
        { name: "Sales", icon: "ShoppingCart", href: "/sales" },
        { name: "Purchases", icon: "Package", href: "/purchases" },
        { name: "Inventory", icon: "Warehouse", href: "/inventory" },
      ]
    },
    {
      id: "management",
      label: "Management",
      items: [
        { name: "Contacts", icon: "Users", href: "/contacts" },
        { name: "Items", icon: "Box", href: "/items" },
        { name: "Reports", icon: "BarChart3", href: "/reports" },
      ]
    },
    {
      id: "admin",
      label: "Administration",
      items: [
        { name: "Users", icon: "UserCog", href: "/admin/users" },
        { name: "Settings", icon: "Settings", href: "/admin/settings" },
        { name: "Banking", icon: "CreditCard", href: "/admin/banking" },
      ]
    }
  ];

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const isActive = (href) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-col lg:w-60 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Receipt" className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              BillFlow Pro
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
          {navigation.map((group) => (
            <div key={group.id}>
              <button
                onClick={() => toggleGroup(group.id)}
                className="flex items-center justify-between w-full px-2 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-primary transition-colors"
              >
                <span>{group.label}</span>
                <ApperIcon 
                  name={expandedGroups.includes(group.id) ? "ChevronUp" : "ChevronDown"} 
                  className="w-3 h-3" 
                />
              </button>
              
              <AnimatePresence>
                {expandedGroups.includes(group.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-2 space-y-1"
                  >
                    {group.items.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        className={cn(
                          "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                          isActive(item.href)
                            ? "bg-gradient-to-r from-primary/10 to-blue-500/10 text-primary border-r-2 border-primary"
                            : "text-gray-600 hover:text-primary hover:bg-gray-50"
                        )}
                      >
                        <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
                        {item.name}
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <div className="lg:hidden">
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50"
            >
              <div className="flex-1 flex flex-col min-h-0">
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Receipt" className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                      BillFlow Pro
                    </span>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
                  {navigation.map((group) => (
                    <div key={group.id}>
                      <button
                        onClick={() => toggleGroup(group.id)}
                        className="flex items-center justify-between w-full px-2 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-primary transition-colors"
                      >
                        <span>{group.label}</span>
                        <ApperIcon 
                          name={expandedGroups.includes(group.id) ? "ChevronUp" : "ChevronDown"} 
                          className="w-3 h-3" 
                        />
                      </button>
                      
                      <AnimatePresence>
                        {expandedGroups.includes(group.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-2 space-y-1"
                          >
                            {group.items.map((item) => (
                              <NavLink
                                key={item.name}
                                to={item.href}
                                onClick={onClose}
                                className={cn(
                                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                                  isActive(item.href)
                                    ? "bg-gradient-to-r from-primary/10 to-blue-500/10 text-primary border-r-2 border-primary"
                                    : "text-gray-600 hover:text-primary hover:bg-gray-50"
                                )}
                              >
                                <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
                                {item.name}
                              </NavLink>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;