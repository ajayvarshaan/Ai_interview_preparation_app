import React from 'react';
import ProfileInfoCard from '../Cards/ProfileInfoCard';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/dashboard">
          <h2 className="text-lg font-semibold text-gray-900 hover:text-orange-500 transition">
            Interview Prep AI
          </h2>
        </Link>

        <ProfileInfoCard />
      </div>
    </div>
  );
};

export default Navbar;