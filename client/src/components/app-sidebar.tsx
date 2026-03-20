"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavMain } from "@/features/dashboard/components/sidebar/nav-main";
import { NavUser } from "@/features/dashboard/components/sidebar/nav-user";
import Image from "next/image";
import { PanelLeft } from "lucide-react";
import dollar from "../../public/assets/images/dollar.png";
import { MainNavigation } from "@/config/navigation";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "",
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
<<<<<<< HEAD
=======
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

>>>>>>> feat/dashboard
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={
                <a href="/dashboard">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground ">
                    <Image src={dollar} alt="logo" className="h-7 w-7 " />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium">Finance Tracker</span>
                    <span className="">v1.0.0</span>
                  </div>
                </a>
              }
            ></SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={MainNavigation} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
