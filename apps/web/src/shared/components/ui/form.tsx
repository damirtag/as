import React, { forwardRef } from "react";
import { AlertCircle } from "lucide-react";

export interface FormFieldProps {
  label?: string;
  error?: string | null;
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
  error?: string | null;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, leftIcon, rightIcon, className = "", ...props }, ref) => {
    const leftPadding = leftIcon ? "pl-10" : "pl-3";
    const rightPadding = rightIcon ? "pr-10" : "pr-3";

    const borderColor = error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
      : "border-zinc-700 focus:border-yellow-400 focus:ring-yellow-400/20";

    return (
      <div className="relative w-full">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          className={`
            w-full h-10 rounded-xl border bg-zinc-900/60
            text-sm text-white placeholder:text-zinc-500
            outline-none transition-all focus:ring-2
            ${leftPadding} ${rightPadding} ${borderColor} ${className}
          `}
          {...props}
        />

        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
            {rightIcon}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string | null }
>(({ rows = 4, className = "", error, ...props }, ref) => {
  const borderColor = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
    : "border-zinc-700 focus:border-yellow-400 focus:ring-yellow-400/20";

  return (
    <textarea
      ref={ref}
      rows={rows}
      className={`
        w-full rounded-xl border bg-zinc-900/60 p-3
        text-sm text-white placeholder:text-zinc-500
        outline-none transition-all resize-none focus:ring-2
        ${borderColor} ${className}
      `}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";