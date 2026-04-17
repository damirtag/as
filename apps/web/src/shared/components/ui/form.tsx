import React, { forwardRef } from "react";
import { AlertCircle } from "lucide-react";

export interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  error,
  hint,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      {label && (
        <label className="text-xs font-medium text-zinc-400 uppercase">
          {label}
          {required && <span className="text-yellow-400 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-400">
          <AlertCircle size={12} /> {error}
        </p>
      )}
      {hint && !error && <p className="text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, leftIcon, rightIcon, className = "", ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {leftIcon && <span className="absolute left-3">{leftIcon}</span>}
        <input ref={ref} className={`h-9 ${className}`} {...props} />
        {rightIcon && <span className="absolute right-3">{rightIcon}</span>}
      </div>
    );
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }
>(({ rows = 4, className = "", ...props }, ref) => (
  <textarea ref={ref} rows={rows} className={className} {...props} />
));
