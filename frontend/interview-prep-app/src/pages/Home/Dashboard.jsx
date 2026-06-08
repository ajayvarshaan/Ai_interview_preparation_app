import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuPlus, LuBrain, LuTarget, LuZap, LuTrendingUp, LuSparkles, LuRocket, LuStar, LuClock, LuCheck, LuBookOpen, LuAward } from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CARD_BG } from '../../utils/data';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/Layouts/DashboardLayout';
import SummaryCard from '../../components/Cards/SummaryCard';
import moment from 'moment'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import Modal from '../../components/Model';
import CreateSessionForm from './CreateSessionForm';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';
import DeleteAlertContent from '../../components/DeleteAlertContent';

gsap.registerPlugin(ScrollTrigger);

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: Math.random() * 6 + 2,
  left: Math.random() * 100,
  delay: Math.random() * 6,
  duration: Math.random() * 10 + 6,
  opacity: Math.random() * 0.4 + 0.1,
}));

const QUICK_ACTIONS = [
  { label: 'New Session', icon: LuPlus, gradient: 'from-orange-500 to-orange-400', action: 'create' },
  { label: 'Resume Recent', icon: LuClock, gradient: 'from-purple-500 to-purple-400', action: 'resume' },
  { label: 'Stats', icon: LuTrendingUp, gradient: 'from-blue-500 to-blue-400', action: 'stats' },
];

const GSAPReveal = ({ children, className, delay = 0 }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [delay]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
};

