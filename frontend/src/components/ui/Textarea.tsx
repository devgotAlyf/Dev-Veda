import React, { forwardRef, useState } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, maxLength, onChange, className = '', ...props }, ref) => {
    const [count, setCount] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCount(e.target.value.length);
      if (onChange) onChange(e);
    };

    return (
      <div className="flex flex-col mb-4">
        <label className="font-serif text-xs uppercase tracking-widest font-bold text-navy mb-1 flex justify-between">
          <span>{label}</span>
          {maxLength && <span className="text-muted font-sans font-normal text-[10px] tracking-normal">{count}/{maxLength}</span>}
        </label>
        <textarea
          ref={ref}
          onChange={handleChange}
          maxLength={maxLength}
          className={`bg-cream-100 border rounded-md px-4 py-3 text-ink placeholder:text-muted focus:ring-2 focus:ring-amber focus:ring-offset-2 focus:ring-offset-cream outline-none transition-all resize-y min-h-[100px] ${
            error ? 'border-rose text-rose focus:ring-rose' : 'border-ink/12 focus:border-amber'
          } ${className}`}
          {...props}
        />
        {error && <span className="text-sm text-rose mt-1">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
