export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-muted text-muted-foreground border border-border',
    success: 'bg-success/20 text-success border border-success/30',
    warning: 'bg-warning/20 text-warning border border-warning/30',
    error: 'bg-destructive/20 text-destructive border border-destructive/30',
    primary: 'bg-primary/20 text-primary border border-primary/30',
    secondary: 'bg-secondary/40 text-secondary-foreground border border-secondary/30'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
