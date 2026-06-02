import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// 👑 PENGETATAN INTERFACE PROPS: Memasukkan instance table dan setCurrentPage setter
interface ToolbarLaporanKerusakanProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  classFilter: string;
  setClassFilter: (value: string) => void;
  uniqueClasses: string[];
  pageSize: number;
  table: any; // Menerima instance useReactTable dari komponen utama
  setCurrentPage: (page: number) => void; // Menerima setter halaman dari page utama
}

export function ToolbarSearch({
  globalFilter,
  setGlobalFilter,
  classFilter,
  setClassFilter,
  uniqueClasses,
  pageSize,
  table,
  setCurrentPage,
}: ToolbarLaporanKerusakanProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 border-2 border-zinc-950 dark:border-zinc-800 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none w-full">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
        <Input
          placeholder="Cari data peminjaman..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-xs h-11 border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono text-xs font-black tracking-wide rounded-none shadow-none focus-visible:ring-0"
        />

        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-full sm:w-44 h-11 border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono font-black text-xs rounded-none shadow-none tracking-wide text-left">
            <SelectValue placeholder="Semua kelas" />
          </SelectTrigger>
          <SelectContent className="border-2 border-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 font-mono font-black text-xs text-zinc-800 dark:text-zinc-200 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
            <SelectItem value="all" className="cursor-pointer rounded-none">
              Semua kelas
            </SelectItem>
            {uniqueClasses.map((cls) => (
              <SelectItem
                key={cls}
                value={cls}
                className="cursor-pointer rounded-none"
              >
                {cls}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-mono font-black tracking-widest text-zinc-400 whitespace-nowrap">
          Baris per halaman
        </span>
        <Select
          value={`${pageSize}`}
          onValueChange={(v) => {
            const nextSize = Number(v);

            // 1. Eksekusi aman jika properti table berhasil di-passing masuk
            if (table) {
              table.setPageSize(nextSize);
              table.setPageIndex(0);
            }

            // 2. Reset nomor halaman eksternal pagination ke lembar pertama
            if (setCurrentPage) {
              setCurrentPage(1);
            }
          }}
        >
          <SelectTrigger className="w-20 h-11 border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono font-black text-xs rounded-none shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none tracking-wide">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-2 border-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 font-mono font-black text-xs text-zinc-800 dark:text-zinc-200 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
            {[5, 10, 25, 50].map((size) => (
              <SelectItem
                key={size}
                value={`${size}`}
                className="cursor-pointer rounded-none"
              >
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
