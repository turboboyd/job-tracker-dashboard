import React from "react";

import { Card } from "src/shared/ui/Card/Card";

type Props = {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
};

export function KpiCard({ title, value, icon }: Props) {
  return (
    <Card padding="md" radius="xl" className="flex items-center justify-between">
      <div>
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="mt-1 text-2xl font-semibold text-foreground">{value}</div>
      </div>

      {icon ? (
        <div className="grid h-12 w-12 place-items-center rounded-full bg-muted">{icon}</div>
      ) : null}
    </Card>
  );
}
