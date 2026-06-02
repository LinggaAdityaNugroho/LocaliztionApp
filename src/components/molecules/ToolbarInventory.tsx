import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RefreshCw, Search } from "lucide-react";

interface ToolbarInventoryProps {
  globalFilter: string;
  setGlobalFilter: (v: string) => void;
  conditionFilter: string;
  setConditionFilter: (v: string) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  onRefresh: () => void;
  loading: boolean;
}

export function ToolbarInventory({
  globalFilter,
  setGlobalFilter,
  conditionFilter,
  setConditionFilter,
  pageSize,
  setPageSize,
  onRefresh,
  loading,
}: ToolbarInventoryProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-zinc-950 p-4 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-xs">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 flex-1 w-full">
        {/* Input Pencarian */}
        <div className="relative w-full md:w-64 flex items-center">
          <Search
            size={14}
            className="absolute left-3.5 text-zinc-400 dark:text-zinc-600"
          />
          <Input
            placeholder="Cari nama aset inventori..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9 pr-4 rounded-xl border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-900 bg-white dark:bg-zinc-950 font-medium text-xs h-11 w-full"
          />
        </div>

        {/* Filter Kondisi & Tombol Refresh */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <Select value={conditionFilter} onValueChange={setConditionFilter}>
            <SelectTrigger className="w-full md:w-40 rounded-xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 font-black text-xs h-11 uppercase tracking-wider">
              <SelectValue placeholder="Pilih Status" />
            </SelectTrigger>
            <SelectContent className="font-bold text-xs">
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="baik">Kondisi Baik</SelectItem>
              <SelectItem value="rusak">Kondisi Rusak</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            className="rounded-xl h-11 w-11 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-500 shrink-0"
            title="Refresh Data"
          >
            <RefreshCw
              size={14}
              className={
                loading ? "animate-spin text-zinc-900 dark:text-white" : ""
              }
            />
          </Button>
        </div>
      </div>

      {/* Kontrol Kanan: Page Size */}
      <div className="flex items-center justify-between sm:justify-end gap-3 w-full lg:w-auto border-t lg:border-t-0 pt-3 lg:pt-0 border-zinc-100 dark:border-zinc-900 shrink-0">
        <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
          Baris Per Halaman:
        </span>
        <Select
          value={`${pageSize}`}
          onValueChange={(v) => setPageSize(Number(v))}
        >
          <SelectTrigger className="w-20 rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono font-black text-xs h-11">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="font-mono text-xs font-bold">
            {[5, 10, 25, 50].map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
