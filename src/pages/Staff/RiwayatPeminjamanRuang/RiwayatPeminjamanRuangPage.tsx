import { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import type { SortingState } from "@tanstack/react-table";
import { AlertTriangle, RefreshCw, Loader2 } from "lucide-react";

import api from "../../../services/api";
import { getColumns } from "./columns";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
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
import Swal from "sweetalert2";

interface ToolbarSearchProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  conditionFilter: string;
  setConditionFilter: (value: string) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
}

export function ToolbarSearch({
  globalFilter,
  setGlobalFilter,
  conditionFilter,
  setConditionFilter,
  pageSize,
  setPageSize,
}: ToolbarSearchProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 border-2 border-zinc-950 dark:border-zinc-800 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none w-full">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
        <Input
          placeholder="Cari nama mahasiswa atau lab..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-xs h-11 border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono text-xs font-black tracking-wide rounded-none shadow-none focus-visible:ring-0"
        />

        <Select value={conditionFilter} onValueChange={setConditionFilter}>
          <SelectTrigger className="w-full sm:w-44 h-11 border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono font-black text-xs rounded-none shadow-none tracking-wide text-left">
            <SelectValue placeholder="Semua evaluasi" />
          </SelectTrigger>
          <SelectContent className="border-2 border-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 font-mono font-black text-xs text-zinc-800 dark:text-zinc-200 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
            <SelectItem value="all" className="cursor-pointer rounded-none">
              Semua evaluasi
            </SelectItem>
            <SelectItem value="bersih" className="cursor-pointer rounded-none">
              Kondisi bersih
            </SelectItem>
            <SelectItem value="kotor" className="cursor-pointer rounded-none">
              Kondisi kotor
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
          onValueChange={(v) => setPageSize(Number(v))}
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

export function RiwayatPeminjamanRuangPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [conditionFilter, setConditionFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const [startDate, setStartDate] = useState<string>("");

  const fetchRiwayat = async () => {
    try {
      setLoading(true);
      const response = await api.get("tendik/riwayat-ruang");
      const cleanData = response.data?.data || response.data || [];
      setData(Array.isArray(cleanData) ? cleanData : []);
    } catch (error) {
      console.error("Gagal sinkronisasi data riwayat ruang tendik:", error);
      setData([]);
      Swal.fire({
        title: "Koneksi gagal",
        text: "Gagal memuat log riwayat dari server (Error 500). Periksa konfigurasi API server.",
        icon: "error",
        confirmButtonColor: "#18181b",
        customClass: { confirmButton: "rounded-none font-mono" },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item: any) => {
      if (startDate) {
        const rawDate = item.waktu_kembali || item.created_at;
        if (!rawDate) return false;
        try {
          const itemDateString = rawDate.split("T")[0];
          if (itemDateString !== startDate) return false;
        } catch (e) {
          return false;
        }
      }

      if (conditionFilter !== "all") {
        const masuk = (item.kondisi_masuk || "").toLowerCase().trim();
        const keluar = (item.kondisi_keluar || "").toLowerCase().trim();
        const target = conditionFilter.toLowerCase().trim();
        if (masuk !== target && keluar !== target) return false;
      }

      return true;
    });
  }, [data, startDate, conditionFilter]);

  const columns = useMemo(() => getColumns(setSelectedImg), []);

  const stats = useMemo(
    () => ({
      total: filteredData.length,
      returned: filteredData.filter(
        (i) => i.status === "returned" || i.status === "selesai",
      ).length,
      baik: filteredData.filter(
        (i) =>
          (i.kondisi_masuk || "").toLowerCase().trim() === "bersih" ||
          (i.kondisi_keluar || "").toLowerCase().trim() === "bersih",
      ).length,
      rusak: filteredData.filter(
        (i) =>
          (i.kondisi_masuk || "").toLowerCase().trim() === "kotor" ||
          (i.kondisi_keluar || "").toLowerCase().trim() === "kotor",
      ).length,
    }),
    [filteredData],
  );

  const handleClearFilters = () => {
    setStartDate("");
    setConditionFilter("all");
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter,
      sorting,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: itemsPerPage,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 5 } },

    globalFilterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase().trim();
      const namaMhs = String(row.original.nama_mahasiswa || "").toLowerCase();
      const nimMhs = String(row.original.nim_mahasiswa || "").toLowerCase();
      const lab = String(row.original.laboratorium || "").toLowerCase();
      const keperluan = String(row.original.keperluan || "").toLowerCase();

      return (
        namaMhs.includes(search) ||
        nimMhs.includes(search) ||
        lab.includes(search) ||
        keperluan.includes(search)
      );
    },
  });

  return (
    <PageLayout
      pageTitle="Arsip Logbook Ruangan"
      pageDescription="Monitoring seluruh aktivitas penggunaan fasilitas ruang lab, status kebersihan, serta berkas lampiran visual mahasiswa Polines."
    >
      <div className="py-6 w-full space-y-6 antialiased text-left bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 p-4 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
            <p className="text-[9px] font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-widest uppercase">
              Total riwayat
            </p>
            <p className="text-xl font-mono font-black text-zinc-900 dark:text-white mt-1">
              {stats.total} log
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 p-4 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
            <p className="text-[9px] font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-widest uppercase">
              Selesai penggunaan
            </p>
            <p className="text-xl font-mono font-black text-zinc-900 dark:text-white mt-1">
              {stats.returned} sesi
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 p-4 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
            <p className="text-[9px] font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-widest uppercase">
              Kondisi bersih
            </p>
            <p className="text-xl font-mono font-black text-emerald-600 mt-1">
              {stats.baik} log
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 p-4 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
            <p className="text-[9px] font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-widest uppercase">
              Kondisi kotor
            </p>
            <p className="text-xl font-mono font-black text-red-600 mt-1">
              {stats.rusak} log
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

        <div className="flex justify-between items-center w-full gap-4">
          <ToolbarSearch
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            conditionFilter={conditionFilter}
            setConditionFilter={(val) => {
              setConditionFilter(val);
              setCurrentPage(1);
            }}
            pageSize={table.getState().pagination.pageSize}
            setPageSize={(size) => table.setPageSize(size)}
          />
        </div>

        <div className="w-full overflow-hidden">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-2 border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <Loader2
                className="animate-spin text-zinc-950 dark:text-zinc-50"
                size={24}
              />
              <p className="text-[9px] font-mono font-black uppercase tracking-widest text-zinc-400">
                Menyinkronkan basis data
              </p>
            </div>
          ) : (
            <RiwayatPeminjamanAlatTable
              table={table}
              loading={loading}
              columnsCount={columns.length}
            />
          )}
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
