import React from "react";
import { Link, type LinkProps } from "react-router-dom";

type Props = LinkProps & {
  variant?: "default" | "outline";
  size?: "md" | "lg";
  disabled?: boolean;
  className?: string;
};


export function LinkButton({
  variant = "outline",
  size = "lg",
  disabled,
  className,
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-full font-medium transition-colors " +
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  const v =
    variant === "default"
      ? "bg-primary text-primary-foreground hover:bg-primary/90"
      : "border border-border bg-background hover:bg-muted/40 text-foreground";

  const s = size === "lg" ? "h-10 px-4 text-sm" : "h-9 px-3 text-sm";

  const dis = disabled ? "pointer-events-none opacity-50" : "";

  return <Link {...props} className={[base, v, s, dis, className].filter(Boolean).join(" ")} />;
}
