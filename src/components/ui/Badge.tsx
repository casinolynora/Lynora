import { cn } from "@/lib/utils/format";

type BadgeProps = {
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
};

const badgeVariants = {
  default: "bg-gray-100 text-gray-700",
  primary: "bg-purple-100 text-purple-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
};

export function Badge({ variant = "default", size = "sm", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        badgeVariants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
