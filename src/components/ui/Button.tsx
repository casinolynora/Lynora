import { cn } from "@/lib/utils/format";
import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "brand";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  target?: string;
  rel?: string;
};

const variants = {
  primary: "bg-brand-800 text-white hover:bg-brand-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
  brand: "gradient-brand text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
  secondary: "bg-surface text-foreground border border-border hover:bg-surface-hover hover:border-slate-300 shadow-xs hover:shadow-sm",
  outline: "border-2 border-brand-800 text-brand-800 hover:bg-brand-800 hover:text-white",
  ghost: "text-muted hover:text-foreground hover:bg-surface-hover",
};

const sizes = {
  sm: "px-4 py-2 text-sm gap-1.5",
  md: "px-5 py-2.5 text-sm gap-2",
  lg: "px-7 py-3.5 text-base gap-2.5",
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  disabled,
  type = "button",
  onClick,
  target,
  rel,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center font-semibold rounded-[var(--radius-md)] transition-all duration-200 ease-out whitespace-nowrap",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400",
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    disabled && "opacity-50 pointer-events-none",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes} target={target} rel={rel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
