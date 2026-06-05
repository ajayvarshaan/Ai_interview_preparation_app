import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LuSparkles, LuBrain, LuBookOpen, LuPin, LuLightbulb, LuArrowRight } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import Model from "../components/Model";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import inter from "../assets/inter.png";
import { APP_FEATURES } from "../utils/data";
import { UserContext } from "../context/userContext";
import ProfileInfoCard from "../components/Cards/ProfileInfoCard";

const FEATURE_ICONS = [LuBrain, LuBookOpen, LuPin, LuLightbulb];

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [openAuthModel, setOpenAuthModel] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModel(true);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf8f0] text-gray-900 overflow-x-hidden">

      {/* Animated background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-orange-200 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/2 -right-32 w-80 h-80 bg-yellow-200 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 left-1/3 w-72 h-72 bg-orange-100 rounded-full blur-2xl"
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex justify-between items-center px-6 md:px-16 py-5 backdrop-blur-sm bg-white/40 border-b border-orange-100 sticky top-0 z-40"
      >
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.03 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm"
          >
            <LuSparkles className="text-white text-sm" />
          </motion.div>
          <h1 className="text-lg font-bold text-gray-900">Interview Prep AI</h1>
        </motion.div>

        {user ? <ProfileInfoCard /> : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpenAuthModel(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full text-sm font-medium transition shadow-sm hover:shadow-md"
          >
            Login / Sign Up
          </motion.button>
        )}
      </motion.header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-20 gap-12">
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="max-w-xl"
        >
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 text-xs font-semibold rounded-full bg-orange-100 text-orange-600 border border-orange-200 shadow-sm"
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <LuSparkles className="text-sm" />
            </motion.span>
            AI Powered
          </motion.span>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
            {"Ace Interviews with ".split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.02 }}
              >
                {char}
              </motion.span>
            ))}
            <span className="relative inline-block">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="text-orange-500"
              >
                AI-Powered
              </motion.span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 1.3 }}
                className="absolute -bottom-1 left-0 w-full h-1 bg-orange-300 rounded-full origin-left block"
              />
            </span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              {" "}Learning
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-gray-500 text-base mb-8 leading-relaxed"
          >
            Get role-specific questions, expand answers when you need them,
            dive deeper into concepts, and organize everything your way.
            From preparation to mastery — your ultimate interview toolkit.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="flex items-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(249,115,22,0.35)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCTA}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-full text-sm font-semibold shadow-lg shadow-orange-200 transition"
            >
              Get Started Free
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                <LuArrowRight />
              </motion.span>
            </motion.button>
            <span className="text-xs text-gray-400">No credit card required</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
          className="w-full md:w-[48%] flex justify-center"
        >
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 bg-orange-300 rounded-3xl blur-2xl"
            />
            <div className="relative bg-white/70 backdrop-blur-md border border-orange-100 rounded-3xl p-4 shadow-2xl">
              <div className="bg-gradient-to-br from-[#fff8ee] to-[#fdefd8] rounded-2xl p-5">
                <img src={inter} alt="Interview" className="w-full rounded-xl shadow-md" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-6 md:px-16 py-20 bg-white/50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xs font-semibold text-orange-500 uppercase tracking-widest"
          >
            Why Choose Us
          </motion.span>
          <h2 className="text-3xl font-bold mt-2 text-gray-900">Everything You Need to Succeed</h2>
          <p className="text-gray-400 text-sm mt-3 max-w-md mx-auto">
            Powerful features designed to make your interview preparation smarter and more effective.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {APP_FEATURES.map((feature, index) => {
            const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length];
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.12 }}
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.08)", transition: { duration: 0.2 } }}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm cursor-default group"
              >
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.4 } }}
                  className="w-11 h-11 bg-orange-50 group-hover:bg-orange-100 rounded-xl flex items-center justify-center mb-4 transition"
                >
                  <Icon className="text-orange-500 text-xl" />
                </motion.div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Banner */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-6 md:px-16 py-20"
      >
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-3xl px-10 py-14 text-center shadow-xl relative overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -top-10 -right-10 w-48 h-48 bg-white rounded-full blur-2xl"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute -bottom-10 -left-10 w-48 h-48 bg-white rounded-full blur-2xl"
          />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Ready to Land Your Dream Job?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-orange-100 text-sm mb-8 max-w-md mx-auto"
          >
            Join thousands of candidates who aced their interviews with AI-powered preparation.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.06, boxShadow: "0 12px 30px rgba(0,0,0,0.15)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCTA}
            className="bg-white text-orange-500 px-8 py-3.5 rounded-full text-sm font-bold shadow-lg transition"
          >
            Start Preparing Now →
          </motion.button>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="px-6 md:px-16 py-8 border-t border-orange-100 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center">
            <LuSparkles className="text-white text-xs" />
          </div>
          <span className="text-sm font-semibold text-gray-700">Interview Prep AI</span>
        </div>
        <p className="text-xs text-gray-400">© 2025 Interview Prep AI. All rights reserved.</p>
      </motion.footer>

      <AnimatePresence>
        {openAuthModel && (
          <Model
            isOpen={openAuthModel}
            onClose={() => {
              setOpenAuthModel(false);
              setCurrentPage("login");
            }}
            hideHeader
          >
            <AnimatePresence mode="wait">
              {currentPage === "login" && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.25 }}
                >
                  <Login setCurrentPage={setCurrentPage} />
                </motion.div>
              )}
              {currentPage === "signup" && (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                >
                  <SignUp setCurrentPage={setCurrentPage} />
                </motion.div>
              )}
            </AnimatePresence>
          </Model>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
