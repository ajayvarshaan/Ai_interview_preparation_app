import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LuSparkles } from "react-icons/lu";
import Model from "../components/Model"
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";

import inter from "../assets/inter.png";
import { APP_FEATURES } from "../utils/data";
import { UserContext } from "../context/userContext";
import ProfileInfoCard from "../components/Cards/ProfileInfoCard";

const LandingPage = () => {
  const {user} = useContext(UserContext);
  const navigate = useNavigate();

  const [openAuthModel, setOpenAuthModel] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {
    if(!user){
      setOpenAuthModel(true);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#f7f3e8] via-[#f3ead7] to-[#efe3c2] text-gray-900">
      {/* Header */}
      <header className="flex justify-between items-center px-6 md:px-16 py-5">
        <h1 className="text-lg font-semibold">Interview Prep AI</h1>

    {   user ? <ProfileInfoCard/> : <button
          onClick={() => setOpenAuthModel(true)}
          className="bg-orange-400 hover:bg-orange-500 text-white px-5 py-2 rounded-full text-sm font-medium transition"
        >
          Login / Sign Up
        </button>}
      </header>

      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-16 gap-16">
        
        <div className="max-w-xl">
          
          <span className="inline-flex items-center gap-2 mb-4 px-4 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-600 border border-orange-200">
            <LuSparkles className="text-sm" />
            AI Powered
          </span>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Ace Interviews with <br />
            <span className="text-orange-500">AI-Powered</span> Learning
          </h1>

          <p className="text-gray-600 text-base mb-8 leading-relaxed">
            Get role-specific questions, expand answers when you need them,
            dive deeper into concepts, and organize everything your way.
            From preparation to mastery — your ultimate interview toolkit is here.
          </p>

          <button
            onClick={handleCTA}
            className="bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:scale-105 transition shadow-md"
          >
            Get Started
          </button>
        </div>

        <div className="w-full md:w-[45%] flex justify-center">
          <div className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-3xl p-4 shadow-xl">
            <div className="bg-gradient-to-br from-[#fffaf0] to-[#f3ead7] rounded-2xl p-6">
              <img
                src={inter}
                alt="Interview"
                className="w-full rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-16 py-16">
        <h2 className="text-2xl font-semibold mb-12 text-center">
          Features
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {APP_FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl p-4 shadow-md hover:shadow-xl transition duration-300"
            >
              <div className="bg-gradient-to-br from-[#fffaf0] to-[#f3ead7] rounded-xl p-5 h-full">

                <h3 className="font-semibold text-lg mb-3">
                  {feature.title}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

              </div>
            </div>
          ))}
        </div>
      </section>

<Model
  isOpen={openAuthModel}
  onClose={() => {
    setOpenAuthModel(false);
    setCurrentPage("login");
  }}
  hideHeader
>
  <div>
    {currentPage === "login" && (
      <Login setCurrentPage={setCurrentPage} />
    )}

    {currentPage === "signup" && (
      <SignUp setCurrentPage={setCurrentPage} />
    )}
  </div>
</Model>
    </div>
  );
};

export default LandingPage;