import React, { forwardRef } from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <label className={`flex items-center space-x-3 cursor-pointer group ${className}`}>
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            ref={ref}
            className="peer appearance-none w-5 h-5 border-2 border-ink/20 rounded-[4px] bg-cream-100 checked:bg-amber checked:border-amber focus:ring-2 focus:ring-amber focus:ring-offset-2 focus:ring-offset-cream outline-none transition-all cursor-pointer"
            {...props}
          />
          <svg
            className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 peer-checked:animate-in peer-checked:zoom-in-50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <span className="text-ink font-medium select-none group-hover:text-navy transition-colors">{label}</span>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
