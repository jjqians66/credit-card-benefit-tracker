import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="mb-4 sm:mb-6 bg-white rounded-lg sm:rounded-xl shadow-sm border border-zinc-200 overflow-hidden animate-pulse">
      <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-6 sm:w-10 sm:h-7 bg-zinc-200 rounded"></div>
          <div className="flex-1">
            <div className="h-4 bg-zinc-200 rounded w-32 mb-2"></div>
            <div className="h-3 bg-zinc-200 rounded w-20"></div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="h-3 bg-zinc-200 rounded w-16"></div>
          <div className="w-16 h-1 bg-zinc-200 rounded-full"></div>
        </div>
      </div>
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-zinc-100">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-5 bg-zinc-200 rounded-full w-12"></div>
                <div className="h-4 bg-zinc-200 rounded w-24"></div>
              </div>
              <div className="h-3 bg-zinc-200 rounded w-full max-w-xs"></div>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-zinc-200 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="mb-4 sm:mb-6 rounded-lg sm:rounded-xl border p-4 sm:p-6 bg-gradient-to-br from-zinc-900 to-zinc-800 animate-pulse">
      <div className="mb-3 sm:mb-4">
        <div className="h-4 bg-zinc-700 rounded w-32 mb-4"></div>
        <div className="flex items-baseline gap-3 mb-2">
          <div className="h-8 bg-zinc-700 rounded w-24"></div>
          <div className="h-6 bg-zinc-700 rounded w-20"></div>
        </div>
        <div className="h-3 bg-zinc-700 rounded w-32"></div>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-4 bg-zinc-700 rounded w-32"></div>
        <div className="flex-1 h-2 bg-zinc-700 rounded-full"></div>
        <div className="h-4 bg-zinc-700 rounded w-8"></div>
      </div>
    </div>
  );
};

export const LibraryCardSkeleton: React.FC = () => {
  return (
    <div className="relative p-4 sm:p-5 rounded-lg sm:rounded-xl border border-zinc-200 bg-white animate-pulse">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="w-12 h-8 bg-zinc-200 rounded"></div>
        <div className="w-6 h-6 bg-zinc-200 rounded-full"></div>
      </div>
      <div className="mb-3 sm:mb-4">
        <div className="h-5 bg-zinc-200 rounded w-32 mb-2"></div>
        <div className="h-4 bg-zinc-200 rounded w-20"></div>
      </div>
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-zinc-100">
        <div className="h-3 bg-zinc-200 rounded w-24"></div>
      </div>
    </div>
  );
};

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`${sizeClasses[size]} border-2 border-zinc-300 border-t-indigo-600 rounded-full animate-spin`}></div>
  );
};

