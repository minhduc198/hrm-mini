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
      
      <SidebarInset className="min-w-0 overflow-hidden flex flex-col min-h-screen bg-page text-base">
        <Header />
        <main className="w-full flex-1 min-w-0 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
