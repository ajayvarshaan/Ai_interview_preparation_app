import React, { useState, useContext, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { LuUser, LuMail, LuLock, LuArrowRight, LuSparkles, LuStar, LuRocket, LuArrowLeftToLine } from "react-icons/lu";
import Input from "../../components/Inputs/Input";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadImage";
import { validateEmail } from "../../utils/helper";

const FLOATING_EL = [
  { Icon: LuSparkles, color: "text-orange-300", size: 12, x: 8, y: 8, dur: 4.5, del: 0 },
  { Icon: LuStar, color: "text-yellow-300", size: 10, x: 88, y: 12, dur: 5.5, del: 0.3 },
  { Icon: LuRocket, color: "text-orange-400", size: 14, x: 80, y: 82, dur: 4, del: 0.6 },
  { Icon: LuSparkles, color: "text-orange-200", size: 9, x: 15, y: 88, dur: 5, del: 0.9 },
  { Icon: LuArrowLeftToLine, color: "text-yellow-200", size: 8, x: 50, y: 5, dur: 6, del: 1.2 },
];

const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const headerRef = useRef(null);
  const profileRef = useRef(null);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const buttonRef = useRef(null);
  const errorRef = useRef(null);
  const switchRef = useRef(null);
  const floatRefs = useRef([]);
  const particlesRef = useRef(null);
  const shineRef = useRef(null);

  // Magnetic button handler
  const handleMouseMove = useCallback((e) => {
    const btn = buttonRef.current;
    if (!btn || isLoading) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.4, ease: "power2.out" });
  }, [isLoading]);

  const handleMouseLeave = useCallback(() => {
    const btn = buttonRef.current;
    if (!btn) return;
    gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  }, []);

  // Entrance animation
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(cardRef.current, { opacity: 0, scale: 0.9, y: 40, rotateX: 5 }, { opacity: 1, scale: 1, y: 0, rotateX: 0, duration: 0.7 });
    tl.fromTo(glowRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5 }, "-=0.4");
    tl.fromTo(headerRef.current?.children, { opacity: 0, y: 25, rotationX: -10 }, { opacity: 1, y: 0, rotationX: 0, duration: 0.5, stagger: 0.1 }, "-=0.3");

    floatRefs.current.forEach((el) => {
      if (el) tl.fromTo(el, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.4 }, "-=0.5");
    });

    tl.fromTo(profileRef.current, { opacity: 0, scale: 0.8, rotation: -5 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.5 }, "-=0.35");
    tl.fromTo(nameRef.current, { opacity: 0, x: -30, scale: 0.97 }, { opacity: 1, x: 0, scale: 1, duration: 0.5 }, "-=0.35");
    tl.fromTo(emailRef.current, { opacity: 0, x: -30, scale: 0.97 }, { opacity: 1, x: 0, scale: 1, duration: 0.5 }, "-=0.35");
    tl.fromTo(passwordRef.current, { opacity: 0, x: -30, scale: 0.97 }, { opacity: 1, x: 0, scale: 1, duration: 0.5 }, "-=0.35");
    tl.fromTo(buttonRef.current, { opacity: 0, y: 25, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" }, "-=0.3");
    tl.fromTo(switchRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 }, "-=0.2");

    floatRefs.current.forEach((el, i) => {
      if (el && FLOATING_EL[i]) {
        gsap.to(el, { y: -10 - i * 3, x: i % 2 === 0 ? 6 : -6, rotation: i % 2 === 0 ? 8 : -8, duration: FLOATING_EL[i].dur + i * 0.4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.6 });
      }
    });

    if (glowRef.current) gsap.to(glowRef.current, { scale: 1.2, opacity: 0.2, duration: 2.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
    if (shineRef.current) gsap.to(shineRef.current, { x: "200%", duration: 1.8, repeat: -1, ease: "none", delay: 1 });

    if (particlesRef.current) {
      const dots = particlesRef.current.children;
      gsap.fromTo(dots, { y: 0, opacity: 0 }, { y: -80, opacity: 0.5, duration: 2.5, stagger: { each: 0.25, repeat: -1, repeatDelay: 0.5 }, ease: "power1.out" });
    }

    return () => { tl.kill(); gsap.killTweensOf("*"); };
  }, []);

  // Error animation
  useEffect(() => {
    if (error && errorRef.current) {
      gsap.fromTo(errorRef.current, { opacity: 0, y: -8, scale: 0.95, x: -3 }, { opacity: 1, y: 0, scale: 1, x: 0, duration: 0.4, ease: "back.out(2)" });
      gsap.fromTo(cardRef.current, { x: -4 }, { x: 4, duration: 0.08, repeat: 4, yoyo: true, ease: "power1.inOut", clearProps: "x" });
    }
  }, [error]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!fullName) errs.name = "Full name required";
    if (!validateEmail(email)) errs.email = "Valid email required";
    if (!password) errs.password = "Password required";
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) { setError("Please fill all fields correctly."); return; }
    setError(""); setIsLoading(true);
    if (buttonRef.current) gsap.to(buttonRef.current, { scale: 0.96, duration: 0.15 });

    try {
      let profileImageUrl = "";
      if (profilePic) { const imgUploadRes = await uploadImage(profilePic); profileImageUrl = imgUploadRes.imageUrl || ""; }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, { name: fullName, email, password, profileImageUrl });
      const { token } = response.data;
      if (token) {
        localStorage.setItem("token", token); updateUser(response.data);
        if (cardRef.current) gsap.to(cardRef.current, { scale: 1.03, opacity: 0.9, duration: 0.3, ease: "power2.out" });
        setTimeout(() => navigate("/dashboard"), 250);
      }
    } catch (error) {
      if (buttonRef.current) gsap.fromTo(buttonRef.current, { x: -6 }, { x: 6, duration: 0.06, repeat: 5, yoyo: true, ease: "power1.inOut" });
      setError(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally { setIsLoading(false); }
  };

  const switchPage = (page) => {
    if (containerRef.current) {
      gsap.to(cardRef.current, { opacity: 0, scale: 0.95, y: -20, duration: 0.25, ease: "power2.in", onComplete: () => setCurrentPage(page) });
    } else { setCurrentPage(page); }
  };

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      <div ref={glowRef} className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-orange-400/25 to-yellow-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-gradient-to-tr from-purple-400/15 to-orange-300/15 rounded-full blur-3xl pointer-events-none" />

      {FLOATING_EL.map((item, i) => (
        <div key={i} ref={(el) => (floatRefs.current[i] = el)} className={`absolute ${item.color} pointer-events-none z-0`} style={{ left: `${item.x}%`, top: `${item.y}%` }}>
          <item.Icon size={item.size} />
        </div>
      ))}

      <div ref={particlesRef} className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-orange-400/30 rounded-full" style={{ left: `${10 + i * 12}%`, bottom: "5%", opacity: 0 }} />
        ))}
      </div>

      <div ref={cardRef} className="relative z-10 w-full bg-white/60 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl p-5 sm:p-6" style={{ perspective: 1000 }}>
        {/* ===== HEADER ===== */}
        <div ref={headerRef} className="mb-4 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-400 rounded-xl shadow-lg shadow-orange-200/50 mb-2">
            <LuSparkles className="text-white text-base" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">Create Account</h3>
          <p className="text-xs text-gray-400 mt-0.5">Join us and start your journey</p>
        </div>

        <form onSubmit={handleSignUp}>
          {/* Profile Photo - smaller */}
          <div ref={profileRef} className="flex justify-center -mt-1 mb-1">
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          </div>

          {/* Full Name */}
          <div ref={nameRef} className="mb-0">
            <Input value={fullName} onChange={(e) => { setFullName(e.target.value); if (error) setError(null); setFieldErrors((p) => ({ ...p, name: "" })); }} label="Full Name" placeholder="John Doe" type="text" icon={LuUser} error={fieldErrors.name} />
          </div>

          {/* Email */}
          <div ref={emailRef} className="mb-0">
            <Input value={email} onChange={(e) => { setEmail(e.target.value); if (error) setError(null); setFieldErrors((p) => ({ ...p, email: "" })); }} label="Email Address" placeholder="john@example.com" type="text" icon={LuMail} error={fieldErrors.email} />
          </div>

          {/* Password - no duplicate eye button */}
          <div ref={passwordRef}>
            <Input value={password} onChange={(e) => { setPassword(e.target.value); if (error) setError(null); setFieldErrors((p) => ({ ...p, password: "" })); }} label="Password" placeholder="Min 8 characters" type="password" icon={LuLock} error={fieldErrors.password} />
          </div>

          {/* Error */}
          {error && (
            <div ref={errorRef} className="my-2">
              <div className="flex items-center gap-2 bg-red-50/80 backdrop-blur-sm border border-red-200/60 text-red-600 text-xs px-3 py-2 rounded-xl">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0 animate-pulse" />
                {error}
              </div>
            </div>
          )}

          {/* Submit */}
          <div ref={buttonRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="relative mt-2">
            <button type="submit" disabled={isLoading} className="relative w-full bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 hover:from-orange-600 hover:via-orange-500 hover:to-orange-600 text-white py-3 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-orange-200/60 transition-all duration-300 overflow-hidden group">
              <div ref={shineRef} className="absolute inset-0 -skew-x-12 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <span className="absolute inset-0 rounded-xl border-2 border-white/20 animate-ping opacity-20" />
              {isLoading ? (
                <span className="flex items-center justify-center gap-2 relative z-10">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  <span>Creating account...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2 relative z-10">
                  SIGN UP
                  <LuArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              )}
            </button>
          </div>

          {/* Switch */}
          <div ref={switchRef} className="text-center mt-3 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Already have an account?{" "}
              <button type="button" className="text-orange-500 font-semibold hover:text-orange-600 transition-colors relative inline-flex items-center gap-1 group" onClick={() => switchPage("login")}>
                Login
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;