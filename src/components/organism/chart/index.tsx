("use client");
import { type ChartConfig, ChartContainer } from "../../ui/chart";
import { Line, LineChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

export function MyChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[60px] w-120">
      <LineChart accessibilityLayer data={chartData} className="border-2">
        <CartesianGrid strokeWidth={2} />
        <XAxis
          dataKey={"month"}
          tickLine={true}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <Line dataKey="desktop" fill="var(--color-desktop)" strokeWidth={2} />
      </LineChart>
    </ChartContainer>
  );
}
