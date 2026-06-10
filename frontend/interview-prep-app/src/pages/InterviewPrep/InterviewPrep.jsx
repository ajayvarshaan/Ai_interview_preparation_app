import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import {
  LuCircleAlert, LuSparkles, LuX, LuBrain,
  LuZap, LuSwords, LuDownload,
  LuSearch, LuFilter, LuLightbulb,
  LuArrowRight, LuCheck,
} from "react-icons/lu";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

gsap.registerPlugin(ScrollTrigger);

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
  const [filter, setFilter] = useState("all");


  const pageRef = useRef(null);
  const headerRef = useRef(null);
  const progressRef = useRef(null);
  const progressBarRef = useRef(null);
  const controlsRef = useRef(null);
  const questionsContainerRef = useRef(null);
  const floatingElementsRef = useRef(null);

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
    
        gsap.fromTo(
          questionsContainerRef.current?.children,
          { opacity: 0, y: 30, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: "back.out(1.7)" }
        );
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


  useGSAP(() => {
    if (!sessionData) return;

    const mm = gsap.matchMedia();


    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      headerRef.current?.querySelectorAll(".anim-header > *"),
      { opacity: 0, y: 30, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)" }
    );


    tl.fromTo(
      progressRef.current,
      { opacity: 0, y: 20, scaleX: 0.95 },
      { opacity: 1, y: 0, scaleX: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" },
      "-=0.2"
    );


    if (progressBarRef.current) {
      tl.fromTo(
        progressBarRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 1.2, ease: "power4.out" },
        "-=0.3"
      );
    }

   
    tl.fromTo(
      controlsRef.current?.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" },
      "-=0.3"
    );

    if (floatingElementsRef.current) {
      const orbs = floatingElementsRef.current.querySelectorAll(".floating-orb");
      orbs.forEach((orb, i) => {
        gsap.to(orb, {
          x: gsap.utils.random(-30, 30),
          y: gsap.utils.random(-20, 20),
          scale: gsap.utils.random(0.8, 1.2),
          opacity: gsap.utils.random(0.15, 0.35),
          duration: gsap.utils.random(4, 7),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.3,
        });
      });
    }

  
    gsap.to(".panel-border-glow", {
      backgroundPosition: "200% 0",
      duration: 6,
      repeat: -1,
      ease: "linear",
    });

    gsap.to(".cta-glow-btn", {
      boxShadow: "0 0 30px rgba(99,102,241,0.5), 0 0 60px rgba(139,92,246,0.2)",
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });


    const statNumbers = document.querySelectorAll(".stat-number");
    statNumbers.forEach((el) => {
      const finalVal = parseInt(el.dataset.value) || 0;
      gsap.fromTo(
        el,
        { textContent: 0 },
        {
          textContent: finalVal,
          duration: 1.5,
          ease: "power2.out",
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
          },
        }
      );
    });

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, { dependencies: [sessionData], scope: pageRef });

  const totalQ = sessionData?.questions?.length || 0;
  const pinnedQ = sessionData?.questions?.filter((q) => q.isPinned)?.length || 0;
  const doneQ = sessionData?.questions?.filter((q) => q.isDone)?.length || 0;

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
      <div ref={pageRef} className="relative overflow-hidden">
   
        <div
          ref={floatingElementsRef}
          className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        >
          <div className="floating-orb absolute -top-20 -left-20 w-72 h-72 rounded-full bg-gradient-to-br from-indigo-300/10 to-purple-400/5 blur-3xl" />
          <div className="floating-orb absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-violet-300/10 to-fuchsia-400/5 blur-3xl" />
          <div className="floating-orb absolute -bottom-32 left-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-400/8 to-blue-300/5 blur-3xl" />
        </div>

        <style>{`
          @keyframes borderFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes dotBounce {
            0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
            40% { transform: scale(1); opacity: 1; }
          }
          @keyframes floatSlow {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            33% { transform: translateY(-6px) rotate(1deg); }
            66% { transform: translateY(3px) rotate(-1deg); }
          }
          @keyframes shimmerMove {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes pulseGlow {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.8; }
          }
          .dot1 { animation: dotBounce 1.4s ease-in-out infinite 0s; }
          .dot2 { animation: dotBounce 1.4s ease-in-out infinite 0.2s; }
          .dot3 { animation: dotBounce 1.4s ease-in-out infinite 0.4s; }

          .page-bg {
            background: linear-gradient(180deg, #f8faff 0%, #f1f5ff 40%, #f8f8ff 100%);
            background-attachment: fixed;
          }

          .panel-border-glow {
            background: linear-gradient(90deg, #6366f1, #a78bfa, #6366f1);
            background-size: 200% 100%;
          }

          .glass-panel {
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
          }

          .btn-magnetic {
            transition: transform 0.2s cubic-bezier(0.23, 1, 0.32, 1);
          }

          .progress-gradient {
            background: linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa, #8b5cf6, #6366f1);
            background-size: 300% 100%;
          }

          .scroll-indicator {
            animation: floatSlow 3s ease-in-out infinite;
          }

          .card-hover-glow {
            position: relative;
            transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          }
          .card-hover-glow::before {
            content: '';
            position: absolute;
            inset: -2px;
            border-radius: inherit;
            background: linear-gradient(135deg, #6366f1, #a78bfa, #6366f1);
            background-size: 200% 200%;
            opacity: 0;
            transition: opacity 0.4s ease;
            z-index: -1;
            animation: borderFlow 3s ease infinite;
          }
          .card-hover-glow:hover::before {
            opacity: 0.5;
          }
          .card-hover-glow:hover {
            transform: translateY(-3px) scale(1.01);
            box-shadow: 0 20px 40px -12px rgba(99, 102, 241, 0.25);
          }

          @media (prefers-reduced-motion: reduce) {
            .floating-orb { display: none; }
            .card-hover-glow:hover { transform: none; }
          }
        `}</style>

        <div
          className="pointer-events-none fixed inset-0 z-[1] opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E\")",
          }}
        />

        <RoleInfoHeader
          role={sessionData?.role || ""}
          topicsToFocus={sessionData?.topicsToFocus || ""}
          experience={sessionData?.experience || "-"}
          questions={totalQ}
          description={sessionData?.description || ""}
          lastUpdated={sessionData?.updatedAt ? moment(sessionData.updatedAt).format("Do MMM YYYY") : ""}
        />

        <div className="page-bg min-h-screen px-4 md:px-8 py-7 relative z-10">

    
          <div ref={headerRef} className="anim-header">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3 group">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200/50 group-hover:shadow-xl group-hover:shadow-indigo-300/40 transition-all duration-300"
                >
                  <LuBrain className="text-white" size={20} />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center">
                    <LuSparkles size={8} className="text-amber-900" />
                  </div>
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 leading-tight flex items-center gap-2">
                    Interview Q & A
                    <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-indigo-100 text-indigo-600 rounded-full">
                      {totalQ} Q
                    </span>
                  </h2>
                  <div className="flex items-center gap-3 mt-0.5">
                    <p className="text-xs text-gray-400">
                      <span className="stat-number font-semibold text-indigo-500" data-value={totalQ}>{totalQ}</span> questions
                    </p>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <p className="text-xs text-gray-400">
                      <span className="font-semibold text-amber-500">{pinnedQ}</span> pinned
                    </p>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <p className="text-xs text-green-500 font-medium">{doneQ} done</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => exportSessionToPDF(sessionData)}
                  className="card-hover-glow flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl shadow-sm border border-gray-200 transition-all overflow-hidden"
                >
                  <LuDownload size={14} className="text-orange-500" />
                  <span className="hidden sm:inline">Export PDF</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/mock-interview/${sessionId}`)}
                  className="btn-magnetic flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-orange-200/60 transition-all"
                >
                  <LuSwords size={15} />
                  <span>Mock Interview</span>
                  <LuArrowRight size={14} className="hidden sm:block" />
                </motion.button>
              </div>
            </div>
          </div>

    
          <div ref={progressRef}>
            <div className="mb-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100/80 shadow-sm px-5 py-4 hover:shadow-md hover:border-indigo-100 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-indigo-400 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Session Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  {progress === 100 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-sm"
                    >
                      🎉
                    </motion.span>
                  )}
                  <span
                    className={`text-sm font-bold tabular-nums ${
                      progress === 100
                        ? "text-green-500"
                        : progress >= 50
                          ? "text-orange-500"
                          : "text-indigo-500"
                    }`}
                  >
                    {doneQ}/{totalQ} completed
                  </span>
                </div>
              </div>

              <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  ref={progressBarRef}
                  className="absolute inset-0 h-full rounded-full progress-gradient"
                  style={{
                    width: `${progress}%`,
                    transformOrigin: "left center",
                  }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.2, ease: "power4.out", delay: 0.3 }}
                />
              
                <div
                  className="absolute inset-0 h-full rounded-full opacity-30"
                  style={{
                    width: `${progress}%`,
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                    backgroundSize: "200% 100%",
                    animation: "shimmerMove 2s linear infinite",
                    pointerEvents: "none",
                  }}
                />
              
                {progress > 0 && progress < 100 && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md border-2 border-indigo-300 z-10"
                    style={{
                      left: `calc(${progress}% - 8px)`,
                      animation: "pulseGlow 2s ease-in-out infinite",
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          <div ref={controlsRef} className="mb-5 flex flex-col sm:flex-row gap-3">
    
            <div className="relative flex-1 group">
              <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={15} />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent shadow-sm transition-all duration-300 group-focus-within:shadow-md group-focus-within:shadow-indigo-100/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:scale-110 transition-all"
                >
                  <LuX size={14} />
                </button>
              )}
            </div>

        
            <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl px-2 py-1.5 shadow-sm">
              <LuFilter size={13} className="text-gray-400 ml-1" />
              {FILTERS.map((f) => (
                <motion.button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    filter === f.key
                      ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-sm shadow-indigo-200"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {f.label}
                  <span
                    className={`ml-1.5 ${
                      filter === f.key ? "text-indigo-200" : "text-gray-400"
                    }`}
                  >
                    {f.count}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          
          <div className="grid grid-cols-12 gap-6">
            <div
              className={`col-span-12 transition-all duration-500 ${
                openLearnMoreDrawer ? "lg:col-span-7" : "lg:col-span-12"
              }`}
            >
              <AnimatePresence mode="popLayout">
                {filteredQuestions.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-16"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <LuSearch size={24} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No questions found</p>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filter</p>
                  </motion.div>
                )}

                {filteredQuestions.map((data, index) => (
                  <motion.div
                    key={data._id || index}
                    layout
                    layoutId={`q-${data._id || index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{
                      duration: 0.38,
                      type: "spring",
                      stiffness: 130,
                      delay: index * 0.055,
                      damping: 18,
                    }}
                  >
                    <div className="card-hover-glow rounded-2xl bg-white">
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
                    </div>

                    {!isLoading && filteredQuestions.length === index + 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="flex flex-col items-center gap-4 mt-8 mb-6"
                      >
                        <div className="flex items-center gap-3 w-full max-w-xs">
                          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
                          <div className="scroll-indicator flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-300" />
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-300" />
                          </div>
                          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.04, y: -2 }}
                          whileTap={{ scale: 0.96 }}
                          className="cta-glow-btn flex items-center gap-2.5 px-8 py-3 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 hover:from-indigo-600 hover:via-violet-600 hover:to-purple-700 text-white font-semibold text-sm rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                          disabled={isUpdateLoader}
                          onClick={uploadMoreQuestions}
                        >
                          {isUpdateLoader ? (
                            <SpinnerLoader />
                          ) : (
                            <>
                              <LuZap className="w-4 h-4" />
                              <span>Generate More Questions</span>
                            </>
                          )}
                        </motion.button>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

  
            <AnimatePresence>
              {openLearnMoreDrawer && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="fixed inset-0 bg-black/20 z-40 lg:hidden"
                    onClick={() => setOpenLearnMoreDrawer(false)}
                  />

                  <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 30, scale: 0.96 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.23, 1, 0.32, 1],
                    }}
                    className="fixed left-0 right-0 bottom-0 z-50 lg:static lg:col-span-5 lg:z-auto"
                  >
                    <div className="sticky top-4 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-200/30 border border-indigo-100/60 bg-white/95 backdrop-blur-xl">
                      {/* Header */}
                      <div className="relative overflow-hidden">
                        <div className="panel-border-glow absolute inset-x-0 top-0 h-0.5 opacity-80" />
                        <div className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-5 py-4">
                          {/* Animated background pattern */}
                          <div className="absolute inset-0 opacity-10">
                            <div
                              className="absolute inset-0"
                              style={{
                                backgroundImage:
                                  "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)",
                              }}
                            />
                          </div>

                          <div className="relative flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <motion.div
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/10"
                              >
                                <LuSparkles className="text-white w-4 h-4" />
                              </motion.div>
                              <div>
                                <p className="text-white/60 text-xs font-medium mb-0.5 tracking-wide uppercase">
                                  AI Concept Explanation
                                </p>
                                <h2 className="text-sm font-bold text-white leading-snug line-clamp-2">
                                  {isLoading ? (
                                    <span className="flex items-center gap-1.5">
                                      <LuLightbulb size={14} className="text-amber-300" />
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
                            <motion.button
                              whileHover={{ scale: 1.1, rotate: 90 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setOpenLearnMoreDrawer(false)}
                              className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/30 flex items-center justify-center text-white/80 hover:text-white transition-all flex-shrink-0 backdrop-blur-sm"
                            >
                              <LuX size={14} />
                            </motion.button>
                          </div>

                          {isLoading && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5">
                              <div className="h-full panel-border-glow" />
                            </div>
                          )}
                        </div>
                      </div>

                    
                      <div className="bg-white/80 backdrop-blur-sm p-5 max-h-[calc(100vh-240px)] overflow-y-auto">
                        {errorMsg && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-start gap-2.5 p-3.5 mb-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700"
                          >
                            <LuCircleAlert className="mt-0.5 flex-shrink-0" size={15} />
                            <span className="font-medium">{errorMsg}</span>
                          </motion.div>
                        )}

                        {isLoading && (
                          <div className="pt-1">
                            <SkeletonLoader />
                          </div>
                        )}

                        {!isLoading && explanation && (
                          <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                          >
                            <AIResponsePreview content={explanation?.explanation} />
                          </motion.div>
                        )}

                
                        {!isLoading && explanation && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <LuCheck size={12} className="text-green-400" />
                              AI-generated explanation
                            </div>
                            <button
                              onClick={() => setOpenLearnMoreDrawer(false)}
                              className="text-xs font-medium text-indigo-500 hover:text-indigo-700 transition-colors"
                            >
                              Close
                            </button>
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
      </div>
    </DashboardLayout>
  );
};

export default InterviewPrep;