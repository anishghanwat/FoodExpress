export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-white/10 text-white/70 border border-white/15',
    success: 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30',
    warning: 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30',
    error: 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30',
    primary: 'bg-[#FF6B35]/20 text-[#FF6B35] border border-[#FF6B35]/30',
    secondary: 'bg-[#1e3a5f]/40 text-blue-300 border border-blue-500/30'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
