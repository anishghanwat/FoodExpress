export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`bg-card border border-border rounded-xl overflow-hidden ${hover ? 'transition-all duration-300 hover:border-primary/40 hover:bg-accent hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/30' : ''
        } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
