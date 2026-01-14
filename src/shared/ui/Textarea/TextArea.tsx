import React from "react";

import { classNames } from "src/shared/lib";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  state?: "default" | "error";
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, state = "default", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={classNames(
          "min-h-[96px] w-full rounded-2xl border bg-background p-3 text-sm text-foreground",
          "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border",
          state === "error" ? "border-destructive" : "border-border",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
