export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#FF6B35] text-white hover:bg-[#e55a25] active:bg-[#cc4f1f]',
    secondary: 'bg-[#1e3a5f] text-white hover:bg-[#264d7a] active:bg-[#1a3352]',
    outline: 'border border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35]/10',
    ghost: 'text-white/70 hover:text-white hover:bg-white/10',
    success: 'bg-[#10B981] text-white hover:bg-[#059669]',
    danger: 'bg-[#EF4444] text-white hover:bg-[#dc2626]'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
