import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col mb-4">
        <label className="font-serif text-xs uppercase tracking-widest font-bold text-navy mb-1">
          {label}
        </label>
        <input
          ref={ref}
          className={`bg-cream-100 border rounded-md px-4 py-3 text-ink placeholder:text-muted focus:ring-2 focus:ring-amber focus:ring-offset-2 focus:ring-offset-cream outline-none transition-all ${
            error ? 'border-rose text-rose focus:ring-rose' : 'border-ink/12 focus:border-amber'
          } ${className}`}
          {...props}
        />
        {error && <span className="text-sm text-rose mt-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
