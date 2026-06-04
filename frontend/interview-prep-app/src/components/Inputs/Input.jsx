import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, label, placeholder, type }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full mb-4">
      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
        {label}
      </label>

      <div className="relative">
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e)}
          className="
            w-full 
            px-3 sm:px-4 
            py-2 sm:py-2.5 
            pr-10 
            text-sm sm:text-base 
            border border-gray-300 
            rounded-lg 
            focus:outline-none 
            focus:ring-2 focus:ring-blue-500 
            focus:border-blue-500 
            transition duration-200
            bg-white
          "
        />

        {type === "password" && (
          <span
            className="
              absolute right-3 
              top-1/2 -translate-y-1/2 
              text-gray-500 
              cursor-pointer 
              hover:text-gray-700
            "
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <FaRegEye size={18} className="sm:w-5 sm:h-5" />
            ) : (
              <FaRegEyeSlash size={18} className="sm:w-5 sm:h-5" />
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;