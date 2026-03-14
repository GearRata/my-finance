"use client";

import * as React from "react";
import { IconLayoutDashboard } from "@tabler/icons-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import Image from "next/image";
import { PanelLeft } from "lucide-react";
import dollar from "../../../../../public/assets/images/dollar.png";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    { title: "Overview", url: "#", icon: IconLayoutDashboard },
    { title: "Transactions", url: "#", icon: IconLayoutDashboard },
    { title: "Goals", url: "#", icon: IconLayoutDashboard },
    { title: "Monthly Summary", url: "#", icon: IconLayoutDashboard },
    { title: "Settings", url: "#", icon: IconLayoutDashboard },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-16 justify-center">
        <div className="flex items-center gap-3  w-full">
          {/* ตอน Collapsed: โลโก้ hover แล้วเห็น toggle button */}
          {isCollapsed ? (
            <div className="relative h-8 w-8 shrink-0 group">
              <Image
                src={dollar}
                alt="logo"
                className="h-8 w-8 rounded-md object-cover"
              />
              <button
                onClick={toggleSidebar}
                className="absolute inset-0 flex items-center justify-center bg-accent rounded-md opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
              >
                <PanelLeft className="h-4 w-4 text-foreground" />
              </button>
            </div>
          ) : (
            /* ตอน Expanded: โลโก้ + ชื่อ + trigger ขวาสุด */
            <>
              <div className="flex items-center gap-3 min-w-0">
                <Image
                  src={dollar}
                  alt="logo"
                  className="h-8 w-8 rounded-md object-cover shrink-0"
                />
                <span className="font-semibold tracking-tight truncate">
                  Finance Tracker
                </span>
              </div>
              <button
                onClick={toggleSidebar}
                className="ml-auto h-8 w-8 flex items-center justify-center hover:bg-accent rounded-lg transition-colors focus:outline-none shrink-0"
              >
                <PanelLeft className="h-4 w-4 text-muted-foreground" />
              </button>
            </>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
