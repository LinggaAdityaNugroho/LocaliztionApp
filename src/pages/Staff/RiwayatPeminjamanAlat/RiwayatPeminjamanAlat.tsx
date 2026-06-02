import { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import type { SortingState } from "@tanstack/react-table";
import { Archive, CheckCircle2, Stars, AlertTriangle } from "lucide-react";

import api from "../../../services/api";
import { getColumns } from "./columns";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

import { LoanFilterCard } from "../../../components/molecules/LoanFilterCard";
import { RiwayatPeminjamanAlatTable } from "../../../components/organism/Table/RiwayatPeminjamanAlatTable";
import { PageLayout } from "../../../layouts/PageLayout";
import { LoanPagination } from "../../../components/organism/LoanPagination";
import { Lightbox } from "../../../components/atoms/LightBox";

interface ToolbarRiwayatProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  pageSize: number;
  table: any;
  setCurrentPage: (page: number) => void;
}

export function ToolbarSearch({
  globalFilter,
  setGlobalFilter,
  statusFilter,
  setStatusFilter,
  pageSize,
  table,
  setCurrentPage,
}: ToolbarRiwayatProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 border-2 border-zinc-950 dark:border-zinc-800 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none w-full">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
        <Input
          placeholder="Cari data peminjaman..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-xs h-11 border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono text-xs font-black tracking-wide rounded-none shadow-none focus-visible:ring-0"
        />

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44 h-11 border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono font-black text-xs rounded-none shadow-none tracking-wide text-left">
            <SelectValue placeholder="Semua status" />
          </SelectTrigger>
          <SelectContent className="border-2 border-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 font-mono font-black text-xs text-zinc-800 dark:text-zinc-200 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
            <SelectItem value="all" className="cursor-pointer rounded-none">
              Semua status
            </SelectItem>
            <SelectItem value="pending" className="cursor-pointer rounded-none">
              Menunggu
            </SelectItem>
            <SelectItem value="ongoing" className="cursor-pointer rounded-none">
              Dipinjam
            </SelectItem>
            <SelectItem
              value="returned"
              className="cursor-pointer rounded-none"
            >
              Dikembalikan
            </SelectItem>
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
            if (table) {
              table.setPageSize(nextSize);
              table.setPageIndex(0);
            }
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

export function RiwayatPeminjamanAlat() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  const [startDate, setStartDate] = useState<string>("");

  const fetchRiwayat = async () => {
    try {
      setLoading(true);
      const response = await api.get("peminjaman/monitor-riwayat");
      setData(response.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }

      if (startDate) {
        const rawDate = item.waktu_kembali || item.tanggal_kembali;
        if (!rawDate) return false;
        try {
          const itemDateString = rawDate.split("T")[0];
          if (itemDateString !== startDate) return false;
        } catch (e) {
          return false;
        }
      }

      return true;
    });
  }, [data, statusFilter, startDate]);

  const columns = useMemo(() => getColumns(setSelectedImg), []);

  const stats = useMemo(
    () => ({
      total: filteredData.length,
      returned: filteredData.filter(
        (i) => i.status === "selesai" || i.status === "returned",
      ).length,
      baik: filteredData.filter(
        (i) => i.kondisi_kembali === "baik" || i.kondisi_kembali === "bersih",
      ).length,
      rusak: filteredData.filter(
        (i) => i.kondisi_kembali === "rusak" || i.kondisi_kembali === "kotor",
      ).length,
    }),
    [filteredData],
  );

  const handleClearFilters = () => {
    setStartDate("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter,
      sorting,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: pageSize,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: (updater: any) => {
      const nextState =
        typeof updater === "function"
          ? updater({ pageIndex: currentPage - 1, pageSize })
          : updater;
      setPageSize(nextState.pageSize);
      setCurrentPage(nextState.pageIndex + 1);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // 👑 REFAKTOR: properti initialState lama yang merusak siklus reaktif tabel telah dihapus dari sini
  });

  return (
    <PageLayout
      pageTitle="Riwayat Peminjaman Alat"
      pageDescription="Riwayat Peminjaman Alat Mahasiswa."
    >
      <div className="py-6 w-full space-y-6 antialiased text-left bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 p-4 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
            <p className="text-[9px] font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-widest uppercase">
              Total riwayat
            </p>
            <p className="text-xl font-mono font-black text-blue-600 mt-1">
              {stats.total} Log
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 p-4 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
            <p className="text-[9px] font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-widest uppercase">
              Dikembalikan
            </p>
            <p className="text-xl font-mono font-black text-emerald-600 mt-1">
              {stats.returned} Sesi
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 p-4 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
            <p className="text-[9px] font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-widest uppercase">
              Kondisi baik
            </p>
            <p className="text-xl font-mono font-black text-green-600 mt-1">
              {stats.baik} Unit
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 p-4 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
            <p className="text-[9px] font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-widest uppercase">
              Perlu perbaikan
            </p>
            <p className="text-xl font-mono font-black text-red-600 mt-1">
              {stats.rusak} Kasus
            </p>
          </div>
        </div>

        <div className="[&_div:nth-child(2)]:hidden">
          <LoanFilterCard
            startDate={startDate}
            endDate={startDate}
            onStartDateChange={(val) => {
              setStartDate(val);
              setCurrentPage(1);
            }}
            onEndDateChange={(val) => {
              setStartDate(val);
              setCurrentPage(1);
            }}
            onClear={handleClearFilters}
          />
        </div>

        <ToolbarSearch
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          statusFilter={statusFilter}
          setStatusFilter={(val) => {
            setStatusFilter(val);
            setCurrentPage(1);
          }}
          pageSize={table.getState().pagination.pageSize}
          table={table}
          setCurrentPage={setCurrentPage}
        />

        <div className="w-full overflow-hidden">
          <RiwayatPeminjamanAlatTable
            table={table}
            loading={loading}
            columnsCount={columns.length}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/20 px-6 py-4 w-full">
          <span className="text-xs text-zinc-400 font-mono font-black tracking-wider">
            Page {currentPage} of {totalPages}
          </span>
          <div className="w-full sm:w-auto flex justify-center sm:justify-end">
            <LoanPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                table.setPageIndex(page - 1);
              }}
            />
          </div>
        </div>

        <Lightbox src={selectedImg} onClose={() => setSelectedImg(null)} />
      </div>
    </PageLayout>
  );
}
