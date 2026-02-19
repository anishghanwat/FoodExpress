export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-muted-foreground mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2.5 bg-input border border-border text-foreground placeholder-muted-foreground rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/60 outline-none transition-all ${error ? 'border-destructive/60' : ''
          } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
