import React from "react";
import { LuTrash2 } from "react-icons/lu";
import { getInitials } from "../../utils/helper";

const SummaryCard = ({
  colors,
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated,
  onSelect,
  onDelete,
}) => {
return (
  <div
    className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition"
    onClick={onSelect}
  >
    <div
      className="p-5"
      style={{ background: colors.bgColor }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center text-sm font-bold text-gray-700 border border-gray-200 shrink-0">
          <span>{getInitials(role)}</span>
        </div>

        <div className="flex-1">
          <h2 className="text-base font-semibold text-gray-900">{role}</h2>
          <p className="text-xs text-orange-500 font-medium mt-0.5">{topicsToFocus}</p>
        </div>

        <button
          className="text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-3 py-1 rounded-lg transition shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <LuTrash2 className="text-sm" />
        </button>
      </div>
    </div>

    <div className="px-5 py-4">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Experience: {experience} {experience == 1 ? "Year" : "Years"}
        </div>
        <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {questions} Q&A
        </div>
        <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Last Updated: {lastUpdated}
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
);
};

export default SummaryCard;