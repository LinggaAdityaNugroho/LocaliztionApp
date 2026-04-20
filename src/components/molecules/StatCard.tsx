import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number;
  icon?: ReactNode;
  color: string;
}

export const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1">
        {title}
      </p>
      <h3 className={`text-2xl font-black ${color}`}>{value}</h3>
    </div>
    <div className={`p-3 rounded-xl bg-slate-50/50 ${color}`}>{icon}</div>
  </div>
);
