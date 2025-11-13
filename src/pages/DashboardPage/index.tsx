import { MySidebar } from "../../components/organism/Sidebar";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
export function Dashboard() {
  return (
    <SidebarProvider>
      <MySidebar />
      <main>
        <SidebarTrigger className="fixed" />
      </main>
      <div className="flex flex-col flex-1 gap-4">
        <div className="grid gap-4 auto-rows-min md:grid-cols-3">
          <div className="bg-red-500 aspect-video rounded-xl"></div>
          <div className="bg-red-500 aspect-video rounded-xl"></div>
          <div className="bg-red-500 aspect-video rounded-xl"></div>
        </div>
        <div className="bg-red-500 aspect-video rounded-xl min-h-[100vh] flex-1 md:min-h-min"></div>
      </div>
    </SidebarProvider>
  );
}
