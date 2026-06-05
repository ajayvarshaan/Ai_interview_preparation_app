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
  const progress = questions > 0 ? Math.round((doneCount / questions) * 100) : 0;
  const progressColor =
    progress === 100 ? "bg-green-500" :
    progress >= 50  ? "bg-orange-400" :
                      "bg-indigo-400";

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition group"
      onClick={onSelect}
    >
      {/* Colored header */}
      <div className="p-5" style={{ background: colors.bgColor }}>
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center text-sm font-bold text-gray-700 border border-gray-200 shrink-0">
            <span>{getInitials(role)}</span>
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-gray-900 truncate">{role}</h2>
            <p className="text-xs text-orange-500 font-medium mt-0.5 truncate">{topicsToFocus}</p>
          </div>

          <button
            className="text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 p-1.5 rounded-lg transition shrink-0 opacity-0 group-hover:opacity-100"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
          >
            <LuTrash2 size={14} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {experience} {experience == 1 ? "Year" : "Years"}
          </div>
          <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {questions} Q&A
          </div>
          <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {lastUpdated}
          </div>
        </div>

        {description && (
          <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{description}</p>
        )}

        {/* Progress bar */}
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-500">Progress</span>
            <span className={`text-xs font-bold ${
              progress === 100 ? "text-green-500" : progress >= 50 ? "text-orange-500" : "text-indigo-500"
            }`}>
              {doneCount}/{questions} done
              {progress === 100 && " 🎉"}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${progressColor}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
