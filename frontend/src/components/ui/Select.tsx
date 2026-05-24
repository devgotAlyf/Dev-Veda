import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col mb-4">
        <label className="font-serif text-xs uppercase tracking-widest font-bold text-navy mb-1">
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            className={`appearance-none w-full bg-cream-100 border rounded-md px-4 py-3 pr-10 text-ink focus:ring-2 focus:ring-amber focus:ring-offset-2 focus:ring-offset-cream outline-none transition-all ${
              error ? 'border-rose text-rose focus:ring-rose' : 'border-ink/12 focus:border-amber'
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-ink/50">
            <ChevronDown size={18} />
          </div>
        </div>
        {error && <span className="text-sm text-rose mt-1">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
