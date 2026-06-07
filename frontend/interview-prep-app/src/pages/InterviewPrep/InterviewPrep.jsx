import { useState, useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import {
  LuCircleAlert, LuSparkles, LuX, LuBrain,
  LuZap, LuSwords, LuDownload,

  LuSearch, LuFilter,
} from "react-icons/lu";
import { exportSessionToPDF } from "../../utils/exportPDF";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import RoleInfoHeader from "../../components/RoleInfoHeader";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import QuestionCard from "../../components/Cards/QuestionCard";
import AIResponsePreview from "../../components/AIResponsePreview";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";

const InterviewPrep = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [openLearnMoreDrawer, setOpenLearnMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoader, setIsUpdateLoader] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all | pinned | done | undone

  const fetchSessionDetailsById = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(sessionId));
      if (response.data?.session) setSessionData(response.data.session);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const generateConceptExplanation = async (question) => {
    try {
      setErrorMsg("");
      setExplanation(null);
      setIsLoading(true);
      setOpenLearnMoreDrawer(true);
      const response = await axiosInstance.post(API_PATHS.AI.GENERATE_EXPLANATION, { question });
      if (response.data) setExplanation(response.data);
    } catch (error) {
      setExplanation(null);
      setErrorMsg("Failed to generate explanation. Try again later.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleQuestionPinStatus = async (questionId) => {
    try {
      const response = await axiosInstance.post(API_PATHS.QUESTION.PIN(questionId));
      if (response.data?.question) fetchSessionDetailsById();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const toggleQuestionDoneStatus = async (questionId) => {
    try {
      const response = await axiosInstance.post(API_PATHS.QUESTION.DONE(questionId));
      if (response.data?.question) fetchSessionDetailsById();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const uploadMoreQuestions = async () => {
    try {
      setIsUpdateLoader(true);
      const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        role: sessionData?.role,
        experience: sessionData?.experience,
        topicsToFocus: sessionData?.topicsToFocus,
        numberOfQuestions: 10,
      });
      const response = await axiosInstance.post(API_PATHS.QUESTION.ADD_TO_SESSION, {
        sessionId,
        questions: aiResponse.data,
      });
      if (response.data) {
        toast.success("Added More Q&A!!");
        fetchSessionDetailsById();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsUpdateLoader(false);
    }
  };

  useEffect(() => {
    if (sessionId) fetchSessionDetailsById();
    return () => {};
  }, []);

  const totalQ  = sessionData?.questions?.length || 0;
  const pinnedQ  = sessionData?.questions?.filter(q => q.isPinned)?.length || 0;
  const doneQ    = sessionData?.questions?.filter(q => q.isDone)?.length || 0;

  const progress = totalQ > 0 ? Math.round((doneQ / totalQ) * 100) : 0;

  const FILTERS = [
    { key: "all", label: "All", count: totalQ },
    { key: "pinned", label: "Pinned", count: pinnedQ },
    { key: "done", label: "Done", count: doneQ },
    { key: "undone", label: "Undone", count: totalQ - doneQ },
  ];

  const filteredQuestions = (sessionData?.questions || [])
    .filter((q) => {
      const matchSearch = (q.question || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchFilter =
        filter === "all"
          ? true
          : filter === "pinned"
            ? q.isPinned
            : filter === "done"
              ? q.isDone
              : filter === "undone"
                ? !q.isDone
                : true;

      return matchSearch && matchFilter;
    });

  return (
    <DashboardLayout>
      <style>{`
        @keyframes sectionFadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmerLoad {
          0% { background-position: -300% 0; }
          100% { background-position: 300% 0; }
        }
        @keyframes panelIn {
          from { opacity: 0; transform: translateX(24px) scale(0.98); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes glowBtn {
          0%, 100% { box-shadow: 0 0 12px rgba(99,102,241,0.35); }
          50% { box-shadow: 0 0 28px rgba(99,102,241,0.65), 0 0 48px rgba(99,102,241,0.2); }
        }
        @keyframes borderFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .section-anim { animation: sectionFadeIn 0.5s ease forwards; }
        .panel-anim { animation: panelIn 0.35s ease forwards; }
        .glow-btn { animation: glowBtn 2.5s ease-in-out infinite; }
        .shimmer-bg {
          background: linear-gradient(90deg, #6366f1 0%, #a78bfa 45%, #6366f1 100%);
          background-size: 300% 100%;
          animation: shimmerLoad 2.5s linear infinite;
        }
        .dot1 { animation: dotBounce 1.4s ease-in-out infinite 0s; }
        .dot2 { animation: dotBounce 1.4s ease-in-out infinite 0.2s; }
        .dot3 { animation: dotBounce 1.4s ease-in-out infinite 0.4s; }
        .page-bg {
          background: linear-gradient(180deg, #f8faff 0%, #f1f5ff 40%, #f8f8ff 100%);
          background-attachment: fixed;
        }
      `}</style>

      <RoleInfoHeader
        role={sessionData?.role || ""}
        topicsToFocus={sessionData?.topicsToFocus || ""}
        experience={sessionData?.experience || "-"}
        questions={totalQ}
        description={sessionData?.description || ""}
        lastUpdated={sessionData?.updatedAt ? moment(sessionData.updatedAt).format("Do MMM YYYY") : ""}
      />

      <div className="page-bg min-h-screen px-4 md:px-8 py-7">

        {/* Section Header */}
        <div className="section-anim flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200">
              <LuBrain className="text-white w-4.5 h-4.5" size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">Interview Q &amp; A</h2>
              <p className="text-xs text-gray-400 mt-0.5">{totalQ} questions · {pinnedQ} pinned · {doneQ} done</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => exportSessionToPDF(sessionData)}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl shadow-sm border border-gray-200 transition"
            >
              <LuDownload size={14} className="text-orange-500" />
              Export PDF
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate(`/mock-interview/${sessionId}`)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-orange-200 transition"
            >
              <LuSwords size={14} />
              Mock Interview
            </motion.button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Session Progress</span>
            <span className={`text-sm font-bold ${
              progress === 100 ? "text-green-500" : progress >= 50 ? "text-orange-500" : "text-indigo-500"
            }`}>
              {doneQ}/{totalQ} completed {progress === 100 && "🎉"}
            </span>
          </div>

          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                progress === 100 ? "bg-green-500" : progress >= 50 ? "bg-orange-400" : "bg-indigo-500"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mb-5 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent shadow-sm transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <LuX size={14} />
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-2 py-1.5 shadow-sm">
            <LuFilter size={13} className="text-gray-400 ml-1" />
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filter === f.key
                    ? "bg-indigo-500 text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {f.label}
                <span className={`ml-1 ${
                  filter === f.key ? "text-indigo-200" : "text-gray-400"
                }`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">

          {/* Questions List */}
          <div className={`col-span-12 transition-all duration-400 ${openLearnMoreDrawer ? "lg:col-span-7" : "lg:col-span-12"}`}>

            <AnimatePresence>
              {filteredQuestions.map((data, index) => (
                <motion.div
                  key={data._id || index}
                  initial={{ opacity: 0, y: 22, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.38, type: "spring", stiffness: 130, delay: index * 0.055, damping: 18 }}
                  layout
                  layoutId={`q-${data._id || index}`}
                >
                  <QuestionCard
                    question={data?.question}
                    answer={data?.answer}
                    onLearnMore={() => generateConceptExplanation(data.question)}
                    isPinned={data?.isPinned}
                    onTogglePin={() => toggleQuestionPinStatus(data._id)}
                    isDone={data?.isDone}
                    onToggleDone={() => toggleQuestionDoneStatus(data._id)}
                    index={index}
                  />

                  {!isLoading && filteredQuestions.length === index + 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-col items-center gap-3 mt-8 mb-6"
                    >
                      <div className="flex items-center gap-3 w-full max-w-sm">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
                        <span className="text-xs text-gray-400 font-medium whitespace-nowrap">end of questions</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
                      </div>
                      <button
                        className="glow-btn flex items-center gap-2.5 px-8 py-3 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-sm rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={isUpdateLoader}
                        onClick={uploadMoreQuestions}
                      >
                        {isUpdateLoader ? (
                          <SpinnerLoader />
                        ) : (
                          <LuZap className="w-4 h-4" />
                        )}
                        Generate More Questions
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Explanation Panel */}
          <AnimatePresence>
            {openLearnMoreDrawer && (
              <>
                {/* Mobile overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                  onClick={() => setOpenLearnMoreDrawer(false)}
                />

                <motion.div
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 18, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="fixed left-0 right-0 bottom-0 z-50 lg:static lg:col-span-5 lg:z-auto panel-anim rounded-t-3xl lg:rounded-2xl"
                >

                  <div className="sticky top-4 rounded-2xl overflow-hidden shadow-xl shadow-indigo-100/60 border border-indigo-100/80 lg:rounded-2xl lg:border-indigo-100/80">
                    {/* Panel Header */}

                    <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 px-5 py-4">


                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-500 to-purple-600 opacity-80" style={{ backgroundSize: "200% 100%", animation: "borderFlow 4s ease infinite" }} />
                    <div className="relative flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <LuSparkles className="text-white w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-white/70 text-xs font-medium mb-0.5">AI Concept Explanation</p>
                          <h2 className="text-sm font-bold text-white leading-snug line-clamp-2">
                            {isLoading ? (
                              <span className="flex items-center gap-1.5">
                                Generating
                                <span className="inline-flex gap-0.5 ml-1">
                                  <span className="dot1 w-1.5 h-1.5 rounded-full bg-white inline-block" />
                                  <span className="dot2 w-1.5 h-1.5 rounded-full bg-white inline-block" />
                                  <span className="dot3 w-1.5 h-1.5 rounded-full bg-white inline-block" />
                                </span>
                              </span>
                            ) : (
                              explanation?.title || "Concept Explanation"
                            )}
                          </h2>
                        </div>
                      </div>
                      <button
                        onClick={() => setOpenLearnMoreDrawer(false)}
                        className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/30 flex items-center justify-center text-white/80 hover:text-white transition-all flex-shrink-0"
                      >
                        <LuX size={14} />
                      </button>
                    </div>

                    {isLoading && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5">
                        <div className="h-full shimmer-bg" />
                      </div>
                    )}
                  </div>

                  {/* Panel Body */}
                  <div className="bg-white p-5 max-h-[calc(100vh-220px)] overflow-y-auto">
                    {errorMsg && (
                      <div className="flex items-start gap-2.5 p-3.5 mb-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
                        <LuCircleAlert className="mt-0.5 flex-shrink-0" size={15} />
                        <span className="font-medium">{errorMsg}</span>
                      </div>
                    )}

                    {isLoading && (
                      <div className="pt-1">
                        <SkeletonLoader />
                      </div>
                    )}

                    {!isLoading && explanation && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <AIResponsePreview content={explanation?.explanation} />
                      </motion.div>
                    )}
                  </div>
                </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default InterviewPrep;
