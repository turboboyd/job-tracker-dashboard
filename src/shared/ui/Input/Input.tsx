import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { classNames } from "src/shared/lib";

const inputVariants = cva(
  [
    "flex w-full",
    "border border-border",
    "bg-card text-sm text-card-foreground",
    "placeholder:text-muted-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "transition-colors",
  ].join(" "),
  {
    variants: {
      size: {
        md: "h-10 px-3",
      },

      state: {
        default: "",
        error: "border-red-500 focus-visible:ring-red-500",
      },
      shape: {
        md: "rounded-md",
        lg: "rounded-lg",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      size: "md",
      state: "default",
      shape: "md",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, state, shape, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={classNames(inputVariants({ size, state, shape }), className)}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
