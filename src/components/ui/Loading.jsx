import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Loading = ({ className, type = "dashboard" }) => {
  const loadingVariants = {
    animate: {
      opacity: [0.4, 0.8, 0.4],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  if (type === "dashboard") {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              variants={loadingVariants}
              animate="animate"
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg"></div>
                <div className="w-12 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <div className="w-20 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                <div className="w-32 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <motion.div
              key={i}
              variants={loadingVariants}
              animate="animate"
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="w-48 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-6"></div>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="flex items-center justify-between">
                    <div className="w-32 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                    <div className="w-20 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            variants={loadingVariants}
            animate="animate"
            className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-100"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="w-48 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
              <div className="w-32 h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
            </div>
            <div className="w-24 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
            <div className="w-20 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      variants={loadingVariants}
      animate="animate"
      className={cn("bg-white rounded-xl p-6 shadow-sm border border-gray-100", className)}
    >
      <div className="space-y-4">
        <div className="w-48 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
        <div className="w-full h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg"></div>
        <div className="space-y-2">
          <div className="w-3/4 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
          <div className="w-1/2 h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default Loading;