import { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import type { SortingState } from "@tanstack/react-table";
import {
  Archive,
  CheckCircle2,
  Stars,
  AlertTriangle,
  RefreshCw,
  X,
} from "lucide-react";

import api from "../../../services/api";

import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

import { StatCard } from "../../../components/molecules/StatCard";
import { DevicePagination } from "../../../components/molecules/DevicePagination";
import { RiwayatPeminjamanAlatTable } from "../../../components/organism/Table/RiwayatPeminjamanAlatTable";
import { getColumns } from "./columns";

export function RiwayatPeminjamanAlatPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchRiwayat = async () => {
    try {
      setLoading(true);
      const response = await api.get("mahasiswa/riwayat-saya");
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

  const filterdData = useMemo(() => {
    if (statusFilter === "all") return data;
    return data.filter((item) => item.status === statusFilter);
  }, [data, statusFilter]);

  const columns = useMemo(() => getColumns(setSelectedImg), []);
  const stats = useMemo(
    () => ({
      total: data.length,
      returned: data.filter((i) => i.status === "returned").length,
      baik: data.filter((i) => i.kondisi_kembali === "baik").length,
      rusak: data.filter((i) => i.kondisi_kembali === "rusak").length,
    }),
    [data],
  );

  const table = useReactTable({
    data: filterdData,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Riwayat"
          value={stats.total}
          icon={<Archive size={20} />}
          color="text-blue-600"
        />
        <StatCard
          title="Berhasil Kembali"
          value={stats.returned}
          icon={<CheckCircle2 size={20} />}
          color="text-emerald-600"
        />
        <StatCard
          title="Kondisi Baik"
          value={stats.baik}
          icon={<Stars size={20} />}
          color="text-green-600"
        />
        <StatCard
          title="Perlu Perbaikan"
          value={stats.rusak}
          icon={<AlertTriangle size={20} />}
          color="text-red-600"
        />
      </div>

      {/* Toolbar: Search & Page Size */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Input
            placeholder="Cari data peminjaman..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-xs rounded-xl border-slate-200 focus:ring-indigo-500"
          />

          {/* 4. Dropdown Filter Status */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] rounded-xl border-slate-200 font-medium text-sm">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="pending">Menunggu</SelectItem>
              <SelectItem value="ongoing">Dipinjam</SelectItem>
              <SelectItem value="returned">Dikembalikan</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            onClick={fetchRiwayat}
            className="rounded-xl hover:bg-slate-100 text-slate-500"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            Baris
          </span>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(v) => table.setPageSize(Number(v))}
          >
            <SelectTrigger className="w-20 rounded-xl border-slate-200 font-bold text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 25, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Organism: Table */}
      <RiwayatPeminjamanAlatTable
        table={table}
        loading={loading}
        columnsCount={columns.length}
      />

      {/* Molecule: Pagination */}
      <DevicePagination table={table} />

      {/* Atom/Molecule: Image Lightbox */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-9999 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-300"
          onClick={() => setSelectedImg(null)}
        >
          <Button
            variant="ghost"
            className="absolute top-8 right-8 text-white hover:bg-white/10 rounded-full h-12 w-12"
            onClick={() => setSelectedImg(null)}
          >
            <X size={32} />
          </Button>
          <img
            src={selectedImg}
            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/10"
            alt="Detail Dokumentasi"
          />
        </div>
      )}
    </div>
  );
}
