import React, { useState, useContext, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LuSparkles, LuBrain, LuBookOpen, LuPin, LuLightbulb, LuArrowRight, LuStar, LuRocket, LuZap, LuCheck, LuQuote, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Model from "../components/Model";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import interAI from "../assets/interAI.png";
import { APP_FEATURES } from "../utils/data";
import { UserContext } from "../context/userContext";
import ProfileInfoCard from "../components/Cards/ProfileInfoCard";

gsap.registerPlugin(ScrollTrigger);

const FEATURE_ICONS = [LuBrain, LuBookOpen, LuPin, LuLightbulb];

const FLOATING_ICONS = [
  { Icon: LuStar, color: "text-orange-300", size: 16 },
  { Icon: LuZap, color: "text-yellow-300", size: 14 },
  { Icon: LuRocket, color: "text-orange-400", size: 18 },
  { Icon: LuBrain, color: "text-orange-200", size: 12 },
  { Icon: LuSparkles, color: "text-yellow-200", size: 10 },
];

const PARTICLE_COUNT = 30;

const STATS = [
  { label: "AI-Powered Sessions", value: "10K+" },
  { label: "Active Users", value: "5K+" },
  { label: "Questions Generated", value: "50K+" },
];

const COUNTERS = [
  { label: "Questions Generated", value: 50000, suffix: "+" },
  { label: "Active Users", value: 5000, suffix: "+" },
  { label: "Roles Covered", value: 200, suffix: "+" },
];

const TESTIMONIALS = [
  {
    quote: "This platform completely transformed my interview preparation. The AI-generated questions were spot-on for my role.",
    author: "Sarah K.",
    role: "Software Engineer",
  },
  {
    quote: "The concept expansion feature is incredible. It helped me understand the 'why' behind every answer.",
    author: "Mike R.",
    role: "Data Scientist",
  },
  {
    quote: "I landed my dream job after practicing with this tool. The personalized approach made all the difference.",
    author: "Priya M.",
    role: "Product Manager",
  },
  {
    quote: "The feedback feels human—clear, structured, and actually helps me improve my next answer.",
    author: "Rahul S.",
    role: "Backend Engineer",
  },
  {
    quote: "I love how I can pin the best explanations. It turned revision into something I look forward to.",
    author: "Emma L.",
    role: "UX Researcher",
  },
];

const ParticleField = () => {
  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    delay: Math.random() * 8,
    duration: Math.random() * 12 + 8,
    opacity: Math.random() * 0.3 + 0.1,
  }));

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-orange-400"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -(typeof window !== "undefined" ? window.innerHeight : 800) - 100],
            x: [0, (Math.random() - 0.5) * 100],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

const FloatingIcons = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    {FLOATING_ICONS.map((item, i) => (
      <motion.div
        key={i}
        className={`absolute ${item.color}`}
        style={{
          left: `${15 + i * 18}%`,
          top: `${10 + i * 15}%`,
        }}
        animate={{
          y: [0, -30, 0],
          rotate: [0, 10, -10, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4 + i * 0.8,
          delay: i * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <item.Icon size={item.size} />
      </motion.div>
    ))}
  </div>
);

const GSAPReveal = ({ children, className, delay = 0, direction = "up" }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const yVal = direction === "up" ? 50 : direction === "down" ? -50 : 0;
    const xVal = direction === "left" ? 50 : direction === "right" ? -50 : 0;

    gsap.fromTo(
      el,
      { opacity: 0, y: yVal, x: xVal },
      {
        opacity: 1,
        y: 0,
        x: 0,
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
  }, [delay, direction]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
};

const GSAPCounter = ({ end, suffix = "", label }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: end,
      duration: 2.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      onUpdate: () => {
        el.textContent = Math.round(obj.val).toLocaleString() + suffix;
      },
    });
  }, [end, suffix]);

  return (
    <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-orange-100/50 shadow-sm">
      <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
        <span ref={ref}>0{suffix}</span>
      </div>
      <div className="text-xs text-gray-500 mt-2 font-medium">{label}</div>
    </div>
  );
};

