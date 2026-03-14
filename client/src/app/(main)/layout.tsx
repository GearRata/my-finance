import RootLayout from "@/app/layouts/RootLayout";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/dashboard/components/sidebar/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 z-10 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12" />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </RootLayout>
  );
}
