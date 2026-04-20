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

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { SectionHeader } from "../../../components/molecules/SectionHeader";
import { InventoryTable } from "../../../components/organism/InventoryTable";
import { AlatForm } from "../../../components/molecules/AlatForm";
import { InventoryTemplate } from "../../../layouts/InventoryTemplate";
import { StatCard } from "../../../components/molecules/StatCard";
import { getColumns } from "./column";
import api from "../../../services/api";

export function KetersediaanAlatPage() {
  const [alatList, setAlatList] = useState([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");

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
    data: alatList,
    columns,
    state: { sorting, globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 10 } },
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

        {/* CONTROLS SECTION */}
        <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="relative flex-1 w-full max-w-md">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <Input
              placeholder="Cari alat, lokasi..."
              className="pl-12 rounded-xl border-slate-200"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>
          <Button
            variant="ghost"
            onClick={fetchData}
            className="rounded-xl gap-2 text-slate-500"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>
        </div>

        {/* TABLE SECTION */}
        <div className="space-y-4">
          <InventoryTable
            table={table}
            loading={loading}
            columnsCount={columns.length}
          />

          {/* Pagination Controls */}
          <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
              {table.getPageCount()}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="rounded-lg gap-2"
              >
                <ChevronLeft size={14} /> Prev
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="rounded-lg gap-2"
              >
                Next <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </InventoryTemplate>
  );
}
