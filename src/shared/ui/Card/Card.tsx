import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

import { classNames } from "src/shared/lib";

const cardVariants = cva(
  ["border border-border bg-card text-card-foreground", "shadow-[var(--shadow-sm)]"].join(" "),
  {
    variants: {
      radius: { md: "rounded-md", lg: "rounded-lg", xl: "rounded-2xl" },
      padding: { none: "p-0", sm: "p-4", md: "p-6" },
    },
    defaultVariants: { radius: "xl", padding: "md" },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, radius, padding, ...props }, ref) => (
    <div ref={ref} className={classNames(cardVariants({ radius, padding }), className)} {...props} />
  )
);
Card.displayName = "Card";
