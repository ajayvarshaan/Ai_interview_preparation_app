import React, { useState, useRef } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, label, placeholder, type, icon: Icon, error }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  return (
    <div className="w-full mb-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
          {label}
        </label>
      )}

      <div className="relative group">
        {Icon && (
          <div
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 z-10 transition-colors duration-300 ${
              isFocused || value ? "text-orange-500" : "text-gray-400"
            }`}
          >
            <Icon size={16} />
          </div>
        )}

        <input
          ref={inputRef}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full
            px-4 py-3
            ${Icon ? "pl-11" : "pl-4"}
            ${type === "password" ? "pr-11" : "pr-4"}
            text-sm
            border-2 rounded-xl
            transition-all duration-300
            outline-none
            bg-white
            ${
              error
                ? "border-red-300 focus:ring-red-400 focus:border-red-400"
                : isFocused
                ? "border-orange-400 ring-2 ring-orange-100"
                : "border-gray-200 hover:border-gray-300"
            }
          `}
          autoComplete={type === "password" ? "current-password" : "email"}
        />

        {/* Focus glow effect */}
        <div
          className={`absolute inset-0 rounded-xl transition-opacity duration-300 pointer-events-none ${
            isFocused ? "opacity-100" : "opacity-0"
          }`}
          style={{
            boxShadow: "0 0 0 4px rgba(249, 115, 22, 0.08)",
          }}
        />

        {type === "password" && (
          <button
            type="button"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <FaRegEyeSlash size={16} />
            ) : (
              <FaRegEye size={16} />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-1.5 ml-1 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-500 rounded-full inline-block" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;