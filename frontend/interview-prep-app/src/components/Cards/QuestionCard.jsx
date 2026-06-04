import React, { useRef, useState, useEffect } from "react";
import { LuChevronDown, LuPin, LuPinOff, LuSparkles } from "react-icons/lu";
import AIResponsePreview from "../AIResponsePreview";

const QuestionCard = ({ question, answer, onLearnMore, isPinned, onTogglePin, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
    setHeight(isExpanded ? contentRef.current.scrollHeight + 16 : 0);
  }, [isExpanded]);

  return (
    <div
      className={`relative rounded-2xl mb-3 group transition-all duration-300 ${
        isPinned
          ? "border border-orange-300 shadow-lg shadow-orange-100/60 bg-gradient-to-br from-orange-50/80 to-amber-50/40"
          : "border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-indigo-200"
      }`}
    >
      <style>{`
        @keyframes pinGlow {
          0%, 100% { box-shadow: 0 0 8px rgba(251,146,60,0.4); }
          50% { box-shadow: 0 0 16px rgba(251,146,60,0.7); }
        }
        @keyframes expandIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .pin-dot { animation: pinGlow 2s ease-in-out infinite; }
        .answer-content { animation: expandIn 0.25s ease forwards; }
      `}</style>

      {isPinned && (
        <div className="pin-dot absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-orange-400 border-2 border-white flex items-center justify-center z-10">
          <LuPin className="w-2 h-2 text-white" />
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shadow-sm transition-all duration-300 ${
                isExpanded
                  ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-indigo-200"
                  : isPinned
                  ? "bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-orange-200"
                  : "bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 group-hover:from-indigo-500 group-hover:to-purple-600 group-hover:text-white group-hover:shadow-indigo-200"
              }`}
            >
              Q
            </div>
            {isExpanded && <div className="w-px flex-1 mt-2 bg-gradient-to-b from-indigo-300/60 to-transparent min-h-[20px]" />}
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className="text-sm font-semibold text-gray-800 cursor-pointer leading-relaxed hover:text-indigo-700 transition-colors pr-2"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {question}
            </h3>

            <div
              className="overflow-hidden transition-all duration-350 ease-in-out"
              style={{ maxHeight: `${height}px` }}
            >
              <div ref={contentRef} className="pt-4">
                {isExpanded && (
                  <div className="answer-content">
                    <div className="rounded-xl bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-indigo-100/60 p-4">
                      <AIResponsePreview content={answer} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className={`flex items-center gap-1.5 transition-all ${isExpanded ? "flex" : "hidden group-hover:flex"}`}>
              <button
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  isPinned
                    ? "text-orange-500 bg-orange-100 hover:bg-orange-200"
                    : "text-gray-400 hover:text-orange-500 hover:bg-orange-50"
                }`}
                onClick={onTogglePin}
                title={isPinned ? "Unpin" : "Pin"}
              >
                {isPinned ? <LuPinOff className="w-3.5 h-3.5" /> : <LuPin className="w-3.5 h-3.5" />}
              </button>

              <button
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 rounded-lg shadow-sm shadow-indigo-200/50 transition-all active:scale-95"
                onClick={() => { setIsExpanded(true); onLearnMore(); }}
              >
                <LuSparkles className="w-3 h-3" />
                Learn More
              </button>
            </div>

            <button
              className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <LuChevronDown
                size={17}
                className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180 text-indigo-500" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
