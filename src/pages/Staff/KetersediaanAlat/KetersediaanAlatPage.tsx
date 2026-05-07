import { useEffect, useState, useCallback, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  type SortingState,
} from "@tanstack/react-table";
import {
  PlusCircle,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Pencil,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

import { DevicePagination } from "../../../components/molecules/DevicePagination";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { SectionHeader } from "../../../components/molecules/SectionHeader";
import { InventoryTable } from "../../../components/organism/InventoryTable";
import { AlatForm } from "../../../components/molecules/AlatForm";
import { InventoryTemplate } from "../../../layouts/InventoryTemplate";
import { StatCard } from "../../../components/molecules/StatCard";
import { getColumns } from "./column";
import api from "../../../services/api";
import { data } from "react-router-dom";

export function KetersediaanAlatPage() {
  const [alatList, setAlatList] = useState([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [conditionFilter, setConditionFilter] = useState<string>("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user?.role?.toLowerCase();
  const isStaff = user?.role?.toString().toLowerCase().trim() === "staff";

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/alat?role=${userRole}&t=${Date.now()}`);
      setAlatList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus?")) return;
    try {
      await api.delete(`/alat/${id}`);
      fetchData();
    } catch (err) {
      alert("Gagal");
    }
  };

  const conditionFiltered = useMemo(() => {
    if (!alatList || !Array.isArray(alatList)) return [];

    if (!conditionFilter || conditionFilter === "all") return alatList;

    return alatList.filter((item: any) => {
      return item.kondisi?.toLowerCase() === conditionFilter.toLowerCase();
    });
  }, [alatList, conditionFilter]);

  const stats = useMemo(
    () => ({
      total: alatList.length,
      baik: alatList.filter(
        (a: any) => !a.kode_tag || a.kondisi?.toLowerCase() === "baik",
      ).length,
      rusak: alatList.filter(
        (a: any) => a.kode_tag && a.kondisi?.toLowerCase() === "rusak",
      ).length,
      totalUnit: alatList.reduce(
        (sum, a: any) => sum + (Number(a.jumlah) || 0),
        0,
      ),
    }),
    [alatList],
  );

  const columns = useMemo(
    () =>
      getColumns(
        isStaff,
        (data) => {
          setEditData(data);
          setIsFormOpen(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
        handleDelete,
      ),
    [isStaff],
  );

  const table = useReactTable({
    data: conditionFiltered,
    columns,
    state: { sorting, globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  return (
    <InventoryTemplate>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* HEADER SECTION */}
        <SectionHeader
          title="Inventory Peralatan Laboratorium"
          description="Pantau aset laboratorium secara terpusat"
          rightElement={
            <Button
              onClick={() => {
                setEditData(null);
                setIsFormOpen(!isFormOpen);
              }}
              className="rounded-xl shadow-lg shadow-blue-200 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isFormOpen ? <RefreshCw size={18} /> : <PlusCircle size={18} />}
              {isFormOpen ? "Batal" : "Tambah Item"}
            </Button>
          }
        />

        {/* STATS SECTION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Item"
            value={stats.total}
            color="text-blue-600"
          />
          <StatCard
            title="Kondisi Baik"
            value={stats.baik}
            color="text-emerald-600"
          />
          <StatCard
            title="Kondisi Rusak"
            value={stats.rusak}
            color="text-red-600"
          />
          <StatCard
            title="Total Unit"
            value={stats.totalUnit}
            color="text-purple-600"
          />
        </div>

        {/* FORM SECTION */}
        {isFormOpen && (
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-100 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                {editData ? (
                  <Pencil className="text-white" size={20} />
                ) : (
                  <PlusCircle className="text-white" size={20} />
                )}
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                {editData ? "Update Data Inventori" : "Registrasi Item Baru"}
              </h3>
            </div>
            <AlatForm
              onSuccess={() => {
                setIsFormOpen(false);
                setEditData(null);
                fetchData();
              }}
            />
          </div>
        )}

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
              <Select
                value={conditionFilter}
                onValueChange={setConditionFilter}
              >
                <SelectTrigger className="w-full md:w-40 rounded-xl border-slate-200 bg-slate-50/50 font-medium text-sm transition-all hover:bg-slate-50">
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="baik">Baik</SelectItem>
                  <SelectItem value="rusak">Rusak</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                onClick={fetchData}
                className="rounded-xl hover:bg-slate-100 text-slate-500 shrink-0"
                title="Refresh Data"
              >
                <RefreshCw
                  size={18}
                  className={loading ? "animate-spin" : ""}
                />
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

        {/* TABLE SECTION */}
        <div className="space-y-4">
          <InventoryTable
            table={table}
            loading={loading}
            columnsCount={columns.length}
          />

          {/* Molecule: Pagination */}
          <DevicePagination table={table} />
        </div>
      </div>
    </InventoryTemplate>
  );
}
