import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";

// (Optional) register Flip if available in your gsap build.
try {
  gsap.registerPlugin(Flip);
} catch {
  // ignore
}
import {
  LuMessageCircle,
  LuX,
  LuSend,
  LuSparkles,
  LuBot,
  LuUser,
  LuChevronDown,
} from "react-icons/lu";
import AIResponsePreview from "../AIResponsePreview";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";

const WELCOME_MESSAGE = {
  role: "ai",
  content:
    "Hi! 👋 I'm your AI study assistant. Ask me anything about interview topics, concepts, or doubts you have. I'm here to help you learn!",
};

const QUICK_QUESTIONS = [
  "Explain REST APIs simply",
  "What is OOP in programming?",
  "Difference between SQL and NoSQL",
  "What are React hooks?",
  "Explain Big O notation",
  "What is a Promise in JavaScript?",
];

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickQ, setShowQuickQ] = useState(true);

  // DOM Refs for GSAP
  const buttonRef = useRef(null);
  const chatWindowRef = useRef(null);
  const backdropRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const timelineRef = useRef(null);

  // 1. Continuous Floating Button Breath Effect
  useEffect(() => {
    const floatAnim = gsap.to(buttonRef.current, {
      y: "-=6",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => floatAnim.kill();
  }, []);

  // 2. Initialize Main Open/Close GSAP Timeline
  useEffect(() => {
    gsap.set(chatWindowRef.current, { scale: 0.85, opacity: 0, y: 40, pointerEvents: "none" });
    gsap.set(backdropRef.current, { opacity: 0, display: "none" });

    timelineRef.current = gsap.timeline({ paused: true });

    timelineRef.current
      .to(backdropRef.current, {
        display: "block",
        opacity: 1,
        duration: 0.2,
        ease: "power2.out",
      })
      .to(
        chatWindowRef.current,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          pointerEvents: "auto",
          duration: 0.45,
          ease: "back.out(1.4)", // Elastic snap-in effect
        },
        "-=0.1"
      );
  }, []);

  // Trigger timeline based on open state
  useEffect(() => {
    if (isOpen) {
      timelineRef.current.play();
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      timelineRef.current.reverse();
    }
  }, [isOpen]);

  // 3. Staggered Entrance for Quick Questions
  useEffect(() => {
    if (isOpen && showQuickQ && messages.length === 1) {
      gsap.fromTo(
        ".quick-question-btn",
        { opacity: 0, y: 15, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.06,
          duration: 0.4,
          ease: "power3.out",
          delay: 0.2,
        }
      );
    }
  }, [isOpen, showQuickQ, messages]);

  // 4. Smooth Inward Pop for New Messages & Auto Scroll
  useEffect(() => {
    const lastMessage = document.querySelector(".chat-message-item:last-child");
    if (lastMessage) {
      gsap.fromTo(
        lastMessage,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out" }
      );
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const userMessage = text || input;
    if (!userMessage.trim() || isLoading) return;

    setInput("");
    setShowQuickQ(false);

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AI.CLARIFY_DOUBT, {
        sessionId: "chat-assistant",
        questionContext: "General doubt clarification and topic learning",
        userMessage: userMessage,
      });

      const aiReply = response.data?.answer || "I couldn't process that. Please try again.";
      setMessages((prev) => [...prev, { role: "ai", content: aiReply }]);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Sorry, I'm having trouble connecting. Please try again.";
      setMessages((prev) => [...prev, { role: "ai", content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickQuestion = (q) => {
    sendMessage(q);
  };

  const resetChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setShowQuickQ(true);
    setInput("");
  };

  return (
    <>
      {/* Floating Action Button with Ambient Glow */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-2 sm:right-6 z-[9999] w-14 h-14 rounded-2xl shadow-[0_8px_30px_rgb(99,102,241,0.5)] hover:shadow-[0_8px_35px_rgb(139,92,246,0.7)] flex items-center justify-center transition-all duration-300 cursor-pointer bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 hover:scale-105 active:scale-95"
      >
        {isOpen ? (
          <LuX className="text-white transform transition-transform duration-300 rotate-90" size={22} />
        ) : (
          <div className="relative flex items-center justify-center">
            <LuMessageCircle className="text-white" size={22} />
            <span className="absolute -top-3 -right-3 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center animate-pulse">
              <LuSparkles size={7} className="text-emerald-900" />
            </span>
          </div>
        )}
      </button>

      {/* Mobile Backdrop Mask */}
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[9998] lg:hidden"
        onClick={() => setIsOpen(false)}
      />

      {/* Main Chat Interface Container */}
      <div
        ref={chatWindowRef}
        className="fixed bottom-24 right-6 z-[9999] w-[390px] max-w-[calc(100vw-2rem)] h-[620px] max-h-[calc(100vh-140px)] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden flex flex-col"
      >
        {/* Animated Gradient Header */}
        <div className="relative flex-shrink-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 px-4 py-4 shadow-md">
          <div className="absolute inset-0 opacity-15 mix-blend-overlay">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.4) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)",
              }}
            />
          </div>

          <div className="relative flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <LuBot className="text-white" size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white tracking-wide">AI Study Assistant</h3>
              <p className="text-[11px] text-white/70 flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
                {isLoading ? "Thinking..." : "Online · Ready to assist"}
              </p>
            </div>
            <button
              onClick={resetChat}
              className="text-white/60 hover:text-white transition-all px-2 py-1.5 rounded-lg hover:bg-white/10 active:scale-95"
              title="New conversation"
            >
              <LuChevronDown size={15} className="rotate-180" />
            </button>
          </div>
        </div>

        {/* Messaging History Container */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gradient-to-b from-gray-50/60 to-white scrollbar-thin scrollbar-thumb-gray-200">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-message-item flex gap-2.5 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "ai" && (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-50 to-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5 border border-indigo-100 shadow-xs">
                  <LuSparkles size={12} className="text-indigo-500" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-xs transition-shadow duration-200 hover:shadow-md ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-tr-xs"
                    : "bg-white border border-gray-100 text-gray-700 rounded-tl-xs"
                }`}
              >
                {msg.role === "ai" ? (
                  <div className="ai-chat-message">
                    <AIResponsePreview content={msg.content} />
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>

              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <LuUser size={12} className="text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Typing/Thinking Loader */}
          {isLoading && (
            <div className="flex gap-2.5 items-center">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-50 to-violet-100 flex items-center justify-center flex-shrink-0 border border-indigo-100 shadow-xs">
                <LuSparkles size={12} className="text-indigo-500" />
              </div>
              <div className="bg-white border border-gray-100 shadow-xs rounded-2xl rounded-tl-xs px-4 py-3 flex items-center justify-center">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-[bounce_1s_infinite_0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-[bounce_1s_infinite_150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-[bounce_1s_infinite_300ms]" />
                </div>
              </div>
            </div>
          )}

          {/* Quick Starter Question Section */}
          {showQuickQ && messages.length === 1 && (
            <div className="mt-3">
              <p className="text-xs text-gray-400 mb-2 font-semibold tracking-wide uppercase px-0.5">
                Suggested Topics:
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickQuestion(q)}
                    className="quick-question-btn opacity-0 text-xs bg-indigo-50/60 hover:bg-indigo-100/80 text-indigo-600 border border-indigo-100/70 rounded-xl px-3 py-2 transition-all duration-200 font-medium active:scale-95 text-left shadow-xs hover:shadow-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Control & Input Form Footer */}
        <div className="flex-shrink-0 border-t border-gray-100 bg-white px-4 py-3.5">
          <div className="flex items-end gap-2.5">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your query here..."
                rows={1}
                disabled={isLoading}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-transparent resize-none transition-all duration-200 disabled:opacity-50 disabled:bg-gray-50 max-h-28 focus:shadow-[0_0_15px_rgba(139,92,246,0.1)]"
                style={{ minHeight: "42px" }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 112) + "px";
                }}
              />
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 disabled:from-gray-200 disabled:to-gray-200 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 transition-all duration-200 shadow-md shadow-indigo-100 hover:scale-105 active:scale-95"
            >
              <LuSend className="text-white" size={15} />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center font-medium tracking-wide">
            Powered by Gemini AI · Review responses for accuracy
          </p>
        </div>
      </div>
    </>
  );
};

export default ChatBox;