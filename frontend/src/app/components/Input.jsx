export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2.5 bg-white/7 border border-white/15 text-white placeholder-white/30 rounded-lg focus:ring-2 focus:ring-[#FF6B35]/50 focus:border-[#FF6B35]/60 outline-none transition-all ${error ? 'border-[#EF4444]/60' : ''
          } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-[#EF4444]">{error}</p>
      )}
    </div>
  );
}
