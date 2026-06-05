import React from "react";
import { motion } from "framer-motion";
import { LuTrash2, LuX } from "react-icons/lu";

const DeleteAlertContent = ({ content, onDelete, onCancel }) => {
  return (
    <div className="p-2">

      {/* Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="flex items-center justify-center mb-5"
      >
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center"
            >
              <LuTrash2 className="text-red-500 text-2xl" />
            </motion.div>
          </div>
          {/* Ripple rings */}
          {[1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-red-300"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.6 + i * 0.3, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
            />
          ))}
        </div>
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-center mb-6"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Session?</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{content}</p>
      </motion.div>

      {/* Warning badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25 }}
        className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-6"
      >
        <span className="text-red-400 text-lg">⚠️</span>
        <p className="text-xs text-red-600 font-medium">This action cannot be undone. All questions in this session will be permanently removed.</p>
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={onCancel}
          className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold text-sm transition"
        >
          <LuX size={15} /> Cancel
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(239,68,68,0.35)" }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold text-sm transition shadow-md shadow-red-100"
        >
          <LuTrash2 size={15} /> Yes, Delete
        </motion.button>
      </motion.div>
    </div>
  );
};

export default DeleteAlertContent;
