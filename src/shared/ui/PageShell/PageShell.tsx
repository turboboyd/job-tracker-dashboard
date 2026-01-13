import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { classNames } from "src/shared/lib";

const pageShellVariants = cva("w-full", {
  variants: {
    paddingX: {
      none: "px-0",
      sm: "px-4",     
      md: "px-6",     
    },
    paddingY: {
      none: "py-0",
      sm: "py-4",
      md: "py-6",
    },
  },
  defaultVariants: {
    paddingX: "md",
    paddingY: "sm",
  },
});

export interface PageShellProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pageShellVariants> {}

export const PageShell = React.forwardRef<HTMLDivElement, PageShellProps>(
  ({ className, paddingX, paddingY, ...props }, ref) => (
    <div
      ref={ref}
      className={classNames(pageShellVariants({ paddingX, paddingY }), className)}
      {...props}
    />
  )
);

PageShell.displayName = "PageShell";
