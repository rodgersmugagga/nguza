import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white border border-gray-100 rounded-3xl overflow-hidden flex flex-col h-full shadow-sm">
      <div className="bg-gray-200 h-44 sm:h-52 w-full"></div>
      <div className="p-3 sm:p-4 flex flex-col gap-3 flex-1">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 w-full rounded-full"></div>
          <div className="h-4 bg-gray-200 w-2/3 rounded-full"></div>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <div className="h-3 bg-gray-200 w-3 rounded-full"></div>
          <div className="h-3 bg-gray-200 w-1/3 rounded-full"></div>
        </div>
        <div className="mt-auto pt-3 border-t border-gray-50 flex flex-col gap-2">
          <div className="h-6 bg-gray-200 w-1/2 rounded-full"></div>
          <div className="h-3 bg-gray-200 w-1/4 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

