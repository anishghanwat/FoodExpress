export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70',
    outline: 'border border-primary text-primary hover:bg-primary/10',
    ghost: 'text-muted-foreground hover:text-foreground hover:bg-accent',
    success: 'bg-success text-white hover:bg-success/90',
    danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
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