const FeatureCard = ({ feature, isActive, index, Icon, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={
      "feature-tab-btn w-full text-left p-4 md:p-5 rounded-2xl border transition-all duration-300 " +
      (isActive
        ? "bg-white shadow-md border-orange-200/70"
        : "bg-white/50 border-gray-100 hover:border-orange-100 hover:shadow-sm")
    }
  >
    <div className="flex items-start gap-3 md:gap-4">
      <div
        className={
          "w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center border flex-shrink-0 " +
          (isActive
            ? "bg-gradient-to-br from-orange-500 to-orange-400 border-orange-300"
            : "bg-orange-50 border-orange-100")
        }
      >
        <Icon className={isActive ? "text-white text-xl" : "text-orange-500 text-xl"} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <h4 className="font-semibold text-gray-900 text-sm md:text-base truncate">
            {feature.title}
          </h4>
          <span
            className={
              "text-xs font-semibold px-2 py-1 rounded-full border flex-shrink-0 " +
              (isActive
                ? "bg-orange-50 text-orange-600 border-orange-200"
                : "bg-transparent text-gray-400 border-gray-100")
            }
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <p className={"text-xs md:text-sm mt-1 line-clamp-2 " + (isActive ? "text-gray-600" : "text-gray-500")}>
          {feature.description}
        </p>
      </div>
    </div>
  </button>
);

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [openAuthModel, setOpenAuthModel] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");
  const [activeFeatureId, setActiveFeatureId] = useState(APP_FEATURES?.[0]?.id ?? "01");
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const headingRef = useRef(null);
  const heroImageRef = useRef(null);
  const ctaSectionRef = useRef(null);
  const featuresTabsRef = useRef(null);
  const featureCardBodyRef = useRef(null);
  const featureSmallCardsRef = useRef(null);
  const testimonialAreaRef = useRef(null);
  const testimonialProgressRef = useRef(null);

  const activeFeature = APP_FEATURES.find((f) => f.id === activeFeatureId) ?? APP_FEATURES[0];

  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  // GSAP Hero animations
  useEffect(() => {
    if (prefersReducedMotion) return;

    if (headingRef.current) {
      const chars = headingRef.current.querySelectorAll(".gsap-char");
      gsap.fromTo(
        chars,
        { opacity: 0, y: 40, rotateX: -90 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.6,
          stagger: 0.03,
          ease: "back.out(1.7)",
          delay: 0.5,
        }
      );
    }

    if (heroImageRef.current) {
      gsap.to(heroImageRef.current, {
        y: -15,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [prefersReducedMotion]);

  // GSAP CTA animation
  useEffect(() => {
    if (prefersReducedMotion || !ctaSectionRef.current) return;

    gsap.fromTo(
      ctaSectionRef.current,
      { scale: 0.95, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ctaSectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [prefersReducedMotion]);

  // GSAP Features section animations — triggered on scroll
  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Animate feature tab buttons with stagger from left
      if (featuresTabsRef.current) {
        const tabBtns = featuresTabsRef.current.querySelectorAll(".feature-tab-btn");
        gsap.fromTo(
          tabBtns,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: featuresTabsRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Animate the main feature card body
      if (featureCardBodyRef.current) {
        gsap.fromTo(
          featureCardBodyRef.current,
          { opacity: 0, y: 30, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: featureCardBodyRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Animate small feature cards row
      if (featureSmallCardsRef.current) {
        const cards = featureSmallCardsRef.current.children;
        gsap.fromTo(
          cards,
          { opacity: 0, y: 25, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: featureSmallCardsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // GSAP Testimonials section animations
  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Animate progress bar sweep
      if (testimonialProgressRef.current) {
        gsap.fromTo(
          testimonialProgressRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: testimonialProgressRef.current,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      }

     
      if (testimonialAreaRef.current) {
        const featuredCard = testimonialAreaRef.current.querySelector(".testimonial-featured");
        const otherCards = testimonialAreaRef.current.querySelectorAll(".testimonial-other");

        if (featuredCard) {
          gsap.fromTo(
            featuredCard,
            { opacity: 0, y: 30, scale: 0.97 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: testimonialAreaRef.current,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        }

        if (otherCards.length) {
          gsap.fromTo(
            otherCards,
            { opacity: 0, x: 30 },
            {
              opacity: 1,
              x: 0,
              duration: 0.5,
              stagger: 0.08,
              ease: "power2.out",
              scrollTrigger: {
                trigger: testimonialAreaRef.current,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      }
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Auto-advance testimonials
  useEffect(() => {
    if (prefersReducedMotion) return;

    const id = window.setInterval(() => {
      setActiveTestimonialIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 5500);

    return () => window.clearInterval(id);
  }, [prefersReducedMotion]);

  const handleCTA = useCallback(() => {
    if (!user) {
      setOpenAuthModel(true);
    } else {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#fdf8f0] text-gray-900 overflow-x-hidden">
      <ParticleField />
      <FloatingIcons />

      {/* Animated Background Gradient Orbs */}
      <div className="hidden md:block fixed inset-0 -z-20 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2], rotate: [0, 90, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[30rem] h-[30rem] bg-gradient-to-br from-orange-300/30 to-yellow-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.35, 0.15], rotate: [0, -90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-40 -left-40 w-[35rem] h-[35rem] bg-gradient-to-tr from-purple-300/20 to-orange-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-orange-200/10 rounded-full blur-3xl"
        />
      </div>

      {/* NAVBAR */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", type: "spring", stiffness: 80 }}
        className="flex justify-between items-center px-4 md:px-16 py-3 md:py-4 backdrop-blur-xl bg-white/30 border-b border-orange-100/50 sticky top-0 z-40 shadow-sm"
      >
        <motion.div
          className="flex items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-400 rounded-lg flex items-center justify-center shadow-md"
          >
            <LuSparkles className="text-white text-sm" />
          </motion.div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
            Interview Prep AI
          </h1>
        </motion.div>

        <div className="flex items-center gap-4">
          {user ? (
            <ProfileInfoCard />
          ) : (
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(249,115,22,0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setOpenAuthModel(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-sm"
            >
              Login / Sign Up
            </motion.button>
          )}
        </div>
      </motion.header>

      {/* HERO SECTION */}
      <section ref={heroRef} className="relative">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="flex flex-col md:flex-row items-center justify-between px-4 md:px-16 py-10 md:py-24 gap-8 md:gap-12">
          {/* Left Content */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-xl w-full">
            <motion.div
              variants={{
                hidden: { scale: 0.8, opacity: 0 },
                visible: { scale: 1, opacity: 1 },
              }}
              transition={{ duration: 0.5, type: "spring" }}
              className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-600 border border-orange-200 shadow-sm"
            >
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
                <LuSparkles className="text-sm" />
              </motion.span>
              AI-Powered Interview Preparation
            </motion.div>

            <h1 ref={headingRef} className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight text-gray-900">
              {"Ace Every Interview with AI-Powered Preparation".split(" ").map((word, i) => (
                <span key={i} className="gsap-char inline-block mr-[0.35em]" style={{ opacity: 0 }}>
                  {word}
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="text-gray-500 text-base md:text-lg mb-8 leading-relaxed"
            >
              Get role-specific questions, expand answers when you need them, dive deeper into concepts, and organize everything your way. From preparation to mastery — your ultimate interview toolkit.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              className="flex gap-4 md:gap-6 mb-6 md:mb-8"
            >
              {STATS.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + i * 0.15, duration: 0.4 }}
                  className="text-center"
                >
                  <div className="text-lg font-bold text-orange-500">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 15px 40px rgba(249,115,22,0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCTA}
                className="group flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white px-8 py-3.5 rounded-full text-sm font-semibold shadow-lg shadow-orange-200 transition-all"
              >
                Get Started Free
                <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.2, repeat: Infinity }} className="group-hover:translate-x-1 transition-transform">
                  <LuArrowRight />
                </motion.span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => featuresRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 px-5 py-3 rounded-full text-sm font-medium border border-gray-200 hover:border-gray-300 transition-all"
              >
                <LuSparkles className="text-orange-400" />
                See Features
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right - Hero Image */}
          <motion.div
            initial={{ x: 100, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4, type: "spring" }}
            className="w-full md:w-[48%] flex justify-center"
          >
            <div ref={heroImageRef} className="relative">
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-3xl blur-3xl"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 border-2 border-dashed border-orange-200/50 rounded-[2rem]"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-8 border border-dashed border-orange-100/30 rounded-[2.5rem]"
              />
              <div className="relative bg-white/60 backdrop-blur-md border border-orange-100 rounded-3xl p-4 shadow-2xl">
                <div className="bg-gradient-to-br from-[#fff8ee] to-[#fdefd8] rounded-2xl p-5">
                  <motion.img
                    src={interAI}
                    alt="Interview"
                    className="w-full rounded-xl shadow-md"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5, type: "spring" }}
                  className="absolute -bottom-4 -right-4 bg-white rounded-xl px-4 py-2 shadow-lg border border-orange-100"
                >
                  <div className="flex items-center gap-2">
                    <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-xs font-semibold text-gray-700">Live Practice</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Wave divider */}
        <div className="relative -mt-2">
          <svg viewBox="0 0 1440 100" className="w-full h-auto" preserveAspectRatio="none">
            <motion.path
              fill="#fdf8f0"
              fillOpacity="1"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2 }}
              d="M0,50 C240,100 480,0 720,50 C960,100 1200,0 1440,50 L1440,100 L0,100 Z"
            />
          </svg>
        </div>
      </section>

      {/* FEATURES SECTION — Redesigned with GSAP */}
      <section ref={featuresRef} className="px-6 md:px-16 py-20 md:py-28 bg-white/40 relative">
        <GSAPReveal className="text-center mb-12 md:mb-16">
          <span className="inline-block text-xs font-semibold text-orange-500 uppercase tracking-widest bg-orange-50 px-4 py-1.5 rounded-full border border-orange-100">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 text-gray-900">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">Succeed</span>
          </h2>
          <p className="text-gray-400 text-sm mt-3 max-w-lg mx-auto">
            Powerful features designed to make your interview preparation smarter and more effective.
          </p>
        </GSAPReveal>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left — Feature Tabs */}
            <div ref={featuresTabsRef} className="lg:w-2/5 w-full">
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 text-white shadow-sm flex-shrink-0">
                    <LuSparkles />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Advanced Features</h3>
                    <p className="text-sm text-gray-500">Select a capability to see how it works.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {APP_FEATURES.map((feature, index) => {
                  const isActive = feature.id === activeFeatureId;
                  const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length];
                  return (
                    <FeatureCard
                      key={feature.id}
                      feature={feature}
                      isActive={isActive}
                      index={index}
                      Icon={Icon}
                      onClick={() => setActiveFeatureId(feature.id)}
                    />
                  );
                })}
              </div>
            </div>

            {/* Right — Feature Detail + Small Cards */}
            <div className="lg:w-3/5 w-full flex flex-col gap-6">
              {/* Main Feature Card */}
              <div className="relative">
                <div className="absolute -inset-3 bg-gradient-to-br from-orange-200/30 to-transparent rounded-[2.25rem] blur-md pointer-events-none" />
                <div
                  ref={featureCardBodyRef}
                  className="relative bg-white/70 backdrop-blur-sm border border-orange-100 rounded-[2.25rem] p-6 md:p-8 shadow-sm overflow-hidden"
                >
                  <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gradient-to-tr from-orange-500/20 to-yellow-300/10 blur-2xl" />

                  <div className="flex flex-col sm:flex-row items-start gap-5">
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center text-white shadow-sm">
                        {(() => {
                          const idx = APP_FEATURES.findIndex((f) => f.id === activeFeatureId);
                          const Icon = FEATURE_ICONS[(idx >= 0 ? idx : 0) % FEATURE_ICONS.length];
                          return <Icon className="text-2xl md:text-3xl" />;
                        })()}
                      </div>
                      <div className="absolute -inset-2 border-2 border-dashed border-orange-200/60 rounded-3xl pointer-events-none" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl md:text-2xl font-extrabold text-gray-900">{activeFeature.title}</h3>
                      <p className="text-gray-600 mt-2 leading-relaxed text-sm md:text-base">{activeFeature.description}</p>

                      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { t: "AI Generated", d: "Role-specific insights tuned to your focus." },
                          { t: "Faster Practice", d: "Turn concepts into confident answers." },
                          { t: "Deep Dives", d: "Understand the why, then improve next." },
                          { t: "Organized Learning", d: "Pin notes and build a clear revision path." },
                        ].map((item, i) => (
                          <div key={i} className="p-3 rounded-xl border border-orange-100/70 bg-white/60">
                            <div className="text-sm font-semibold text-gray-900">{item.t}</div>
                            <div className="text-xs text-gray-500 mt-1">{item.d}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* GSAP progress bar sweep */}
                  <div className="mt-6 h-1.5 w-full rounded-full bg-orange-100 overflow-hidden">
                    <div className="progress-bar-sweep h-full w-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full origin-left" />
                  </div>
                </div>
              </div>

              {/* Small Feature Cards Row */}
              <div ref={featureSmallCardsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {APP_FEATURES.slice(0, 3).map((f, i) => {
                  const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
                  const isActive = f.id === activeFeatureId;
                  return (
                    <div
                      key={f.id}
                      className={
                        "rounded-2xl border p-4 bg-white/60 backdrop-blur-sm shadow-sm transition-all duration-300 " +
                        (isActive ? "border-orange-200/80 ring-1 ring-orange-200/40" : "border-orange-100/50 hover:border-orange-200/60")
                      }
                    >
                      <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                        <Icon className="text-orange-500" />
                      </div>
                      <div className="mt-3 font-semibold text-sm text-gray-900">{f.title}</div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">{f.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Counter */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
          {COUNTERS.map((counter, i) => (
            <GSAPCounter key={i} end={counter.value} suffix={counter.suffix} label={counter.label} />
          ))}
        </div>
      </section>

      {/* TESTIMONIALS SECTION — Redesigned with GSAP */}
      <section className="px-6 md:px-16 py-20 md:py-28">
        <GSAPReveal className="text-center mb-12">
          <span className="text-xs font-semibold text-orange-500 uppercase tracking-widest bg-orange-50 px-4 py-1.5 rounded-full border border-orange-100">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 text-gray-900">What Our Users Say</h2>
          <p className="text-gray-400 text-sm mt-3 max-w-lg mx-auto">
            Hear from professionals who transformed their interview preparation journey.
          </p>
        </GSAPReveal>

        <div className="max-w-5xl mx-auto" ref={testimonialAreaRef}>
          {/* Progress Bar */}
          <div className="h-1 w-full bg-orange-100 rounded-full overflow-hidden mb-8">
            <div
              ref={testimonialProgressRef}
              className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full origin-left"
              style={{ width: `${((activeTestimonialIndex + 1) / TESTIMONIALS.length) * 100}%`, transition: "width 500ms ease" }}
            />
          </div>

          {/* Featured Testimonial + Others */}
          <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            {/* Featured Card */}
            <div className="testimonial-featured lg:w-[58%] w-full">
              <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden h-full flex flex-col">
                {/* Decorative header gradient */}
                <div aria-hidden className="pointer-events-none absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-400" />

                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-orange-400 text-lg">★</span>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full">
                    Featured
                  </span>
                </div>

                <div className="relative pl-6 md:pl-8">
                  <LuQuote className="absolute left-0 top-0 text-orange-200 text-2xl md:text-3xl" />
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed italic">
                    &ldquo;{TESTIMONIALS[activeTestimonialIndex].quote}&rdquo;
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {TESTIMONIALS[activeTestimonialIndex].author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{TESTIMONIALS[activeTestimonialIndex].author}</p>
                    <p className="text-xs text-gray-400">{TESTIMONIALS[activeTestimonialIndex].role}</p>
                  </div>
                </div>

                {/* Skills & Progress Section — fills vertical space */}
                <div className="mt-5 flex-1 flex flex-col gap-4">
                  {/* Skill progress bars */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Skills Improved</h4>
                    <div className="space-y-2.5">
                      {[
                        { label: "Technical Answers", pct: 94, color: "from-orange-400 to-orange-500" },
                        { label: "Confidence Level", pct: 88, color: "from-orange-400 to-yellow-400" },
                        { label: "Concept Clarity", pct: 92, color: "from-orange-500 to-yellow-500" },
                      ].map((skill, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600 font-medium">{skill.label}</span>
                            <span className="text-orange-500 font-bold">{skill.pct}%</span>
                          </div>
                          <div className="h-2 bg-orange-100/60 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.pct}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.3 + i * 0.2, ease: "power2.out" }}
                              className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Topics mastered chips */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Topics Mastered</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {["System Design", "DSA", "Behavioral", "DBMS", "Networking", "OS"].map((topic, i) => (
                        <span
                          key={topic}
                          className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100/70"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Impact statistics with visual bars */}
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <div className="bg-orange-50/50 rounded-xl p-3 border border-orange-100/50">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">98%</span>
                        <span className="text-[10px] text-gray-400">match</span>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">Question Relevance</div>
                      <div className="mt-2 h-1.5 bg-orange-100/60 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "98%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: 0.6, ease: "power2.out" }}
                          className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-500"
                        />
                      </div>
                    </div>
                    <div className="bg-orange-50/50 rounded-xl p-3 border border-orange-100/50">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">3.2x</span>
                        <span className="text-[10px] text-gray-400">faster</span>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">Interview Readiness</div>
                      <div className="mt-2 h-1.5 bg-orange-100/60 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "85%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: 0.8, ease: "power2.out" }}
                          className="h-full rounded-full bg-gradient-to-r from-orange-400 to-yellow-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="mt-4 pt-4 border-t border-orange-100/50 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTestimonialIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                    className="w-9 h-9 rounded-xl border border-orange-100 bg-white/60 hover:bg-white transition flex items-center justify-center text-orange-500 hover:text-orange-600"
                    aria-label="Previous testimonial"
                  >
                    <LuChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTestimonialIndex((i) => (i + 1) % TESTIMONIALS.length)}
                    className="w-9 h-9 rounded-xl border border-orange-100 bg-white/60 hover:bg-white transition flex items-center justify-center text-orange-500 hover:text-orange-600"
                    aria-label="Next testimonial"
                  >
                    <LuChevronRight size={16} />
                  </button>

                  <div className="flex-1" />
                  <div className="flex gap-2">
                    {TESTIMONIALS.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveTestimonialIndex(idx)}
                        className={
                          "h-2 rounded-full transition-all duration-300 " +
                          (idx === activeTestimonialIndex
                            ? "w-8 bg-gradient-to-r from-orange-500 to-orange-400"
                            : "w-2 bg-orange-200 hover:bg-orange-300")
                        }
                        aria-label={`Go to testimonial ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Featured Card */}
            <div className="testimonial-featured lg:w-[58%] w-full">
              <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden h-full flex flex-col">
                {/* Decorative header gradient */}
                <div aria-hidden className="pointer-events-none absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-yellow-400" />

                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-orange-400 text-lg">★</span>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full">
                    Featured
                  </span>
                </div>

                <div className="relative pl-6 md:pl-8">
                  <LuQuote className="absolute left-0 top-0 text-orange-200 text-2xl md:text-3xl" />
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed italic">
                    &ldquo;{TESTIMONIALS[activeTestimonialIndex].quote}&rdquo;
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {TESTIMONIALS[activeTestimonialIndex].author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{TESTIMONIALS[activeTestimonialIndex].author}</p>
                    <p className="text-xs text-gray-400">{TESTIMONIALS[activeTestimonialIndex].role}</p>
                  </div>
                </div>

                {/* Skills & Progress Section — fills vertical space */}
                <div className="mt-5 flex-1 flex flex-col gap-4">
                  {/* Skill progress bars */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Skills Improved</h4>
                    <div className="space-y-2.5">
                      {[
                        { label: "Technical Answers", pct: 94, color: "from-orange-400 to-orange-500" },
                        { label: "Confidence Level", pct: 88, color: "from-orange-400 to-yellow-400" },
                        { label: "Concept Clarity", pct: 92, color: "from-orange-500 to-yellow-500" },
                      ].map((skill, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600 font-medium">{skill.label}</span>
                            <span className="text-orange-500 font-bold">{skill.pct}%</span>
                          </div>
                          <div className="h-2 bg-orange-100/60 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.pct}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: 0.3 + i * 0.2, ease: "power2.out" }}
                              className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Topics mastered chips */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Topics Mastered</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {["System Design", "DSA", "Behavioral", "DBMS", "Networking", "OS"].map((topic, i) => (
                        <span
                          key={topic}
                          className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100/70"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Impact statistics with visual bars */}
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <div className="bg-orange-50/50 rounded-xl p-3 border border-orange-100/50">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">98%</span>
                        <span className="text-[10px] text-gray-400">match</span>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">Question Relevance</div>
                      <div className="mt-2 h-1.5 bg-orange-100/60 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "98%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: 0.6, ease: "power2.out" }}
                          className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-500"
                        />
                      </div>
                    </div>
                    <div className="bg-orange-50/50 rounded-xl p-3 border border-orange-100/50">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">3.2x</span>
                        <span className="text-[10px] text-gray-400">faster</span>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">Interview Readiness</div>
                      <div className="mt-2 h-1.5 bg-orange-100/60 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "85%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: 0.8, ease: "power2.out" }}
                          className="h-full rounded-full bg-gradient-to-r from-orange-400 to-yellow-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="mt-4 pt-4 border-t border-orange-100/50 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTestimonialIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                    className="w-9 h-9 rounded-xl border border-orange-100 bg-white/60 hover:bg-white transition flex items-center justify-center text-orange-500 hover:text-orange-600"
                    aria-label="Previous testimonial"
                  >
                    <LuChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTestimonialIndex((i) => (i + 1) % TESTIMONIALS.length)}
                    className="w-9 h-9 rounded-xl border border-orange-100 bg-white/60 hover:bg-white transition flex items-center justify-center text-orange-500 hover:text-orange-600"
                    aria-label="Next testimonial"
                  >
                    <LuChevronRight size={16} />
                  </button>

                  <div className="flex-1" />
                  <div className="flex gap-2">
                    {TESTIMONIALS.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveTestimonialIndex(idx)}
                        className={
                          "h-2 rounded-full transition-all duration-300 " +
                          (idx === activeTestimonialIndex
                            ? "w-8 bg-gradient-to-r from-orange-500 to-orange-400"
                            : "w-2 bg-orange-200 hover:bg-orange-300")
                        }
                        aria-label={`Go to testimonial ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Other Testimonials Sidebar */}
            <div className="lg:w-[42%] w-full">
              <div className="flex flex-col gap-4">
                {TESTIMONIALS.map((t, idx) => {
                  if (idx === activeTestimonialIndex) return null;
                  return (
                    <motion.div
                      key={t.author}
                      className="testimonial-other bg-white/70 backdrop-blur-sm border border-orange-100 rounded-2xl p-4 md:p-5 shadow-sm"
                      initial={false}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, ease: "power3.out" }}
                    >
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-orange-400 text-sm">★</span>
                        ))}
                      </div>
                      <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-3 line-clamp-2">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                          {t.author.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate">{t.author}</p>
                          <p className="text-[11px] text-gray-400 truncate">{t.role}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="px-6 md:px-16 py-20"
      >
        <div
          ref={ctaSectionRef}
          className="bg-gradient-to-br from-orange-500 via-orange-400 to-orange-500 rounded-3xl px-8 md:px-10 py-14 md:py-16 text-center shadow-2xl relative overflow-hidden"
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.25, 0.1], rotate: [0, 180, 360] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full blur-3xl pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1], rotate: [0, -180, -360] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 1 }}
            className="absolute -bottom-20 -left-20 w-64 h-64 bg-white rounded-full blur-3xl pointer-events-none"
          />

          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white/20 pointer-events-none"
              style={{ top: `${20 + i * 30}%`, left: `${10 + i * 35}%` }}
              animate={{ y: [0, -15, 0], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 3 + i, delay: i * 0.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <LuCheck size={24 + i * 8} />
            </motion.div>
          ))}

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10"
          >
            Ready to Land Your Dream Job?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-orange-100 text-sm mb-8 max-w-md mx-auto relative z-10"
          >
            Join thousands of candidates who aced their interviews with AI-powered preparation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, type: "spring" }}
            className="flex flex-wrap items-center justify-center gap-4 relative z-10"
          >
            <motion.button
              whileHover={{ scale: 1.06, boxShadow: "0 15px 40px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCTA}
              className="bg-white text-orange-500 hover:text-orange-600 px-8 py-3.5 rounded-full text-sm font-bold shadow-lg transition-all"
            >
              Start Preparing Now →
            </motion.button>
            <span className="text-orange-200 text-xs">No credit card required</span>
          </motion.div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="px-6 md:px-16 py-8 border-t border-orange-100 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-400 rounded-md flex items-center justify-center"
          >
            <LuSparkles className="text-white text-xs" />
          </motion.div>
          <span className="text-sm font-semibold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
            Interview Prep AI
          </span>
        </div>
        <p className="text-xs text-gray-400">© 2025 Interview Prep AI. All rights reserved.</p>
      </motion.footer>

      {/* AUTH MODAL */}
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

      {/* GSAP Sweep Animation — applied via CSS since GSAP also handles it */}
      <style>{`
        .progress-bar-sweep {
          transform: scaleX(0);
          animation: sweepPulse 2.2s ease-in-out infinite;
        }
        @keyframes sweepPulse {
          0%   { transform: scaleX(0); }
          50%  { transform: scaleX(1); }
          100% { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;