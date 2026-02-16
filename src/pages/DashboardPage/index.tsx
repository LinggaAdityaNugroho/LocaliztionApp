import { DashboardCard } from "../../components/organism/Dashboard";
import { MyChart } from "../../components/organism/chart";
import { MapLab } from "../../components/organism/Map/Map";

// logo loop
import LogoLoop from "../../components/LogoLoop";
import { CardReview } from "./card";
import { Button } from "../../components/ui/button";

// techLogos
const techLogos = [
  {
    node: <CardReview />,
  },
];

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
        {/* logo loop */}
        <div className="flex flex-col justify-center items-center">
          <h1>Review</h1>
          <p>Hi, this is our final project and you can give a review below.</p>
          <Button>Review</Button>
        </div>
        <div className="flex flex-col gap-10">
          <LogoLoop
            logos={techLogos}
            speed={100}
            direction="left"
            logoHeight={60}
            hoverSpeed={0}
            gap={32}
            fadeOut
            fadeOutColor="#ffffff"
            ariaLabel="Technology partners"
          />

          <LogoLoop
            logos={techLogos}
            speed={100}
            direction="right"
            logoHeight={60}
            hoverSpeed={0}
            gap={32}
            fadeOut
            fadeOutColor="#ffffff"
            ariaLabel="Technology partners"
          />
        </div>
      </div>
    </main>
  );
}
