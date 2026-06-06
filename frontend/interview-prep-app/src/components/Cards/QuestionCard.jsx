import React, { useRef, useState, useEffect } from "react";
import {
  LuChevronDown,
  LuPin,
  LuPinOff,
  LuSparkles,
  LuCircleCheck,
  LuCircle,
} from "react-icons/lu";
import AIResponsePreview from "../AIResponsePreview";

const QuestionCard = ({
  question,
  answer,
  onLearnMore,
  isPinned,
  onTogglePin,
  isDone,
  onToggleDone,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isExpanded ? contentRef.current.scrollHeight + 16 : 0);
    }
  }, [isExpanded]);

  return (
    <div
      className={`relative rounded-2xl mb-4 group transition-all duration-300 overflow-hidden isolation-isolate ${
        isDone
          ? "border border-green-200 bg-green-50/40 shadow-sm"
          : isPinned
          ? "border border-orange-300 shadow-lg shadow-orange-100/60 bg-gradient-to-br from-orange-50/80 to-amber-50/40"
          : "border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-indigo-200"
      }`}
    >
      <style>{`
        @keyframes pinGlow {
          0%,100% {
            box-shadow: 0 0 8px rgba(251,146,60,0.4);
          }
          50% {
            box-shadow: 0 0 16px rgba(251,146,60,0.7);
          }
        }

        @keyframes expandIn {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .pin-dot {
          animation: pinGlow 2s ease-in-out infinite;
        }

        .answer-content {
          animation: expandIn 0.25s ease forwards;
        }
      `}</style>

      {isPinned && !isDone && (
        <div className="pin-dot absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-orange-400 border-2 border-white flex items-center justify-center z-10">
          <LuPin className="w-2 h-2 text-white" />
        </div>
      )}

      {isDone && (
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-green-500 border-2 border-white flex items-center justify-center z-10 pointer-events-none">
          <LuCircleCheck className="w-2.5 h-2.5 text-white" />
        </div>
      )}

      <div className="p-4 sm:p-5">
        <div className="flex gap-3 sm:gap-4">
          {/* Left Indicator */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shadow-sm transition-all duration-300 ${
                isDone
                  ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white"
                  : isExpanded
                  ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                  : isPinned
                  ? "bg-gradient-to-br from-orange-400 to-amber-500 text-white"
                  : "bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 group-hover:from-indigo-500 group-hover:to-purple-600 group-hover:text-white"
              }`}
            >
              {isDone ? "✓" : "Q"}
            </div>

            {isExpanded && (
              <div className="w-px flex-1 mt-2 bg-gradient-to-b from-indigo-300/60 to-transparent min-h-[20px]" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3
              className={`text-sm sm:text-base font-semibold leading-relaxed cursor-pointer transition-colors break-words ${
                isDone
                  ? "line-through text-gray-400"
                  : "text-gray-800 hover:text-indigo-700"
              }`}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {question}
            </h3>

            {/* Mobile Actions */}
            <div className="flex sm:hidden items-center justify-between mt-4">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  className={`p-2 rounded-lg transition-all ${
                    isDone
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                  onClick={onToggleDone}
                >
                  {isDone ? (
                    <LuCircleCheck className="w-4 h-4" />
                  ) : (
                    <LuCircle className="w-4 h-4" />
                  )}
                </button>

                <button
                  className={`p-2 rounded-lg transition-all ${
                    isPinned
                      ? "bg-orange-100 text-orange-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                  onClick={onTogglePin}
                >
                  {isPinned ? (
                    <LuPinOff className="w-4 h-4" />
                  ) : (
                    <LuPin className="w-4 h-4" />
                  )}
                </button>

                <button
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white rounded-lg bg-gradient-to-r from-violet-500 to-indigo-600 shadow-sm"
                  onClick={() => {
                    setIsExpanded(true);
                    onLearnMore();
                  }}
                >
                  <LuSparkles className="w-3 h-3" />
                  Learn More
                </button>
              </div>

              <button
                className="p-2 text-gray-400 hover:text-indigo-600"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <LuChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    isExpanded ? "rotate-180 text-indigo-500" : ""
                  }`}
                />
              </button>
            </div>

            {/* Answer */}
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{ maxHeight: `${height}px` }}
            >
              <div ref={contentRef} className="pt-4">
                {isExpanded && (
                  <div className="answer-content">
                    <div className="rounded-xl bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-indigo-100/60 p-3 sm:p-4">
                      <AIResponsePreview content={answer} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <button
              className={`p-2 rounded-lg transition-all ${
                isDone
                  ? "bg-green-100 text-green-600"
                  : "text-gray-400 hover:text-green-600 hover:bg-green-50"
              }`}
              onClick={onToggleDone}
            >
              {isDone ? (
                <LuCircleCheck className="w-4 h-4" />
              ) : (
                <LuCircle className="w-4 h-4" />
              )}
            </button>

            <button
              className={`p-2 rounded-lg transition-all ${
                isPinned
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-400 hover:text-orange-600 hover:bg-orange-50"
              }`}
              onClick={onTogglePin}
            >
              {isPinned ? (
                <LuPinOff className="w-4 h-4" />
              ) : (
                <LuPin className="w-4 h-4" />
              )}
            </button>

            <button
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 rounded-lg shadow-sm transition-all"
              onClick={() => {
                setIsExpanded(true);
                onLearnMore();
              }}
            >
              <LuSparkles className="w-3 h-3" />
              Learn More
            </button>

            <button
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <LuChevronDown
                size={18}
                className={`transition-transform duration-300 ${
                  isExpanded ? "rotate-180 text-indigo-500" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;