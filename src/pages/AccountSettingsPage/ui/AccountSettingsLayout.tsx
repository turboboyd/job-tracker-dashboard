import React from "react";

import { PageHeader, PageShell } from "src/shared/ui";

import { SettingsSidebar } from "./SettingsSidebar";

type Props = {
  title: string;
  subtitle: string;
  content: React.ReactNode;
};

export function AccountSettingsLayout({ title, subtitle, content }: Props) {
  return (
    <PageShell className="space-y-6">
      <PageHeader title={title} subtitle={subtitle} right={null} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <SettingsSidebar />
        <div className="min-w-0">{content}</div>
      </div>
    </PageShell>
  );
}
