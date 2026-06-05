import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuPlus, LuBrain, LuTarget, LuZap, LuTrendingUp } from 'react-icons/lu';
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


const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 6 + 3,
  left: Math.random() * 100,
  delay: Math.random() * 6,
  duration: Math.random() * 8 + 6,
  opacity: Math.random() * 0.4 + 0.1,
}));

const Dashboard = () => {
  const navigate = useNavigate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

const fetchAllSessions = async () => {
  try {
    setLoading(true);
    const response = await axiosInstance.get(
      API_PATHS.SESSION.GET_ALL
    );

    setSessions(response.data);
  } catch (error) {
    console.error("Error fetching session data:", error);
  } finally {
    setLoading(false);
  }
};
  const deleteSession = async (sessionData) => {
  try {
    await axiosInstance.delete(
      API_PATHS.SESSION.DELETE(sessionData?._id)
    );

    toast.success("Session Deleted Successfully");

    setOpenDeleteAlert({
      open: false,
      data: null,
    });

    fetchAllSessions();
  } catch (error) {
    console.error("Error deleting session data:", error);
  }
};

  useEffect(() => {
    fetchAllSessions();
    setTimeout(() => setVisible(true), 100);
  }, []);

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
    @keyframes cardIn {
      from { opacity: 0; transform: translateY(40px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes bounce-dot {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
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
    .card-animated { animation: cardIn 0.5s ease forwards; opacity: 0; }
    .fab-pulse { animation: pulse-glow 2s ease-in-out infinite; }
    .stat-card {
      backdrop-filter: blur(12px);
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.15);
    }
  `}</style>

  <div className="hero-gradient relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none">
      {PARTICLES.map(p => (
        <div
          key={p.id}
          className="particle absolute rounded-full bg-orange-400"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            bottom: 0,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>

    <div className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />
    <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

    <div className="relative z-10 container mx-auto px-6 py-14 text-center">
      <div
        className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-orange-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5"
        style={{ animation: visible ? 'fadeSlideDown 0.6s ease forwards' : 'none', opacity: 0 }}
      >
        <LuZap className="text-sm" /> AI-Powered Interview Preparation
      </div>

      <h1
        className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight"
        style={{ animation: visible ? 'fadeSlideUp 0.7s 0.1s ease forwards' : 'none', opacity: 0 }}
      >
        Ace Your Next{' '}
        <span className="shimmer-text">Interview</span>
      </h1>

      <p
        className="text-gray-300 text-base max-w-xl mx-auto mb-8"
        style={{ animation: visible ? 'fadeSlideUp 0.7s 0.2s ease forwards' : 'none', opacity: 0 }}
      >
        Create personalized prep sessions, practice with AI-generated Q&amp;As, and track your progress — all in one place.
      </p>

      <div
        className="flex flex-wrap justify-center gap-4 mb-8"
        style={{ animation: visible ? 'fadeSlideUp 0.7s 0.3s ease forwards' : 'none', opacity: 0 }}
      >
        {[
          { icon: <LuBrain />, label: 'Sessions', value: sessions.length },
          { icon: <LuTarget />, label: 'Questions', value: sessions.reduce((a, s) => a + (s.questions?.length || 0), 0) },
          { icon: <LuTrendingUp />, label: 'Roles Covered', value: new Set(sessions.map(s => s.role)).size },
        ].map((stat, i) => (
          <div key={i} className="stat-card rounded-2xl px-6 py-3 flex items-center gap-3 text-white">
            <span className="text-orange-400 text-xl">{stat.icon}</span>
            <div className="text-left">
              <div className="text-xl font-bold">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="fab-pulse inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white px-7 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95"
        style={{ animation: visible ? 'fadeSlideUp 0.7s 0.4s ease forwards' : 'none', opacity: 0 }}
        onClick={() => setOpenCreateModal(true)}
      >
        <LuPlus className="text-lg" /> Start New Session
      </button>
    </div>
  </div>

  <div className="container mx-auto px-6 py-8">
    {loading ? (
      <div className="flex items-center justify-center py-20">
        <SpinnerLoader />
      </div>
    ) : sessions.length === 0 ? (
      <div className="text-center py-20" style={{ animation: 'fadeSlideUp 0.6s ease forwards' }}>
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No sessions yet</h3>
        <p className="text-gray-400 text-sm">Create your first session to start practicing</p>
      </div>
    ) : (
      <>
        <h2 className="text-lg font-semibold text-gray-700 mb-5" style={{ animation: 'fadeSlideUp 0.5s ease forwards' }}>
          Your Sessions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions?.map((data, index) => (
            <div
              key={data?._id}
              className="card-animated"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <SummaryCard
                colors={CARD_BG[index % CARD_BG.length]}
                role={data?.role || ""}
                topicsToFocus={data?.topicsToFocus || ""}
                experience={data?.experience || "-"}
                questions={data?.questions?.length || 0}
                doneCount={data?.questions?.filter(q => q.isDone)?.length || 0}
                description={data?.description || ""}
                lastUpdated={
                  data?.updatedAt
                    ? moment(data.updatedAt).format("Do MMM YYYY")
                    : ""
                }
                onSelect={() => navigate(`/interview-prep/${data?._id}`)}
                onDelete={() => setOpenDeleteAlert({ open: true, data })}
              />
            </div>
          ))}
        </div>
      </>
    )}

    <button
      className="fab-pulse flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all active:scale-95 shadow-lg fixed bottom-8 right-8"
      onClick={() => setOpenCreateModal(true)}
    >
      <LuPlus className="text-lg" />
      Add New
    </button>
  </div>
  <Modal
  isOpen={openCreateModal}
  onClose={() => {
    setOpenCreateModal(false);
  }}
  hideHeader
>
  <div>
    <CreateSessionForm />
  </div>
</Modal>

<Modal
  isOpen={openDeleteAlert?.open}
  onClose={() =>
    setOpenDeleteAlert({ open: false, data: null })
  }
  hideHeader
>
  <div>
    <DeleteAlertContent
      content="Are you sure you want to delete this session detail?"
      onDelete={() => deleteSession(openDeleteAlert.data)}
      onCancel={() => setOpenDeleteAlert({ open: false, data: null })}
    />
  </div>
</Modal>
</DashboardLayout>
  );
};

export default Dashboard;