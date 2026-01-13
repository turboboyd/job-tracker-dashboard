import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "src/shared/ui/Button/Button";

type Props = {
  icon: React.ReactNode;
  title: string;
  onGo: () => void;
  done?: boolean;
  className?: string;

  /** if true, icon shakes (used on hover of Go button) */
  iconShake?: boolean;

  /** optional: allow parent to control hover without internal state */
  onGoHoverChange?: (hovered: boolean) => void;
};

export function ActionRow({
  icon,
  title,
  onGo,
  done = false,
  className,
  iconShake = false,
  onGoHoverChange,
}: Props) {
  const [localHover, setLocalHover] = useState(false);
  const hovered = onGoHoverChange ? false : localHover;

  const shouldShake = iconShake || hovered;

  return (
    <div
      className={[
        "flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3",
        className ?? "",
      ].join(" ")}
    >
      <div className="flex min-w-0 items-center gap-3">
        <motion.div
          className="shrink-0"
          animate={
            shouldShake
              ? {
                  rotate: [0, -12, 12, -10, 10, -6, 6, 0],
                  x: [0, -1, 1, -1, 1, 0],
                }
              : { rotate: 0, x: 0 }
          }
          transition={
            shouldShake
              ? {
                  duration: 0.55,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 0.25,
                }
              : { duration: 0.15 }
          }
          style={{ transformOrigin: "50% 50%" }}
        >
          {icon}
        </motion.div>

        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-foreground">{title}</div>
        </div>
      </div>

      <Button
        variant="link"
        onClick={onGo}
        className="px-0"
        disabled={done}
        onMouseEnter={() => {
          if (onGoHoverChange) onGoHoverChange(true);
          else setLocalHover(true);
        }}
        onMouseLeave={() => {
          if (onGoHoverChange) onGoHoverChange(false);
          else setLocalHover(false);
        }}
        onFocus={() => {
          if (onGoHoverChange) onGoHoverChange(true);
          else setLocalHover(true);
        }}
        onBlur={() => {
          if (onGoHoverChange) onGoHoverChange(false);
          else setLocalHover(false);
        }}
      >
        {done ? "Done" : "Go"}
      </Button>
    </div>
  );
}
