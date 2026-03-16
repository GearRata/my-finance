import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 px-4 transition-[width,height] ease-linear">
          <SidebarTrigger className="mt-3 hidden max-md:block" />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
