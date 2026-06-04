import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse space-y-4 w-full">
      {/* Title */}
      <div className="h-5 bg-gray-200 rounded-md w-2/3"></div>

      {/* Paragraph lines */}
      <div className="space-y-2">
        <div className="h-3.5 bg-gray-200 rounded-md w-full"></div>
        <div className="h-3.5 bg-gray-200 rounded-md w-full"></div>
        <div className="h-3.5 bg-gray-200 rounded-md w-4/5"></div>
      </div>

      {/* Bullet points */}
      <div className="space-y-2 pl-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-200 flex-shrink-0"></div>
          <div className="h-3.5 bg-gray-200 rounded-md w-full"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-200 flex-shrink-0"></div>
          <div className="h-3.5 bg-gray-200 rounded-md w-5/6"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-200 flex-shrink-0"></div>
          <div className="h-3.5 bg-gray-200 rounded-md w-4/5"></div>
        </div>
      </div>

      {/* Code block */}
      <div className="rounded-lg overflow-hidden border border-gray-200">
        <div className="h-8 bg-gray-200 w-full"></div>
        <div className="bg-gray-100 p-4 space-y-2">
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>

      {/* More lines */}
      <div className="space-y-2">
        <div className="h-3.5 bg-gray-200 rounded-md w-full"></div>
        <div className="h-3.5 bg-gray-200 rounded-md w-3/4"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
