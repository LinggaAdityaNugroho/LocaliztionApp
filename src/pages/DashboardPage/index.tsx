import { DashboardCard } from "../../components/organism/Dashboard";
import { MyChart } from "../../components/organism/chart";
import { MapLab } from "../../components/organism/Map/Map";

// logo loop reactbits
import LogoLoop from "../../components/LogoLoop";

// Component
import { CardReview } from "./CardReview";
// import { Button } from "../../components/ui/button";
import { ModalReview } from "./ModalReview";
import { useTheme } from "../../components/themes/themes-provider";
// techLogos
const techLogos = [
  {
    node: <CardReview />,
  },
];

export function Dashboard() {
  const { theme } = useTheme();
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
        <div className="flex flex-col justify-center items-center text-center space-y-4 py-10">
          <div className="space-y-2">
            <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-blue-600 to-indigo-400 bg-clip-text text-transparent">
              What They Say
            </h2>
            <div className="h-1.5 w-20 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl font-medium leading-relaxed">
            Hi! This is our{" "}
            <span className="text-blue-600 font-bold italic">
              final project
            </span>
            . We&apos;d love to hear your thoughts—feel free to drop a review
            below!
          </p>

          <div className="pt-4 transition-transform hover:scale-105 active:scale-95">
            <ModalReview />
          </div>
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
            fadeOutColor={theme === "dark" ? "#020617" : "#ffffff"}
            ariaLabel="Technology partners"
          />
        </div>
      </div>
    </main>
  );
}
