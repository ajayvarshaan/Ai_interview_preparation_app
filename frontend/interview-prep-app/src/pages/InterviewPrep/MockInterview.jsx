import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuTimer, LuChevronRight, LuBrain, LuCircleCheck,
  LuCircleX, LuArrowLeft, LuSparkles, LuTrendingUp,
  LuCircleAlert, LuRefreshCw, LuMic, LuMicOff,
} from "react-icons/lu";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import useVoiceToText from "../../hooks/useVoiceToText";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import toast from "react-hot-toast";

const TIME_PER_QUESTION = 120; 

const ScoreRing = ({ score }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (score / 10) * circumference;
  const color = score >= 7 ? "#22c55e" : score >= 4 ? "#f97316" : "#ef4444";

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="96" height="96">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="8" />
        <motion.circle
          cx="48" cy="48" r={radius} fill="none"
          stroke={color} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - strokeDash }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <motion.span
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="text-2xl font-extrabold"
        style={{ color }}
      >
        {score}
      </motion.span>
    </div>
  );
};

const MockInterview = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [sessionData, setSessionData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [results, setResults] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const timerRef = useRef(null);

  const {
    isListening: isMicListening,
    transcript: voiceTranscript,
    isSupported: isMicSupported,
    startListening: startMic,
    stopListening: stopMic,
  } = useVoiceToText();

  // Sync voice transcript to userAnswer
  useEffect(() => {
    if (voiceTranscript) {
      setUserAnswer(voiceTranscript);
    }
  }, [voiceTranscript]);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(sessionId));
        if (res.data?.session) {
          setSessionData(res.data.session);
          setQuestions(res.data.session.questions || []);
        }
      } catch {
        toast.error("Failed to load session.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  useEffect(() => {
    if (!started || isFinished) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSubmitAnswer(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [started, currentIndex, isFinished]);

  const handleSubmitAnswer = async (timedOut = false) => {
    clearInterval(timerRef.current);
    const question = questions[currentIndex]?.question;
    const answer = timedOut ? "(No answer — timed out)" : userAnswer.trim() || "(No answer provided)";

    setIsEvaluating(true);
    try {
      const res = await axiosInstance.post(API_PATHS.AI.EVALUATE_ANSWER, { question, userAnswer: answer });
      const evaluation = res.data;
      setResults((prev) => [...prev, { question, userAnswer: answer, ...evaluation }]);
    } catch {
      setResults((prev) => [...prev, { question, userAnswer: answer, score: 0, feedback: "Evaluation failed.", idealAnswer: "", strengths: [], improvements: [] }]);
    } finally {
      setIsEvaluating(false);
      const next = currentIndex + 1;
      if (next >= questions.length) {
        setIsFinished(true);
      } else {
        setCurrentIndex(next);
        setUserAnswer("");
        setTimeLeft(TIME_PER_QUESTION);
      }
    }
  };

  const avgScore = results.length
    ? Math.round((results.reduce((s, r) => s + (r.score || 0), 0) / results.length) * 10) / 10
    : 0;

  const timerColor = timeLeft <= 20 ? "text-red-500" : timeLeft <= 60 ? "text-orange-500" : "text-green-600";
  const timerBg = timeLeft <= 20 ? "bg-red-50 border-red-200" : timeLeft <= 60 ? "bg-orange-50 border-orange-200" : "bg-green-50 border-green-200";

  if (isLoading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-96">
        <SpinnerLoader />
      </div>
    </DashboardLayout>
  );


  if (!started) return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-orange-500 to-orange-400 px-8 py-10 text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <LuBrain className="text-white text-3xl" />
            </motion.div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Mock Interview</h1>
            <p className="text-orange-100 text-sm">{sessionData?.role} · {questions.length} Questions</p>
          </div>

          <div className="px-8 py-8">
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Questions", value: questions.length, icon: "📝" },
                { label: "Time / Q", value: `${TIME_PER_QUESTION}s`, icon: "⏱️" },
                { label: "AI Scoring", value: "0–10", icon: "🤖" },
              ].map((stat) => (
                <div key={stat.label} className="bg-orange-50 rounded-2xl p-4 text-center border border-orange-100">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8">
              <div className="flex items-start gap-2">
                <LuCircleAlert className="text-amber-500 mt-0.5 shrink-0" />
                <div className="text-sm text-amber-700">
                  <p className="font-semibold mb-1">Before you start:</p>
                  <ul className="space-y-1 text-xs list-disc list-inside">
                    <li>Each question has a {TIME_PER_QUESTION} second timer</li>
                    <li>Your answer is evaluated by AI after submission</li>
                    <li>You can't go back to previous questions</li>
                    <li>Results and ideal answers shown at the end</li>
                  </ul>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setStarted(true)}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-orange-200 transition flex items-center justify-center gap-2"
            >
              Start Mock Interview <LuChevronRight className="text-lg" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );

  if (isFinished) return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Interview Complete! 🎉</h1>
          <p className="text-gray-400 text-sm">Here's how you performed across all questions</p>

          <div className="flex items-center justify-center gap-8 mt-8 bg-white rounded-3xl shadow-sm border border-gray-100 px-10 py-8">
            <div className="text-center">
              <ScoreRing score={avgScore} />
              <p className="text-xs text-gray-500 mt-2 font-medium">Avg Score</p>
            </div>
            <div className="space-y-3">
              {[
                { label: "Questions Answered", value: results.length, color: "text-blue-600" },
                { label: "High Scores (≥7)", value: results.filter(r => r.score >= 7).length, color: "text-green-600" },
                { label: "Needs Improvement (<4)", value: results.filter(r => r.score < 4).length, color: "text-red-500" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between gap-10">
                  <span className="text-xs text-gray-500">{s.label}</span>
                  <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="space-y-5 mb-8">
          {results.map((result, i) => {
            const scoreColor = result.score >= 7 ? "text-green-600 bg-green-50 border-green-200" : result.score >= 4 ? "text-orange-600 bg-orange-50 border-orange-200" : "text-red-600 bg-red-50 border-red-200";
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full text-xs font-bold flex items-center justify-center">{i + 1}</span>
                    <p className="text-sm font-semibold text-gray-800 line-clamp-1">{result.question}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${scoreColor}`}>{result.score}/10</span>
                </div>

                <div className="px-5 py-4 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">Your Answer</p>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-xl px-3 py-2">{result.userAnswer}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">AI Feedback</p>
                    <p className="text-sm text-gray-600">{result.feedback}</p>
                  </div>

                  {result.strengths?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {result.strengths.map((s, j) => (
                        <span key={j} className="flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full">
                          <LuCircleCheck size={11} /> {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {result.improvements?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {result.improvements.map((s, j) => (
                        <span key={j} className="flex items-center gap-1 text-xs bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-full">
                          <LuCircleX size={11} /> {s}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2">
                    <p className="text-xs font-semibold text-indigo-600 mb-1 flex items-center gap-1"><LuSparkles size={11} /> Ideal Answer</p>
                    <p className="text-xs text-indigo-800">{result.idealAnswer}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/interview-prep/${sessionId}`)}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-2xl font-semibold text-sm transition"
          >
            <LuArrowLeft size={16} /> Back to Session
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => { setResults([]); setCurrentIndex(0); setUserAnswer(""); setTimeLeft(TIME_PER_QUESTION); setIsFinished(false); setStarted(false); }}
            className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-2xl font-semibold text-sm transition shadow-md shadow-orange-100"
          >
            <LuRefreshCw size={16} /> Retry Interview
          </motion.button>
        </div>
      </div>
    </DashboardLayout>
  );

  // Question Screen
  const current = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Progress */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-gray-500">Question {currentIndex + 1} of {questions.length}</span>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold ${timerBg} ${timerColor}`}>
            <LuTimer size={14} />
            {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
          </div>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
          <motion.div
            className="h-2 bg-orange-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-6 py-5 border-b border-orange-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <LuBrain className="text-white" size={15} />
                </div>
                <p className="text-base font-semibold text-gray-900 leading-snug">{current?.question}</p>
              </div>
            </div>

            <div className="px-6 py-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-500">Your Answer</label>
                {isMicSupported ? (
                  isMicListening ? (
                    <motion.button
                      type="button"
                      onClick={stopMic}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-red-500 text-white border border-red-400 shadow-md shadow-red-200/50 transition-all"
                    >
                      <span className="relative flex w-2.5 h-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                      </span>
                      Stop Recording
                    </motion.button>
                  ) : (
                    <motion.button
                      type="button"
                      onClick={startMic}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border bg-gray-50 border-gray-200 text-gray-500 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600"
                    >
                      <LuMic size={14} />
                      Voice
                    </motion.button>
                  )
                ) : (
                  <span className="text-[10px] text-gray-300 italic">Voice input not supported in this browser</span>
                )}
              </div>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type or speak your answer here..."
                rows={6}
                disabled={isEvaluating}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent resize-none transition disabled:opacity-50 disabled:bg-gray-50"
              />
              {isMicListening && (
                <div className="mt-2 flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex w-3 h-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                    </span>
                    <span className="text-sm font-medium text-red-600">Recording...</span>
                  </div>
                  <motion.button
                    type="button"
                    onClick={stopMic}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-all border border-red-200"
                  >
                    <LuMicOff size={12} />
                    Stop
                  </motion.button>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSubmitAnswer(false)}
                disabled={isEvaluating}
                className="w-full mt-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-orange-100 transition flex items-center justify-center gap-2"
              >
                {isEvaluating ? (
                  <><SpinnerLoader /> Evaluating with AI...</>
                ) : (
                  <>{currentIndex + 1 === questions.length ? "Finish Interview" : "Submit & Next"} <LuChevronRight /></>
                )}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        <p className="text-center text-xs text-gray-400 mt-4">
          <LuTrendingUp className="inline mr-1" size={11} />
          Answer will be auto-submitted when timer runs out
        </p>
      </div>
    </DashboardLayout>
  );
};

export default MockInterview;
