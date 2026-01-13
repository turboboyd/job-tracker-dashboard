import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

import { classNames } from "src/shared/lib";

const cardButtonVariants = cva(
  [
    "block w-full text-left",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border",
    "disabled:pointer-events-none disabled:opacity-50",
    "transition",
    "select-none",
  ].join(" "),
  {
    variants: {
      effect: {
        none: "",
        scale: "transition-transform hover:scale-[1.01] active:scale-[0.99]",
        lift: "hover:shadow-[var(--shadow-md)] active:shadow-[var(--shadow-sm)]",
        scaleLift:
          "transition-all hover:scale-[1.01] active:scale-[0.99] hover:shadow-[var(--shadow-md)]",
      },
      radius: {
        none: "",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
      },
    },
    defaultVariants: {
      effect: "scaleLift",
      radius: "xl",
    },
  }
);

export interface CardButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof cardButtonVariants> {
  asChild?: boolean;
}

export const CardButton = React.forwardRef<HTMLButtonElement, CardButtonProps>(
  ({ className, effect, radius, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : type ?? "button"}
        className={classNames(cardButtonVariants({ effect, radius }), className)}
        {...props}
      />
    );
  }
);

CardButton.displayName = "CardButton";
