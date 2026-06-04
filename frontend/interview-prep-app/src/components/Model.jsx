import React from "react";

const Model = ({ children, isOpen, onClose, title, hideHeader }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className={`relative flex flex-col bg-white shadow-2xl rounded-2xl overflow-hidden w-[95%] max-w-lg`}
      >
        {!hideHeader && (
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              {title}
            </h3>
          </div>
        )}

        <button
          type="button"
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100 transition"
          onClick={onClose}
        >
          <svg
            className="w-4 h-4 text-gray-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1l6 6m0 0l6 6M7 7L1 13"
            />
          </svg>
        </button>

        <div className="px-7 py-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Model;