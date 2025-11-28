"use client";

import { SessionProvider } from "next-auth/react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/features/sidebar/app-sidebar";

export function DashboardLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <SessionProvider session={session}>
      <SidebarProvider>
        <div className="flex h-screen">
          <AppSidebar />
          <main className="flex-1 overflow-auto">
            <div className="p-4 md:p-6">{children}</div>
          </main>
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}
