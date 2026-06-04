import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      {user.profileImageUrl ? (
        <img
          src={user.profileImageUrl}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover border border-gray-200"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center text-orange-600 font-semibold text-sm border border-orange-300">
          {user.name?.[0]?.toUpperCase() || "U"}
        </div>
      )}

      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-800">{user.name || user.fullName || ""}</span>

        <button
          className="text-xs text-red-500 hover:text-red-600 text-left transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfoCard;
