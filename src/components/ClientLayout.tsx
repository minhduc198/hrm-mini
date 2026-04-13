"use client";
import React from "react";
import { SidebarInset, SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import Header from "./Header";
import { useSidebarControl } from "@/hooks/use-sidebar";
import { useRoleGuard } from "@/hooks/use-role-guard";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useRoleGuard();
  const { isPinned, setIsPinned } = useSidebarControl();


  return (
    <SidebarProvider
      open={isPinned}
      onOpenChange={setIsPinned}
      style={
        {
          "--sidebar-width": isPinned ? "290px" : "80px",
          "--sidebar-width-icon": "80px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />

      <SidebarInset className="min-w-0 flex flex-col h-screen overflow-y-auto bg-page text-base scroll-smooth">
        <Header />
        <main className="w-full flex-1 min-w-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
