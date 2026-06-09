import React, { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LuSparkles, LuBrain, LuBookOpen, LuPin, LuLightbulb, LuArrowRight, LuStar, LuRocket, LuZap, LuCheck } from "react-icons/lu";
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

const AnimatedCounter = ({ end, suffix = "", duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = Math.ceil(end / (duration * 60));
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

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
            y: [0, -window.innerHeight - 100],
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

const TestimonialCard = ({ quote, author, role, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-2xl p-6 shadow-sm"
  >
    <div className="flex gap-1 mb-3">
      {[...Array(5)].map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.3 + i * 0.1 }}
          className="text-orange-400"
        >
          ★
        </motion.span>
      ))}
    </div>
    <p className="text-gray-600 text-sm leading-relaxed mb-4">"{quote}"</p>
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
        {author.charAt(0)}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800">{author}</p>
        <p className="text-xs text-gray-400">{role}</p>
      </div>
    </div>
  </motion.div>
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

const GSAPStaggerContainer = ({ children, className, stagger = 0.1 }) => {
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
        duration: 0.7,
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

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [openAuthModel, setOpenAuthModel] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const headingRef = useRef(null);
  const heroImageRef = useRef(null);
  const ctaSectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);

  useEffect(() => {
    
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

  
    if (ctaSectionRef.current) {
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
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModel(true);
    } else {
      navigate("/dashboard");
    }
  };

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

  const featureCardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <div className="min-h-screen bg-[#fdf8f0] text-gray-900 overflow-x-hidden">
      <ParticleField />
      <FloatingIcons />


      <div className="hidden md:block fixed inset-0 -z-20 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[30rem] h-[30rem] bg-gradient-to-br from-orange-300/30 to-yellow-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.35, 0.15],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-40 -left-40 w-[35rem] h-[35rem] bg-gradient-to-tr from-purple-300/20 to-orange-200/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-orange-200/10 rounded-full blur-3xl"
        />
      </div>

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

      <section ref={heroRef} className="relative">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="flex flex-col md:flex-row items-center justify-between px-4 md:px-16 py-10 md:py-24 gap-8 md:gap-12">
          
  
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-xl"
          >
            <motion.div
              variants={{
                hidden: { scale: 0.8, opacity: 0 },
                visible: { scale: 1, opacity: 1 },
              }}
              transition={{ duration: 0.5, type: "spring" }}
              className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-600 border border-orange-200 shadow-sm"
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <LuSparkles className="text-sm" />
              </motion.span>
              AI-Powered Interview Preparation
            </motion.div>

            <h1
              ref={headingRef}
              className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight text-gray-900"
            >
              {"Ace Every Interview with AI-Powered Preparation".split(" ").map((word, i) => (
                <span
                  key={i}
                  className="gsap-char inline-block mr-[0.35em]"
                  style={{ opacity: 0 }}
                >
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
              Get role-specific questions, expand answers when you need them,
              dive deeper into concepts, and organize everything your way.
              From preparation to mastery — your ultimate interview toolkit.
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
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="group-hover:translate-x-1 transition-transform"
                >
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

          <motion.div
            initial={{ x: 100, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4, type: "spring" }}
            className="w-full md:w-[48%] flex justify-center"
          >
            <div ref={heroImageRef} className="relative">
            
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
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
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-2 h-2 bg-green-400 rounded-full"
                    />
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

      {/* FEATURES SECTION */}
      <section ref={featuresRef} className="px-6 md:px-16 py-24 bg-white/40 relative">
        <GSAPReveal className="text-center mb-16">
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

        <GSAPStaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {APP_FEATURES.map((feature, index) => {
            const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length];
            return (
              <div
                key={feature.id}
                className="group bg-white border border-gray-100 rounded-2xl p-7 shadow-sm cursor-default relative overflow-hidden hover:-translate-y-3 hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">
                  <div className="w-12 h-12 bg-orange-50 group-hover:bg-orange-100 rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:rotate-6 duration-300">
                    <Icon className="text-orange-500 text-xl" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                </span>
              </div>
            );
          })}
        </GSAPStaggerContainer>

        {/* Stats Counter with GSAP */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {COUNTERS.map((counter, i) => (
            <GSAPCounter key={i} end={counter.value} suffix={counter.suffix} label={counter.label} />
          ))}
        </div>
      </section>

      {/* TESTIMONIALS with GSAP */}
      <section className="px-6 md:px-16 py-20">
        <GSAPReveal className="text-center mb-12">
          <span className="text-xs font-semibold text-orange-500 uppercase tracking-widest bg-orange-50 px-4 py-1.5 rounded-full border border-orange-100">
            Testimonials
          </span>
          <h2 className="text-3xl font-bold mt-4 text-gray-900">
            What Our Users Say
          </h2>
        </GSAPReveal>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <TestimonialCard
            quote="This platform completely transformed my interview preparation. The AI-generated questions were spot-on for my role."
            author="Sarah K."
            role="Software Engineer"
            delay={0.1}
          />
          <TestimonialCard
            quote="The concept expansion feature is incredible. It helped me understand the 'why' behind every answer."
            author="Mike R."
            role="Data Scientist"
            delay={0.2}
          />
          <TestimonialCard
            quote="I landed my dream job after practicing with this tool. The personalized approach made all the difference."
            author="Priya M."
            role="Product Manager"
            delay={0.3}
          />
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
          className="bg-gradient-to-br from-orange-500 via-orange-400 to-orange-500 rounded-3xl px-10 py-16 text-center shadow-2xl relative overflow-hidden"
        >
          {/* Animated background patterns */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.25, 0.1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1],
              rotate: [0, -180, -360],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 1 }}
            className="absolute -bottom-20 -left-20 w-64 h-64 bg-white rounded-full blur-3xl"
          />
          
          {/* Floating checkmarks */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white/20"
              style={{
                top: `${20 + i * 30}%`,
                left: `${10 + i * 35}%`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 3 + i,
                delay: i * 0.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <LuCheck size={24 + i * 8} />
            </motion.div>
          ))}

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
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, type: "spring" }}
            className="flex flex-wrap items-center justify-center gap-4"
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
    </div>
  );
};

export default LandingPage;