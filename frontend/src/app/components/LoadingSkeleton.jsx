export function LoadingSkeleton({ type = 'card' }) {
  if (type === 'card') {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden animate-pulse">
        <div className="h-48 bg-white/8"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-white/10 rounded w-3/4"></div>
          <div className="h-3 bg-white/8 rounded w-1/2"></div>
          <div className="flex gap-4">
            <div className="h-3 bg-white/8 rounded w-1/4"></div>
            <div className="h-3 bg-white/8 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-4 bg-white/10 rounded w-full"></div>
        <div className="h-4 bg-white/8 rounded w-5/6"></div>
        <div className="h-4 bg-white/8 rounded w-4/6"></div>
      </div>
    );
  }

  return null;
}
