import React, { useEffect, useState, useMemo } from "react";
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

import { StatCard } from "../../../components/molecules/StatCard";
import { DevicePagination } from "../../../components/molecules/DevicePagination";
import { RiwayatPeminjamanAlatTable } from "../../../components/organism/Table/RiwayatPeminjamanAlatTable";

export function RiwayatPeminjamanRuangPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [conditionFilter, setConditionFilter] = useState<string>("");

  const fetchRiwayat = async () => {
    try {
      setLoading(true);
      const response = await api.get("staff/riwayat-ruang");
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

  const conditionFiltered = useMemo(() => {
    if (!conditionFilter || conditionFilter === "all") return data;

    return data.filter((item: any) => {
      return (
        item.kondisi_masuk?.toLowerCase() ||
        item.kondisi_keluar?.toLowerCase() === conditionFilter.toLowerCase()
      );
    });
  }, [data, conditionFilter]);

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
    data: conditionFiltered,
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
      {/* Organism: Stats Grid */}
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
      {/* Toolbar: Search, Status Filter & Page Size */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 flex-1">
          <div className="relative w-full md:w-auto">
            <Input
              placeholder="Cari data..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full md:w-64 rounded-xl border-slate-200 focus:ring-indigo-500 pl-4"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Select value={conditionFilter} onValueChange={setConditionFilter}>
              <SelectTrigger className="w-full md:w-40 rounded-xl border-slate-200 bg-slate-50/50 font-medium text-sm transition-all hover:bg-slate-50">
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="bersih">Bersih</SelectItem>
                <SelectItem value="kotor">Kotor</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              onClick={fetchRiwayat}
              className="rounded-xl hover:bg-slate-100 text-slate-500 shrink-0"
              title="Refresh Data"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </Button>
          </div>
        </div>

        {/* Sisi Kanan: Page Size */}
        <div className="flex items-center justify-end gap-3 border-t md:border-t-0 pt-3 md:pt-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Baris Per Halaman:
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
          className="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-300"
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
