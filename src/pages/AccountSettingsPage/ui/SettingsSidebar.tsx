import {
  Bell,
  ShieldAlert,
  SlidersHorizontal,
  User,
  ChevronRight,
} from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

import {
  AppRoutes,
  RoutePath,
} from "src/app/providers/router/routeConfig/routeConfig";
import { Card } from "src/shared/ui/Card/Card";
import { SectionHeader } from "src/shared/ui/PageHeaders/PageHeaders";

type Item = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: "default" | "danger";
  hint?: string;
};

const items: Item[] = [
  {
    to: RoutePath[AppRoutes.SETTINGS_PROFILE],
    label: "Profile",
    icon: User,
  },
  {
    to: RoutePath[AppRoutes.SETTINGS_NOTIFICATIONS],
    label: "Notifications",
    icon: Bell,
  },
  {
    to: RoutePath[AppRoutes.SETTINGS_PIPELINE_STATUSES],
    label: "Pipeline / Statuses",
    icon: SlidersHorizontal,
  },
  {
    to: RoutePath[AppRoutes.SETTINGS_DANGER_ZONE],
    label: "Danger Zone",
    icon: ShieldAlert,
    variant: "danger",
    hint: "Sensitive actions",
  },
];

function baseItemClass(isActive: boolean) {
  return [
    "group flex items-center justify-between gap-2",
    "rounded-md px-sm py-2",
    "border border-transparent",
    "transition duration-normal ease-in-out",
    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
    isActive
      ? "bg-muted text-foreground"
      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
  ].join(" ");
}

function leftBlockClass(isActive: boolean) {
  return [
    "flex items-center gap-2 min-w-0",
    isActive ? "text-foreground" : "",
  ].join(" ");
}

function iconClass(isActive: boolean, variant: Item["variant"]) {
  const base = "h-4 w-4 shrink-0 transition duration-normal ease-in-out";
  if (variant === "danger") {
    return isActive
      ? `${base} text-destructive`
      : `${base} text-muted-foreground group-hover:text-destructive`;
  }
  return isActive
    ? `${base} text-foreground`
    : `${base} text-muted-foreground group-hover:text-foreground`;
}

function labelClass(variant: Item["variant"]) {
  const base = "truncate text-sm font-medium";
  if (variant === "danger") return `${base}`;
  return base;
}

function hintClass() {
  return "mt-0.5 truncate text-xs text-muted-foreground";
}

function chevronClass(isActive: boolean) {
  return [
    "h-4 w-4 shrink-0",
    "transition duration-normal ease-in-out",
    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60",
  ].join(" ");
}

export function SettingsSidebar() {
  return (
    <Card padding="sm" shadow="sm" className="h-fit">
      <SectionHeader title="Settings" subtitle="Account" />

      <nav className="mt-3 flex flex-col gap-1">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => baseItemClass(isActive)}
            >
              {({ isActive }) => (
                <>
                  <div className={leftBlockClass(isActive)}>
                    <Icon className={iconClass(isActive, item.variant)} />

                    <div className="min-w-0">
                      <div
                        className={[
                          labelClass(item.variant),
                          item.variant === "danger"
                            ? isActive
                              ? "text-destructive"
                              : "group-hover:text-destructive"
                            : "",
                        ].join(" ")}
                      >
                        {item.label}
                      </div>

                      {item.hint ? (
                        <div className={hintClass()}>{item.hint}</div>
                      ) : null}
                    </div>
                  </div>

                  <ChevronRight className={chevronClass(isActive)} />
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
        Tip: use the menu to switch sections.
      </div>
    </Card>
  );
}
