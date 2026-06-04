import React from "react";
import { LuX } from "react-icons/lu";

const Drawer = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      <div className="fixed lg:static inset-y-0 right-0 w-full sm:w-96 lg:w-auto bg-white shadow-2xl lg:shadow-sm z-50 lg:z-auto flex flex-col rounded-l-2xl lg:rounded-xl border-l lg:border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 truncate pr-2">
            {title || "Details"}
          </h2>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-white transition-colors"
            aria-label="Close drawer"
          >
            <LuX size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 bg-white">
          {children}
        </div>
      </div>
    </>
  );
};

export default Drawer;
