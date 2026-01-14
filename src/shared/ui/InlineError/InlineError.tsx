import React from "react";

type Props = { message: string };

export function InlineError({ message }: Props) {
  return (
    <div className="rounded-xl border border-border bg-background p-3 text-sm text-foreground">
      {message}
    </div>
  );
}
