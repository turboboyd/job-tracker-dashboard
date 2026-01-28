import React from "react";
import { Outlet } from "react-router-dom";

import { AppHeader, AppSidebar, useSidebar } from "src/app/widgets";
import { useAuth } from "src/shared/lib";
import { PageShell } from "src/shared/ui";

export const AppLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const sidebar = useSidebar({
    enabled: isAuthenticated,
    desktopQuery: "(min-width: 768px)",
    defaultDesktopOpen: true,
  });

  const hasSidebar = isAuthenticated;
  const shiftClass = hasSidebar && sidebar.isOpen ? "md:ml-64" : "md:ml-0";

  return (
    <div className="h-screen min-h-0 bg-background text-foreground flex flex-col overflow-hidden">
      {/* header фиксированный */}
      <div className="shrink-0">
        <AppHeader
          sidebarOpen={sidebar.isOpen}
          onToggleSidebar={sidebar.toggle}
        />
      </div>

      {hasSidebar && (
        <AppSidebar isOpen={sidebar.isOpen} onClose={sidebar.close} />
      )}

      {/* main занимает всё оставшееся место */}
      <main className="flex-1 min-h-0 overflow-hidden">
        <div
          className={[
            shiftClass,
            "h-full min-h-0",
            "transition-[margin] duration-300 ease-out",
          ].join(" ")}
        >
          {/* PageShell теперь даёт высоту вниз */}
          <PageShell
            paddingX="md"
            paddingY="sm"
            fullHeight
            layout="flexCol"
            overflow="hidden"
          >
            <Outlet />
          </PageShell>
        </div>
      </main>
    </div>
  );
};
