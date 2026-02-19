export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`bg-white/5 border border-white/10 rounded-xl overflow-hidden ${hover ? 'transition-all duration-300 hover:border-[#FF6B35]/40 hover:bg-white/8 hover:shadow-lg hover:shadow-black/30' : ''
        } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
