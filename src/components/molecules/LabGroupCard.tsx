import { Card } from "../ui/card";
import { cn } from "../../lib/utils";
import { type LucideIcon } from "lucide-react";

interface LabGroupProps {
  name: string;
  icon: LucideIcon;
  color: string;
  onClick: () => void;
}

export const LabGroupCard = ({ name, icon, color, onClick }: LabGroupProps) => (
  <Card
    onClick={onClick}
    className={cn(
      "group cursor-pointer relative overflow-hidden border-none transition-all hover:-translate-y-2 hover:shadow-2xl",
      "h-44 flex flex-col items-center justify-center bg-linear-to-br text-white",
      color,
    )}
  >
    <div className="z-10 bg-white/20 p-4 rounded-2xl backdrop-blur-md border border-white/30 group-hover:scale-110 transition-transform">
      <i className={cn("bi text-3xl", icon)} />
    </div>
    <h3 className="z-10 mt-4 font-bold text-sm uppercase tracking-tight">
      {name}
    </h3>
    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
  </Card>
);
