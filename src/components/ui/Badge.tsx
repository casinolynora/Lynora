import { cn } from "@/lib/utils/format";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info" | "brand" | "outline";
  size?: "sm" | "md";
  className?: string;
};

const variantStyles = {
  default: "bg-slate-100 text-slate-600 border border-slate-200",
  primary: "bg-brand-50 text-brand-700 border border-brand-200",
  brand: "bg-brand-800 text-white",
  success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border border-amber-200",
  danger: "bg-red-50 text-red-700 border border-red-200",
  info: "bg-blue-50 text-blue-700 border border-blue-200",
  outline: "bg-transparent text-muted border border-border",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

export function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-[var(--radius-full)] whitespace-nowrap",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
