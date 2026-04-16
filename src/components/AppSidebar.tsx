"use client";
import { cn } from "@/lib/utils";
import { Users, CalendarDays, Clock, Shield } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Typography } from "./ui/typography";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "./ui/sidebar";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useSidebar } from "./ui/sidebar";

import { navItemsConfig } from "./sidebar-items";

export function AppSidebar() {
  const router = useRouter();
  const path = usePathname();
  const { user, hasPermission } = useAuth();
  const { setOpenMobile } = useSidebar();

  const isExactActive = (url: string) => path === url;

  const getNavItems = () => {
    return navItemsConfig.filter((item) => {
      if (!user) return false;

      const canAccessByPermission = item.permission
        ? hasPermission(item.permission)
        : false;

      const isEmployeeDefault =
        user.role === "employee" && item.isEmployeeDefault;

      const isHiddenForAdmin =
        user.role === "admin" && item.audience === "employee-only";

      const isVisible =
        (canAccessByPermission || isEmployeeDefault) && !isHiddenForAdmin;

      return isVisible;
    });
  };

  const navItems = getNavItems();

  return (
    <Sidebar collapsible="icon" className="border-r-0 !bg-primary text-white">
      <SidebarHeader className="px-4 py-5 pb-5 !bg-primary">
        <div className="flex items-center group-data-[collapsible=icon]:justify-center gap-2.5 px-1">
          <div className="w-8 h-8 rounded-lg bg-white/95 flex items-center justify-center text-primary shrink-0 ">
            <Typography
              variant="p"
              as="div"
              className="text-xs font-semibold leading-none  "
            >
              HR
            </Typography>
          </div>
          <Typography
            variant="h4"
            className="text-white text-sm font-semibold tracking-tight shrink-0  group-data-[collapsible=icon]:hidden"
          >
            MINI HRM
          </Typography>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 gap-0 !bg-primary">
        <SidebarGroup className="p-0">
          <Typography
            variant="label"
            className="text-[10px] text-white/30 px-3 pb-2 pt-1 font-semibold group-data-[collapsible=icon]:hidden"
          >
            MENU
          </Typography>

          <SidebarMenu className="gap-1">
            {navItems.map((item) => {
              const currentActive = isExactActive(item.url);
              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    onClick={() => {
                      router.push(item.url);
                      setOpenMobile(false);
                    }}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-[9px] rounded-lg text-[13px] w-full text-left transition-colors h-auto",
                      "group-data-[collapsible=icon]:!w-9 group-data-[collapsible=icon]:!h-9 group-data-[collapsible=icon]: group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-auto",
                      currentActive
                        ? "bg-white text-primary font-medium hover:bg-white hover:text-primary"
                        : "text-white hover:bg-white/[0.08] hover:text-white/85",
                    )}
                  >
                    <Icon
                      size={16}
                      strokeWidth={1.75}
                      className="flex-shrink-0"
                    />
                    <Typography
                      variant="p"
                      as="span"
                      className={cn(
                        "flex-1 font-inherit leading-normal group-data-[collapsible=icon]:hidden truncate py-0.5",
                        {
                          "text-white": !currentActive,
                        },
                      )}
                    >
                      {item.label}
                    </Typography>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
