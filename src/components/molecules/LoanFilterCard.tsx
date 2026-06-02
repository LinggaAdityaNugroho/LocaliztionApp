import { CalendarRange, X } from "lucide-react";
import { Button } from "../ui/button";
import { DatePicker } from "../atoms/DatePicker";

interface LoanFilterCardProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onClear: () => void;
}

export function LoanFilterCard({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClear,
}: LoanFilterCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-white dark:bg-zinc-900 p-4 border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none rounded-none text-left w-full">
      <DatePicker
        label="Dari Tanggal:"
        value={startDate}
        placeholder="Pilih Tanggal Awal"
        onChange={onStartDateChange}
      />

      <DatePicker
        label="Sampai Tanggal:"
        value={endDate}
        placeholder="Pilih Tanggal Akhir"
        onChange={onEndDateChange}
      />

      <div>
        {startDate || endDate ? (
          <Button
            variant="brutal"
            onClick={onClear}
            className="w-full h-11 text-xs font-mono font-black gap-2 rounded-none bg-red-500 hover:bg-red-600 text-white border-2 border-zinc-950 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none transition-all  tracking-wider"
          >
            <X size={13} /> Reset Filter Waktu
          </Button>
        ) : (
          <div className="h-11 flex items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-400 dark:text-zinc-500 text-[10px] font-mono font-black tracking-widest gap-2 rounded-none ">
            <CalendarRange size={13} /> Filter Rentang Siap
          </div>
        )}
      </div>
    </div>
  );
}
