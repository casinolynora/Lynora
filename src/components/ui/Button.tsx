import { cn } from "@/lib/utils/format";

type ButtonBaseProps = {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
};

type ButtonAsButton = ButtonBaseProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & { href?: never };
type ButtonAsLink = ButtonBaseProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variants = {
  primary: "gradient-primary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5",
  secondary: "bg-surface text-foreground border border-border hover:bg-surface-elevated hover:border-primary/30",
  outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
  ghost: "text-muted hover:text-foreground hover:bg-surface-elevated",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed",
    variants[variant],
    sizes[size],
    className,
  );

  if ("href" in props && props.href) {
    const { href, ...anchorProps } = props;
    return (
      <a href={href} className={classes} {...anchorProps}>
        {props.children}
      </a>
    );
  }

  const { ...buttonProps } = props as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} {...buttonProps}>
      {props.children}
    </button>
  );
}
