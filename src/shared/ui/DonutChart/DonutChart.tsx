import { AnimatePresence, motion, useMotionValue, animate } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";

type Slice = {
  label: string;
  value: number;
  className: string; // tailwind stroke class
};

type Props = {
  title?: string;
  totalLabel?: string;
  centerTop: string;
  centerBottom: string;
  slices: Slice[];
  size?: number;
  stroke?: number;

  animateOnMount?: boolean;
  drawDuration?: number;
  stagger?: number;

  /** gap between segments along circumference (px) */
  gapPx?: number;

  /** invisible hover stroke extra width */
  hitSlop?: number;

  /** padding around svg so hover/glow won't clip */
  padPx?: number;

  /**
   * If true: z-order is controlled by slices[] order (default).
   * If false: z-order follows arc order.
   */
  zOrderBySlices?: boolean;
};

type Segment = Slice & {
  idx: number; // stable id in arc order
  frac: number;
  rawDash: number;
  visibleDash: number;
  dasharray: string;
  dashoffset: number;

  // base layer priority (bigger = closer to top). Derived from slices[] order
  baseZ: number;
};

export function DonutChart({
  title = "Applications",
  totalLabel = "Total",
  centerTop,
  centerBottom,
  slices,
  size = 180,
  stroke = 14,
  animateOnMount = true,
  drawDuration = 0.9,
  stagger = 0.12,
  gapPx = 6,
  hitSlop = 10,
  padPx,
  zOrderBySlices = true,
}: Props) {
  const pad = padPx ?? Math.ceil(hitSlop / 2 + 10);

  const outer = size + pad * 2;
  const cx = pad + size / 2;
  const cy = pad + size / 2;

  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const total = useMemo(
    () => slices.reduce((acc, s) => acc + (s.value > 0 ? s.value : 0), 0),
    [slices]
  );

  const hasData = total > 0;

  // baseZ map from slices[] order:
  // later in slices[] => higher baseZ => drawn later => visually on top.
  const baseZByLabel = useMemo(() => {
    const m = new Map<string, number>();
    slices.forEach((s, i) => m.set(s.label, i));
    return m;
  }, [slices]);

  // Build segments in ARC order (clockwise) using slices order (filtered by non-zero)
  const segmentsArc = useMemo<Segment[]>(() => {
    const nonZero = slices.filter((s) => s.value > 0);

    let offsetAcc = 0;
    const startFromTop = circumference * 0.25;

    return nonZero.map((s, arcIdx) => {
      const frac = total > 0 ? s.value / total : 0;
      const rawDash = Math.max(0, frac * circumference);

      // reduce visible dash to create a small gap between segments
      const visibleDash = Math.max(0, rawDash - gapPx);
      const dasharray = `${visibleDash} ${Math.max(0, circumference - visibleDash)}`;

      // shift slightly to center the gap
      const dashoffset = startFromTop - offsetAcc + gapPx / 2;
      offsetAcc += rawDash;

      const baseZ = baseZByLabel.get(s.label) ?? 0;

      return {
        ...s,
        idx: arcIdx,
        frac,
        rawDash,
        visibleDash,
        dasharray,
        dashoffset,
        baseZ,
      };
    });
  }, [slices, total, circumference, gapPx, baseZByLabel]);

  const [activeKey, setActiveKey] = useState<string | null>(null);

  const active = useMemo(() => {
    if (!activeKey) return null;
    return segmentsArc.find((s) => s.label === activeKey) ?? null;
  }, [activeKey, segmentsArc]);

  // ✅ Z-order:
  // 1) Decide base order (by slices[] OR by arc order)
  // 2) Move active segment to the very end (top-most)
  const segmentsForRender = useMemo(() => {
    const base = zOrderBySlices
      ? [...segmentsArc].sort((a, b) => a.baseZ - b.baseZ) // bottom -> top
      : [...segmentsArc]; // arc order as-is

    if (!activeKey) return base;

    const activeSeg = base.find((s) => s.label === activeKey);
    if (!activeSeg) return base;

    const rest = base.filter((s) => s.label !== activeKey);
    return [...rest, activeSeg]; // active drawn last => top
  }, [segmentsArc, activeKey, zOrderBySlices]);

  const centerTopMaybeNumber = toNumberOrNull(centerTop);

  return (
    <div className="w-full">
      <div className="text-sm font-semibold text-foreground">{title}</div>

      <div className="mt-3 flex items-center gap-5">
        <motion.div
          className="relative shrink-0"
          style={{ width: outer, height: outer }}
          initial={animateOnMount ? { opacity: 0, scale: 0.96 } : undefined}
          animate={animateOnMount ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <svg width={outer} height={outer} viewBox={`0 0 ${outer} ${outer}`}>
            <defs>
              <filter id="donutGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* background ring */}
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="transparent"
              className="stroke-muted"
              strokeWidth={stroke}
              vectorEffect="non-scaling-stroke"
            />

            {hasData ? (
              segmentsForRender.map((seg) => {
                const isActive = activeKey === seg.label;

                const initialDasharray = `0 ${circumference}`;
                const targetDasharray = seg.dasharray;

                return (
                  <g key={`seg-${seg.label}`}>
                    {/* HIT RING (transparent, captures hover precisely even when segments overlap) */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={radius}
                      fill="transparent"
                      stroke="transparent"
                      strokeWidth={stroke + hitSlop}
                      strokeLinecap="butt"
                      strokeDasharray={seg.dasharray}
                      strokeDashoffset={seg.dashoffset}
                      vectorEffect="non-scaling-stroke"
                      style={{ pointerEvents: "stroke", cursor: "pointer" }}
                      tabIndex={0}
                      role="img"
                      aria-label={`${seg.label}: ${seg.value}`}
                      onMouseEnter={() => setActiveKey(seg.label)}
                      onMouseLeave={() => setActiveKey(null)}
                      onFocus={() => setActiveKey(seg.label)}
                      onBlur={() => setActiveKey(null)}
                    />

                    {/* VISIBLE SEGMENT */}
                    <motion.circle
                      cx={cx}
                      cy={cy}
                      r={radius}
                      fill="transparent"
                      strokeLinecap="round"
                      className={seg.className}
                      strokeDashoffset={seg.dashoffset}
                      vectorEffect="non-scaling-stroke"
                      style={{ pointerEvents: "none", transformOrigin: "50% 50%" }}
                      initial={
                        animateOnMount
                          ? {
                              strokeDasharray: initialDasharray,
                              opacity: 0.92,
                              strokeWidth: stroke,
                              scale: 1,
                            }
                          : undefined
                      }
                      animate={{
                        strokeDasharray: targetDasharray,

                        // focus effect (now safe because z-order is deterministic)
                        opacity: isActive ? 1 : activeKey ? 0.62 : 1,
                        scale: isActive ? 1.012 : 1,
                        strokeWidth: isActive ? stroke + 2 : stroke,
                        filter: isActive ? "url(#donutGlow)" : "none",
                      }}
                      transition={{
                        strokeDasharray: {
                          duration: drawDuration,
                          delay: seg.baseZ * stagger, // stagger by base order looks nicer
                          ease: [0.2, 0.8, 0.2, 1],
                        },
                        opacity: { duration: 0.15, ease: "easeOut" },
                        scale: { duration: 0.16, ease: [0.2, 0.8, 0.2, 1] },
                        strokeWidth: { duration: 0.14, ease: "easeOut" },
                      }}
                    />
                  </g>
                );
              })
            ) : (
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="transparent"
                className="stroke-border"
                strokeWidth={stroke}
                strokeDasharray={`2 6`}
                vectorEffect="non-scaling-stroke"
              />
            )}
          </svg>

          {/* Center labels */}
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="text-2xl font-semibold text-foreground leading-none">
                {centerTopMaybeNumber == null ? centerTop : <AnimatedNumber value={centerTopMaybeNumber} />}
              </div>

              <div className="mt-1 text-xs text-muted-foreground">{centerBottom}</div>

              <AnimatePresence>
                {active && (
                  <motion.div
                    className="mt-3 inline-flex max-w-[160px] flex-col rounded-lg border border-border bg-background/70 px-2 py-1 text-[11px] text-foreground shadow-sm backdrop-blur"
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className={["h-2 w-2 rounded-full", dotClassFromStroke(active.className)].join(" ")} />
                      <span className="truncate font-medium">{active.label}</span>
                    </div>
                    <div className="mt-0.5 text-center text-muted-foreground">
                      {active.value} • {Math.round(active.frac * 100)}%
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Legend */}
        <div className="min-w-0 flex-1 space-y-2">
          {slices.map((s, idx) => {
            const isLegendActive = active?.label === s.label && s.value > 0;

            return (
              <div
                key={s.label}
                className={[
                  "flex items-center justify-between gap-3 rounded-md px-2 py-1 transition-colors",
                  isLegendActive ? "bg-muted/50" : "",
                ].join(" ")}
                onMouseEnter={() => setActiveKey(s.value > 0 ? s.label : null)}
                onMouseLeave={() => setActiveKey(null)}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className={["h-2.5 w-2.5 rounded-full", dotClassFromStroke(s.className)].join(" ")} />
                  <span className="truncate text-sm text-foreground">{s.label}</span>
                </div>

                <motion.span
                  className="text-sm text-muted-foreground"
                  initial={animateOnMount ? { opacity: 0, y: 2 } : undefined}
                  animate={animateOnMount ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.25, delay: idx * 0.04 }}
                >
                  {s.value}
                </motion.span>
              </div>
            );
          })}

          <div className="pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{totalLabel}</span>
              <span className="text-xs text-muted-foreground">{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(mv, value, {
      duration: 0.7,
      ease: [0.2, 0.8, 0.2, 1],
    });

    const unsub = mv.on("change", (latest) => setDisplay(Math.round(latest)));
    return () => {
      unsub();
      controls.stop();
    };
  }, [value, mv]);

  return <span>{display}</span>;
}

function toNumberOrNull(s: string) {
  const n = Number(String(s).trim());
  return Number.isFinite(n) ? n : null;
}

function dotClassFromStroke(strokeClass: string) {
  if (strokeClass.includes("stroke-blue")) return "bg-blue-500";
  if (strokeClass.includes("stroke-amber")) return "bg-amber-500";
  if (strokeClass.includes("stroke-purple")) return "bg-purple-500";
  if (strokeClass.includes("stroke-red")) return "bg-red-500";
  if (strokeClass.includes("stroke-emerald")) return "bg-emerald-500";
  return "bg-foreground";
}
