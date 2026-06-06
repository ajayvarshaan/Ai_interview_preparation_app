import React from "react";
import { motion } from "framer-motion";
import { LuTrash2 } from "react-icons/lu";
import { getInitials } from "../../utils/helper";

const SummaryCard = ({
  colors,
  role,
  topicsToFocus,
  experience,
  questions,
  doneCount = 0,
  description,
  lastUpdated,
  onSelect,
  onDelete,
}) => {
  const progress =
    questions > 0 ? Math.round((doneCount / questions) * 100) : 0;

  const progressColor =
    progress === 100
      ? "bg-green-500"
      : progress >= 50
      ? "bg-orange-400"
      : "bg-indigo-500";

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
      onClick={onSelect}
    >
      {/* Header */}
      <div
        className="p-4 sm:p-5"
        style={{ background: colors?.bgColor || "#F8FAFC" }}
      >
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-white/80 border border-gray-200 flex items-center justify-center text-sm font-bold text-gray-700 shrink-0">
            {getInitials(role)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h2 className="text-sm sm:text-base font-semibold text-gray-900 leading-snug break-words">
              {role}
            </h2>

            {topicsToFocus && (
              <p className="text-xs text-orange-500 font-medium mt-1 break-words line-clamp-2">
                {topicsToFocus}
              </p>
            )}
          </div>

          {/* Delete Button */}
          <button
            className="shrink-0 p-2 rounded-lg border border-red-200 text-red-400 hover:text-red-600 hover:border-red-400 transition opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <LuTrash2 size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {experience} {experience === 1 ? "Year" : "Years"}
          </span>

          <span className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {questions} Q&A
          </span>

          <span className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {lastUpdated}
          </span>
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">
            {description}
          </p>
        )}

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="text-xs font-medium text-gray-500">
              Progress
            </span>

            <span
              className={`text-xs font-bold ${
                progress === 100
                  ? "text-green-500"
                  : progress >= 50
                  ? "text-orange-500"
                  : "text-indigo-500"
              }`}
            >
              {doneCount}/{questions} Done
              {progress === 100 && " 🎉"}
            </span>
          </div>

          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${progressColor}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
            />
          </div>

          <div className="mt-2 flex justify-end">
            <span className="text-xs text-gray-400">
              {progress}% completed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;