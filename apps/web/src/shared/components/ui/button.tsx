import React from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  iconRight,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-40 select-none";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-yellow-400 text-zinc-950 hover:bg-yellow-300 active:bg-yellow-500 active:scale-[0.98]",
    secondary:
      "bg-zinc-800 text-zinc-100 border border-zinc-700 hover:bg-zinc-700 active:scale-[0.98]",
    ghost:
      "bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 active:scale-[0.98]",
    danger:
      "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 active:scale-[0.98]",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-xs gap-1.5",
    md: "h-9 px-4 text-sm",
    lg: "h-11 px-6 text-base",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
      {!loading && iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
}
