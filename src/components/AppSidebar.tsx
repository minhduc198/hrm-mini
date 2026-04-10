"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import {
  Users,
  CalendarDays,
  Clock,
  Shield,
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
  useSidebar,
} from "./ui/sidebar";


export function AppSidebar() {
  const router = useRouter();
  const path = usePathname();
  const { role, user } = useAuth();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const { setOpenMobile } = useSidebar()

  const isExactActive = (url: string) => path === url;

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getNavItems = () => {
    if (role === "admin") {
      return [
        { key: "employees", label: "Quản lý nhân viên", url: "/employee-management", icon: Users },
        { key: "leave", label: "Quản lý đơn xin nghỉ", url: "/leave/manage", icon: CalendarDays },
        { key: "attendance", label: "Quản lý chấm công", url: "/attendance/manage", icon: Clock },
        { key: "roles", label: "Quản lý phân quyền", url: "/permission-management", icon: Shield },
      ];
    }
    if (role === "delegated_admin") {
      return [
        {
          key: "employees",
          label: "Quản lý nhân viên",
          icon: Users,
          subs: [
            { key: "emp-manage", label: "Quản lý", url: "/employee-management" },
          ],
        },
        {
          key: "leave",
          label: "Quản lý đơn xin nghỉ",
          icon: CalendarDays,
          subs: [
            { key: "leave-manage", label: "Quản lý", url: "/leave/manage" },
            { key: "leave-personal", label: "Cá nhân", url: "/leave/personal" },
          ],
        },
        {
          key: "attendance",
          label: "Quản lý chấm công",
          icon: Clock,
          subs: [
            { key: "att-manage", label: "Quản lý", url: "/attendance/manage" },
            { key: "att-personal", label: "Cá nhân", url: "/attendance/personal" },
          ],
        },
      ];
    }
    return [
      { key: "attendance", label: "Chấm công", url: "/attendance/personal", icon: Clock },
      { key: "leave", label: "Xin nghỉ", url: "/leave/personal", icon: CalendarDays },
    ];
  };

  const navItems = getNavItems();

  return (
    <Sidebar collapsible="icon" className="border-r-0 !bg-primary text-white">
      <SidebarHeader className="px-4 py-5 pb-5 !bg-primary">
        <div className="flex items-center group-data-[collapsible=icon]:justify-center gap-2.5 px-1">
          <div className="w-8 h-8 rounded-lg bg-white/95 flex items-center justify-center text-primary shrink-0 ">
            <Typography variant="p" as="div" className="text-xs font-semibold leading-none  ">
              HR
            </Typography>
          </div>
          <Typography variant="h4" className="text-white text-sm font-semibold tracking-tight shrink-0  group-data-[collapsible=icon]:hidden">
            HRM
          </Typography>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 gap-0 !bg-primary">
        <SidebarGroup className="p-0">
          <Typography variant="label" className="text-[10px] text-white/30 px-3 pb-2 pt-1 font-semibold group-data-[collapsible=icon]:hidden">
            MENU
          </Typography>

          <SidebarMenu className="gap-1">
            {navItems.map((item) => {
              const hasSubs = "subs" in item;
              const anySubActive = hasSubs && item.subs?.some((s) => isExactActive(s.url));
              const currentActive = !hasSubs && "url" in item ? isExactActive(item.url) : anySubActive;
              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    onClick={() => {
                      if (hasSubs) toggleMenu(item.key);
                      else if ("url" in item) {
                        router.push(item.url);
                        setOpenMobile(false)
                      }
                    }}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-[9px] rounded-lg text-[13px] w-full text-left transition-colors h-auto",
                      "group-data-[collapsible=icon]:!w-9 group-data-[collapsible=icon]:!h-9 group-data-[collapsible=icon]: group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-auto",
                      currentActive
                        ? "bg-white text-primary font-medium hover:bg-white hover:text-primary"
                        : "text-white hover:bg-white/[0.08] hover:text-white/85"
                    )}
                  >
                    <Icon size={16} strokeWidth={1.75} className="flex-shrink-0" />
                    <Typography
                      variant="p"
                      as="span"
                      className={cn('flex-1 font-inherit leading-none group-data-[collapsible=icon]:hidden truncate', {
                        'text-white': !currentActive,
                      })}
                    >
                      {item.label}
                    </Typography>
                    {hasSubs && (
                      <span className="ml-auto flex-shrink-0 group-data-[collapsible=icon]:hidden">
                        {openMenus[item.key] ? (
                          <ChevronDown size={14} />
                        ) : (
                          <ChevronRight size={14} />
                        )}
                      </span>
                    )}
                  </SidebarMenuButton>

                  {hasSubs && openMenus[item.key] && (
                    <SidebarMenuSub className="mt-1 border-white/20 pl-4 border-l ml-5 pr-0 gap-1">
                      {item.subs?.map((sub) => {
                        const subActive = isExactActive(sub.url);
                        return (
                          <SidebarMenuSubItem key={sub.key}>
                            <SidebarMenuSubButton
                              onClick={() => {
                                router.push(sub.url);
                                setOpenMobile(false)
                              }}
                              className={cn(
                                "cursor-pointer transition-colors px-3 py-2 h-auto text-[12.5px] rounded-md text-white/55 hover:bg-white/[0.06] hover:text-white/85",
                                subActive && "bg-white/[0.1] text-white font-medium"
                              )}
                            >
                              <Typography variant="p" as="span" className={cn(' font-inherit leading-none text-white', {
                        'text-white': subActive,
                      })}>
                                {sub.label}
                              </Typography>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10 p-3 pb-4 !bg-primary gap-3 mt-auto group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:pb-3">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/[0.07] cursor-pointer transition-colors group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:justify-center">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-[11px] font-semibold text-white shrink-0">
            <Typography variant="p" as="span" className=" font-inherit leading-none">
              {user.initials}
            </Typography>
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <Typography variant="p" className="text-[13px] text-white/90 font-medium leading-none mb-0.5  truncate">
              {user.name}
            </Typography>
            <Typography variant="small" className="text-[11px] text-white/40 leading-none  truncate block">
              {role === "admin" ? "Administrator" : role === "delegated_admin" ? "Delegated Admin" : "Employee"}
            </Typography>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
