import React, { useEffect, useState } from "react";
import { LuBriefcase, LuClock, LuMessageSquare, LuZap, LuStar } from "react-icons/lu";

const RoleInfoHeader = ({ role, topicsToFocus, experience, questions, description, lastUpdated }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  const stats = [
    { icon: <LuBriefcase size={13} />, label: `${experience} ${experience == 1 ? "Year" : "Years"} Exp` },
    { icon: <LuMessageSquare size={13} />, label: `${questions} Q&A` },
    { icon: <LuClock size={13} />, label: lastUpdated },
  ];

  return (
    <div className="relative overflow-hidden">
      <style>{`
        @keyframes heroBg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-18px) scale(1.05); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes badgeSlide {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes statPop {
          from { opacity: 0; transform: scale(0.85) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .rih-bg {
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 35%, #312e81 60%, #1e1b4b 100%);
          background-size: 300% 300%;
          animation: heroBg 10s ease infinite;
        }
        .orb1 { animation: floatOrb 7s ease-in-out infinite; }
        .orb2 { animation: floatOrb 9s ease-in-out infinite 1.5s; }
        .orb3 { animation: floatOrb 6s ease-in-out infinite 0.8s; }
        .glow-line { animation: glowPulse 3s ease-in-out infinite; }
      `}</style>

      <div className="rih-bg px-6 md:px-12 py-10 relative">
        <div className="orb1 absolute top-[-60px] right-[-60px] w-72 h-72 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
        <div className="orb2 absolute bottom-[-40px] left-[-40px] w-56 h-56 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="orb3 absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-orange-400/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div
            className="inline-flex items-center gap-1.5 bg-orange-400/20 border border-orange-400/40 text-orange-300 text-xs font-semibold px-3 py-1 rounded-full mb-4"
            style={{ animation: visible ? "badgeSlide 0.5s ease forwards" : "none", opacity: 0 }}
          >
            <LuZap size={11} />
            AI Interview Session
          </div>

          <h1
            className="text-3xl md:text-4xl font-extrabold text-white mb-2 leading-tight tracking-tight"
            style={{ animation: visible ? "fadeUp 0.55s 0.1s ease forwards" : "none", opacity: 0 }}
          >
            {role}
          </h1>

          <div
            className="flex items-center gap-2 mb-6"
            style={{ animation: visible ? "fadeUp 0.55s 0.2s ease forwards" : "none", opacity: 0 }}
          >
            <LuStar size={12} className="text-orange-400" />
            <p className="text-sm text-indigo-300 font-medium">{topicsToFocus}</p>
          </div>

          <div className="flex flex-wrap gap-3 mb-4">
            {stats.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 text-white/85 text-xs font-medium px-4 py-2 rounded-xl"
                style={{ animation: visible ? `statPop 0.45s ${0.3 + i * 0.08}s ease forwards` : "none", opacity: 0 }}
              >
                <span className="text-orange-400">{s.icon}</span>
                {s.label}
              </div>
            ))}
          </div>

          {description && (
            <p
              className="text-sm text-white/60 leading-relaxed max-w-2xl"
              style={{ animation: visible ? "fadeUp 0.55s 0.55s ease forwards" : "none", opacity: 0 }}
            >
              {description}
            </p>
          )}
        </div>

        <div className="glow-line absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />
      </div>
    </div>
  );
};

export default RoleInfoHeader;
