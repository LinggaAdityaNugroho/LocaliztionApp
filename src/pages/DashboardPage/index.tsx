import { MySidebar } from "../../components/organism/Sidebar";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import { DashboardCard } from "../../components/organism/Dashboard";
// import { MapLab } from "../../components/organism/Map/Map";
export function Dashboard() {
  return (
    <SidebarProvider>
      <MySidebar />
      <main className="w-full">
        <SidebarTrigger className="fixed" />
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid md:grid-cols-3 gap-4">
            <DashboardCard />
            <DashboardCard />
            <DashboardCard />
          </div>
          {/* <MapLab /> */}
        </div>
      </main>
    </SidebarProvider>
  );
}