const GSAPStaggerContainer = ({ children, className, stagger = 0.08 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const items = el.children;
    gsap.fromTo(
      items,
      { opacity: 0, y: 40, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [stagger]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

const AnimatedStatCard = ({ icon, label, value, color = "text-orange-400" }) => (
  <div className="stat-card rounded-2xl px-5 py-3.5 flex items-center gap-3 text-white backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all group">
    <span className={`${color} text-xl group-hover:scale-110 transition-transform`}>
      {icon}
    </span>
    <div className="text-left">
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">{label}</div>
    </div>
  </div>
);

const ProgressDonut = ({ percent, size = 160, stroke = 12, label, detail }) => {
  const safePercent = Math.max(0, Math.min(100, percent));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (safePercent / 100) * circumference;

  const ringRef = useRef(null);
  const countRef = useRef(null);

  useEffect(() => {
    if (!ringRef.current) return;
    const el = ringRef.current;
    gsap.fromTo(
      el,
      { strokeDashoffset: circumference },
      {
        strokeDashoffset: dashOffset,
        duration: 1.4,
        ease: "power2.out",
      }
    );

    if (countRef.current) {
      const start = 0;
      const end = safePercent;
      gsap.fromTo(
        countRef.current,
        { textContent: start.toString() },
        {
          textContent: end.toString(),
          duration: 1.2,
          ease: "power2.out",
          snap: { textContent: 1 },
          onUpdate: () => {
            // nothing: gsap updates textContent
          },
        }
      );
    }
  }, [safePercent, dashOffset, circumference]);

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="block" style={{ overflow: 'visible' }}>

        <defs>
          <linearGradient id="progress-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={stroke}
        />

        {/* Animated ring */}
        <circle
          ref={ringRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="url(#progress-gradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          filter="url(#glow)"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-extrabold text-gray-900">
          <span ref={countRef}>{Math.round(safePercent)}</span>
          <span className="text-base font-bold text-gray-700">%</span>
        </div>
        <div className="text-xs text-gray-600 mt-1">{label}</div>
        {detail ? <div className="text-[11px] text-gray-500 mt-2 text-center px-3">{detail}</div> : null}
      </div>
    </div>
  );
};

const StackedProgressBar = ({ done, total }) => {
  const safeTotal = Math.max(0, total);
  const safeDone = Math.max(0, Math.min(safeTotal, done));
  const remaining = Math.max(0, safeTotal - safeDone);

  const donePct = safeTotal > 0 ? (safeDone / safeTotal) * 100 : 0;
  const remainingPct = 100 - donePct;

  const doneFillRef = useRef(null);

  useEffect(() => {
    if (!doneFillRef.current) return;
    gsap.fromTo(
      doneFillRef.current,
      { width: "0%" },
      { width: `${donePct}%`, duration: 1.2, ease: "power2.out" }
    );
  }, [donePct]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="text-gray-600">Completed</span>
        <span className="font-semibold text-gray-900">
          {safeDone}/{safeTotal}
        </span>
      </div>

      <div className="h-3.5 rounded-full bg-gray-100 border border-gray-200 overflow-hidden">
        <div
          ref={doneFillRef}
          className="h-full rounded-full bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500"
          style={{ width: "0%" }}
        />
        {/* Remaining overlay */}
        <div
          className="-mt-3.5 h-3.5 bg-gray-200/70 border-t border-gray-200"
          style={{ width: `${remainingPct}%`, marginLeft: `${donePct}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] mt-2">
        <span className="text-gray-500">Remaining</span>
        <span className="text-gray-700">{remaining}</span>
      </div>
    </div>
  );
};


const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded-full w-1/2" />
            </div>
          </div>
          <div className="h-3 bg-gray-200 rounded-full w-full mb-3" />
          <div className="h-3 bg-gray-200 rounded-full w-2/3 mb-3" />
          <div className="h-2 bg-gray-200 rounded-full w-full" />
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = ({ onCreate }) => (
  <div className="text-center py-20">
    <div className="text-7xl mb-6 inline-block" ref={el => el && gsap.fromTo(el, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 1, ease: "back.out(2)" })}>🎯</div>
    <h3 className="text-xl font-semibold text-gray-700 mb-2">No sessions yet</h3>
    <p className="text-gray-400 text-sm mb-6">Create your first session to start practicing</p>
    <button
      onClick={onCreate}
      className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white px-6 py-2.5 rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-all"
    >
      <LuPlus className="text-lg" /> Create First Session
    </button>
  </div>
);

const HeroProgressBar = ({ done, total }) => {
  const ref = useRef(null);
  const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(ref.current, { width: "0%" }, { width: `${percentage}%`, duration: 1.5, ease: "power2.out", delay: 0.8 });
    }
  }, [percentage]);

  return (
    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
      <div ref={ref} className="h-full rounded-full bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500" style={{ width: "0%" }} />
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const statsRef = useRef(null);
  const headingRef = useRef(null);
  const heroImageRef = useRef(null);
  const sessionsGridRef = useRef(null);

  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  const fetchAllSessions = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching session data:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionData) => {
    try {
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionData?._id));
      toast.success("Session Deleted Successfully");
      setOpenDeleteAlert({ open: false, data: null });
      fetchAllSessions();
    } catch (error) {
      console.error("Error deleting session data:", error);
    }
  };

  useEffect(() => {
    fetchAllSessions();
    setTimeout(() => setVisible(true), 100);
  }, []);

  // GSAP animations on mount
  useEffect(() => {
    if (!visible) return;

    // Heading word stagger
    if (headingRef.current) {
      const words = headingRef.current.querySelectorAll('.gsap-word');
      gsap.fromTo(
        words,
        { opacity: 0, y: 40, rotateX: -90 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "back.out(1.7)",
          delay: 0.3,
        }
      );
    }

    // Hero image float
    if (heroImageRef.current) {
      gsap.to(heroImageRef.current, {
        y: -12,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 1,
      });
    }

    // Sessions grid stagger
    if (sessionsGridRef.current && sessionsGridRef.current.children.length > 0) {
      gsap.fromTo(
        sessionsGridRef.current.children,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: sessionsGridRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // FAB entrance
    gsap.fromTo(".fab-button", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, delay: 1.5, ease: "back.out(2)" });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [visible, sessions.length]);

  const totalQuestions = sessions.reduce((a, s) => a + (s.questions?.length || 0), 0);
  const doneQuestions = sessions.reduce((a, s) => a + (s.questions?.filter(q => q.isDone)?.length || 0), 0);
  const rolesCovered = new Set(sessions.map(s => s.role)).size;
  const completionRate = totalQuestions > 0 ? Math.round((doneQuestions / totalQuestions) * 100) : 0;

  const handleQuickAction = (action) => {
    if (action === 'create') {
      setOpenCreateModal(true);
    } else if (action === 'resume') {
      if (sessions.length > 0) {
        navigate(`/interview-prep/${sessions[0]._id}`);
      } else {
        setOpenCreateModal(true);
      }
    } else {
      statsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
   <DashboardLayout>
  <style>{`
    @keyframes floatUp {
      0% { transform: translateY(100vh) scale(0); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 0.3; }
      100% { transform: translateY(-10vh) scale(1); opacity: 0; }
    }
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeSlideDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 20px rgba(249,115,22,0.3); }
      50% { box-shadow: 0 0 40px rgba(249,115,22,0.6), 0 0 60px rgba(249,115,22,0.2); }
    }
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .particle { animation: floatUp linear infinite; }
    .hero-gradient {
      background: linear-gradient(135deg, #1a0533 0%, #2d1b69 30%, #0f172a 60%, #1e1b4b 100%);
      background-size: 400% 400%;
      animation: gradientShift 8s ease infinite;
    }
    .shimmer-text {
      background: linear-gradient(90deg, #f97316, #fbbf24, #f97316, #fb923c);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 3s linear infinite;
    }
    .fab-pulse { animation: pulse-glow 2s ease-in-out infinite; }
    .stat-card {
      backdrop-filter: blur(12px);
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.15);
    }
  `}</style>

  {/* HERO SECTION */}
  <div className="hero-gradient relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none">
      {PARTICLES.map(p => (
        <div
          key={p.id}
          className="particle absolute rounded-full bg-gradient-to-b from-orange-400 to-orange-600"
          style={{
            width: p.size, height: p.size, left: `${p.left}%`, bottom: 0,
            opacity: p.opacity, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>

    <div className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full bg-orange-500/15 blur-3xl pointer-events-none" />
    <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

    {/* Floating decorative icons with GSAP */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[
        { Icon: LuSparkles, color: "text-orange-300/30", left: "15%", top: "15%", d: 4, s: 16 },
        { Icon: LuBrain, color: "text-purple-300/30", left: "75%", top: "25%", d: 5, s: 18 },
        { Icon: LuStar, color: "text-yellow-300/30", left: "40%", top: "10%", d: 3.5, s: 12 },
        { Icon: LuRocket, color: "text-orange-400/30", left: "85%", top: "70%", d: 6, s: 14 },
        { Icon: LuZap, color: "text-yellow-200/30", left: "10%", top: "80%", d: 4.5, s: 10 },
      ].map((item, i) => {
        const iconRef = useRef(null);
        useEffect(() => {
          if (iconRef.current) {
            gsap.to(iconRef.current, {
              y: -20, opacity: 0.6, duration: item.d, repeat: -1, yoyo: true, ease: "power1.inOut", delay: i * 0.8,
            });
          }
        }, []);
        return (
          <div key={i} ref={iconRef} className={`absolute ${item.color}`} style={{ left: item.left, top: item.top, opacity: 0.3 }}>
            <item.Icon size={item.s} />
          </div>
        );
      })}
    </div>

    <div className="relative z-10 container mx-auto px-6 py-16 text-center">
      {/* Badge */}
      <div
        ref={el => el && visible && gsap.fromTo(el, { opacity: 0, y: -20, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" })}
        className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-orange-300 text-xs font-semibold px-5 py-2 rounded-full mb-6 shadow-lg"
      >
        <LuZap className="text-sm" />
        AI-Powered Interview Preparation
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      </div>

      {/* Heading with GSAP word animation */}
      <h1 ref={headingRef} className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
        {"Ace Your Next Interview".split(" ").map((word, i) => (
          <span key={i} className="gsap-word inline-block mr-[0.3em]" style={{ opacity: 0 }}>
            {word}
          </span>
        ))}
      </h1>

      {/* Subtitle */}
      <p className="text-gray-300/80 text-base max-w-2xl mx-auto mb-8 leading-relaxed"
        ref={el => el && visible && gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.8 })}>
        Create personalized prep sessions, practice with AI-generated Q&As, and track your progress — all in one place.
      </p>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-8"
        ref={el => el && visible && gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 1 })}>
        {QUICK_ACTIONS.map((action, i) => (
          <button
            key={i}
            onClick={() => handleQuickAction(action.action)}
            className={`flex items-center gap-2 bg-gradient-to-r ${action.gradient} text-white px-5 py-2.5 rounded-xl font-medium text-sm shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all`}
          >
            <action.icon className="text-base" />
            {action.label}
          </button>
        ))}
      </div>

      {/* Stats Cards with GSAP stagger */}
      <div className="flex flex-wrap justify-center gap-4"
        ref={el => el && visible && gsap.fromTo(
          el.children,
          { opacity: 0, y: 30, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)", delay: 1.2 }
        )}>
        <AnimatedStatCard icon={<LuBrain />} label="Total Sessions" value={sessions.length} />
        <AnimatedStatCard icon={<LuTarget />} label="Questions" value={totalQuestions} />
        <AnimatedStatCard icon={<LuTrendingUp />} label="Roles Covered" value={rolesCovered} />
        <AnimatedStatCard icon={<LuCheck />} label="Completed" value={`${doneQuestions}/${totalQuestions}`} color="text-green-400" />
      </div>

      {/* Hero Progress */}
      {totalQuestions > 0 && (
        <div className="mt-6 max-w-md mx-auto">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-orange-300 font-medium">Overall Progress</span>
            <span className="text-white font-bold">{completionRate}%</span>
          </div>
          <HeroProgressBar done={doneQuestions} total={totalQuestions} />
          <p className="text-xs text-gray-400 mt-1 text-right">{doneQuestions} of {totalQuestions} questions completed</p>
        </div>
      )}
    </div>
  </div>

  {/* SESSIONS SECTION */}
  <div className="container mx-auto px-6 py-8">
    {loading ? (
      <div>
        <div className="flex justify-center py-8">
          <SpinnerLoader />
        </div>
        <LoadingSkeleton />
      </div>
    ) : sessions.length === 0 ? (
      <EmptyState onCreate={() => setOpenCreateModal(true)} />
    ) : (
      <>
        <GSAPReveal>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Your Sessions</h2>
              <p className="text-xs text-gray-400 mt-1">
                {sessions.length} session{sessions.length !== 1 ? 's' : ''} • {completionRate}% complete
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-orange-500 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
              <LuAward className="text-sm" />
              {doneQuestions} questions mastered
            </div>
          </div>
        </GSAPReveal>

        <GSAPStaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions?.map((data, index) => (
            <div key={data?._id}>
              <SummaryCard
                colors={CARD_BG[index % CARD_BG.length]}
                role={data?.role || ""}
                topicsToFocus={data?.topicsToFocus || ""}
                experience={data?.experience || "-"}
                questions={data?.questions?.length || 0}
                doneCount={data?.questions?.filter(q => q.isDone)?.length || 0}
                description={data?.description || ""}
                lastUpdated={data?.updatedAt ? moment(data.updatedAt).format("Do MMM YYYY") : ""}
                onSelect={() => navigate(`/interview-prep/${data?._id}`)}
                onDelete={() => setOpenDeleteAlert({ open: true, data })}
              />
            </div>
          ))}
        </GSAPStaggerContainer>

        {/* Summary Section with GSAP */}
        <GSAPReveal delay={0.2}>
          <div
            ref={statsRef}
            className="mt-12 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-100 relative overflow-hidden"
          >
            <div
              className="absolute inset-0 opacity-60 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 20% 20%, rgba(249,115,22,0.35), transparent 45%), radial-gradient(circle at 80% 60%, rgba(245,158,11,0.25), transparent 50%)",
              }}
            />
            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="text-orange-500"><LuAward /></span>
              Your Progress Summary
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs text-gray-500">Progress complete</div>
                    <div className="text-2xl font-extrabold text-gray-900">
                      {completionRate}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {doneQuestions} of {totalQuestions} questions completed
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 border border-orange-100">
                      <LuCheck className="text-orange-500" />
                      <span className="text-xs font-semibold text-orange-700">{doneQuestions} done</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="flex justify-center">
                    <ProgressDonut
                      percent={completionRate}
                      label="Completed"
                      detail={totalQuestions > 0 ? `${doneQuestions}/${totalQuestions}` : "0/0"}
                    />
                  </div>

                  <div>
                    <StackedProgressBar done={doneQuestions} total={totalQuestions} />
                    <div className="mt-3 flex flex-wrap gap-2">
                      <div className="inline-flex items-center gap-2 text-[11px] bg-gray-100/70 rounded-full px-3 py-1.5 border border-gray-200">
                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500" />
                        Completed
                      </div>
                      <div className="inline-flex items-center gap-2 text-[11px] bg-gray-100/70 rounded-full px-3 py-1.5 border border-gray-200">
                        <span className="w-2 h-2 rounded-full bg-gray-300" />
                        Remaining
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                  {[
                    { label: "Sessions", value: sessions.length, icon: LuBookOpen },
                    { label: "Questions", value: totalQuestions, icon: LuBrain },
                    { label: "Completed", value: doneQuestions, icon: LuCheck },
                    { label: "Roles", value: rolesCovered, icon: LuTarget },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="relative overflow-hidden bg-white/75 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-all group border border-white/60"
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background:
                            "radial-gradient(circle at 30% 20%, rgba(249,115,22,0.22), transparent 55%), radial-gradient(circle at 80% 80%, rgba(245,158,11,0.18), transparent 55%)",
                        }}
                      />

                      <div className="relative">
                        <div className="flex items-center justify-center mb-1">
                          <stat.icon className="text-orange-500 text-lg mx-auto group-hover:scale-110 group-hover:rotate-6 transition-transform" />
                        </div>
                        <div className="text-xl font-extrabold text-gray-800 tracking-tight">
                          {stat.value}
                        </div>
                        <div className="text-xs text-gray-400">{stat.label}</div>
                      </div>

                      <div className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-orange-400/10 blur-2xl" />
                    </div>
                  ))}
                </div>

                <div className="mt-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-gray-800">Next milestone</div>
                    <div className="text-xs text-gray-500">Based on your completion</div>
                  </div>
                  <div className="mt-3 text-xs text-gray-600">
                    {totalQuestions > 0
                      ? (completionRate >= 100
                        ? 'You’ve completed everything 🎉'
                        : `Aim for ${Math.min(100, Math.ceil(completionRate / 10) * 10 + 10)}% next`)
                      : 'Create a session to start tracking progress.'}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </GSAPReveal>
      </>
    )}

    {/* FAB Button */}
    <button
      className="fab-button fab-pulse flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all active:scale-95 shadow-lg fixed bottom-8 right-8 z-30"
      onClick={() => setOpenCreateModal(true)}
    >
      <LuPlus className="text-lg" />
      Add New
    </button>
  </div>

  {/* Create Session Modal */}
  <AnimatePresence>
    {openCreateModal && (
      <Modal isOpen={openCreateModal} onClose={() => setOpenCreateModal(false)} hideHeader>
        <div>
          <CreateSessionForm />
        </div>
      </Modal>
    )}
  </AnimatePresence>

  {/* Delete Confirmation Modal */}
  <AnimatePresence>
    {openDeleteAlert?.open && (
      <Modal isOpen={openDeleteAlert?.open} onClose={() => setOpenDeleteAlert({ open: false, data: null })} hideHeader>
        <div>
          <DeleteAlertContent
            content="Are you sure you want to delete this session detail?"
            onDelete={() => deleteSession(openDeleteAlert.data)}
            onCancel={() => setOpenDeleteAlert({ open: false, data: null })}
          />
        </div>
      </Modal>
    )}
  </AnimatePresence>
</DashboardLayout>
  );
};

export default Dashboard;