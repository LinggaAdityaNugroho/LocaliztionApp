import { DashboardCard } from "../../components/organism/Dashboard";
import { MyChart } from "../../components/organism/chart";
import { MapLab } from "../../components/organism/Map/Map";
export function Dashboard() {
  return (
    <main className="w-full">
      <div className="flex flex-col flex-1 gap-4 p-4 lg:p-8">
        <div className="grid md:grid-cols-3 gap-4">
          <DashboardCard />
          <DashboardCard />
          <DashboardCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MyChart />
          <MapLab />
        </div>
      </div>
    </main>
  );
}
