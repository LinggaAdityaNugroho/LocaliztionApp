import { Box, AlertTriangle } from "lucide-react";

export const StockBadge = ({ jumlah }: { jumlah: number }) => {
  const isLow = jumlah <= 5;
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold border ${
        isLow
          ? "bg-red-50 text-red-700 border-red-200"
          : "bg-emerald-50 text-emerald-700 border-emerald-200"
      }`}
    >
      {isLow ? <AlertTriangle size={14} /> : <Box size={14} />}
      <span>{jumlah} Unit</span>
    </div>
  );
};
