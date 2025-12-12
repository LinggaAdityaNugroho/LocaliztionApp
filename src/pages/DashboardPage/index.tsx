import { DashboardCard } from "../../components/organism/Dashboard";
import { MyChart } from "../../components/organism/chart";
// import { MapLab } from "../../components/organism/Map/Map";
export function Dashboard() {
  return (
    <main className="w-full">
      <div className="flex flex-col flex-1 gap-4 p-8">
        <div className="grid md:grid-cols-3 gap-4">
          <DashboardCard />
          <DashboardCard />
          <DashboardCard />
        </div>
        <MyChart />
      </div>
    </main>
  );
}
