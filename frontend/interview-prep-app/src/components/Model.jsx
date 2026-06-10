import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { LuX } from "react-icons/lu";

const Model = ({ children, isOpen, onClose, title, hideHeader }) => {
  const closeRef = useRef(null);

  useEffect(() => {
    if (closeRef.current && isOpen) {
      gsap.fromTo(
        closeRef.current,
        { opacity: 0, rotation: -90, scale: 0.5 },
        { opacity: 1, rotation: 0, scale: 1, duration: 0.5, delay: 0.4, ease: "elastic.out(1, 0.6)" }
      );

    
      closeRef.current.addEventListener("mouseenter", () => {
        gsap.to(closeRef.current, {
          rotation: 90,
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out",
        });
      });
      closeRef.current.addEventListener("mouseleave", () => {
        gsap.to(closeRef.current, {
          rotation: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative flex flex-col bg-white shadow-2xl rounded-2xl overflow-hidden w-[95%] max-w-lg">
        {!hideHeader && (
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              {title}
            </h3>
          </div>
        )}

        <button
          ref={closeRef}
          type="button"
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-orange-50 hover:text-orange-500 transition-colors duration-200 text-gray-400 shadow-sm border border-gray-100 z-20"
          onClick={onClose}
        >
          <LuX size={16} />
        </button>

        <div className="px-7 py-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Model;