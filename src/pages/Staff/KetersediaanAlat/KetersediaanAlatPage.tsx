import { useEffect, useState, useCallback, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  type SortingState,
} from "@tanstack/react-table";
import { PlusCircle, Pencil, XCircle } from "lucide-react";

import { Button } from "../../../components/ui/button";
import { SectionHeader } from "../../../components/molecules/SectionHeader";
import { InventoryTable } from "../../../components/organism/InventoryTable";
import { AlatForm } from "../../../components/molecules/AlatForm";
import { ToolbarInventory } from "../../../components/molecules/ToolbarInventory";
import { PageLayout } from "../../../layouts/PageLayout";
import { LoanPagination } from "../../../components/organism/LoanPagination";
import { getColumns } from "./column";
import api from "../../../services/api";
import Swal from "sweetalert2";

export function KetersediaanAlatPage() {
  const [alatList, setAlatList] = useState([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [conditionFilter, setConditionFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const user = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "{}"),
    [],
  );

  const isStaff = useMemo(() => {
    const roleStr = user?.role?.toString().toLowerCase().trim() || "";
    return roleStr === "staff" || roleStr === "tendik";
  }, [user]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/alat`);
      setAlatList(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      console.error("Gagal sinkronisasi inventori alat:", err);
      setAlatList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: number) => {
    try {
      const result = await Swal.fire({
        title: "Hapus Aset Alat?",
        text: "Tindakan ini akan menghapus data registrasi alat ini dari basis data lab secara permanen.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#18181b",
        cancelButtonColor: "#f4f4f5",
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal",
        customClass: {
          cancelButton:
            "text-zinc-900 font-mono font-black border-2 border-zinc-950 rounded-none",
          confirmButton: "rounded-none font-mono font-black",
        },
      });

      if (!result.isConfirmed) return;

      await api.delete(`/alat/${id}`);
      Swal.fire({
        title: "Terhapus",
        text: "Data alat berhasil dieliminasi dari sistem.",
        icon: "success",
        confirmButtonColor: "#18181b",
        customClass: { confirmButton: "rounded-none font-mono" },
      });
      fetchData();
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Gagal menghapus parameter perangkat inventori.";
      Swal.fire({
        title: "Aksi Ditolak",
        text: msg,
        icon: "error",
        confirmButtonColor: "#18181b",
        customClass: { confirmButton: "rounded-none font-mono" },
      });
    }
  };

  const conditionFiltered = useMemo(() => {
    if (!alatList || !Array.isArray(alatList)) return [];
    if (!conditionFilter || conditionFilter === "all") return alatList;

    return alatList.filter((item: any) => {
      return (
        item.kondisi?.toLowerCase().trim() ===
        conditionFilter.toLowerCase().trim()
      );
    });
  }, [alatList, conditionFilter]);

  const stats = useMemo(
    () => ({
      total: alatList.length,
      baik: alatList.filter(
        (a: any) =>
          a.kondisi?.toLowerCase().trim() === "baik" ||
          (!a.kondisi && !a.kode_tag),
      ).length,
      rusak: alatList.filter(
        (a: any) =>
          a.kondisi?.toLowerCase().trim() === "rusak" ||
          a.kondisi?.toLowerCase().trim() === "perbaikan",
      ).length,
      totalUnit: alatList.reduce(
        (sum, a: any) =>
          sum +
          (typeof a.jumlah === "number" ? a.jumlah : Number(a.jumlah) || 0),
        0,
      ),
    }),
    [alatList],
  );

  const columns = useMemo(
    () =>
      getColumns(
        isStaff,
        (selectedRowData) => {
          setEditData(selectedRowData);
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
    state: {
      sorting,
      globalFilter,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: itemsPerPage,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const totalPages = Math.ceil(conditionFiltered.length / itemsPerPage) || 1;

  return (
    <PageLayout
      pageTitle="Inventory Peralatan Laboratorium"
      pageDescription="Sistem pengawasan manifes ketersediaan aset dan unit telemetri laboratorium terpusat."
    >
      <div className="py-6 w-full space-y-6 antialiased text-left bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 p-4 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
            <p className="text-[9px] font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-widest uppercase">
              Total Katalog
            </p>
            <p className="text-xl font-mono font-black text-zinc-900 dark:text-white mt-1">
              {stats.total} Model
            </p>
          </div>
          <Button
            variant="brutal"
            onClick={() => {
              setEditData(null);
              setIsFormOpen(!isFormOpen);
            }}
            className="rounded-none font-mono font-black text-xs tracking-wider uppercase h-11 px-5"
          >
            {isFormOpen ? (
              <XCircle size={14} className="mr-2" />
            ) : (
              <PlusCircle size={14} className="mr-2" />
            )}
            {isFormOpen ? "Batal" : "Tambah Item"}
          </Button>
          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 p-4 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
            <p className="text-[9px] font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-widest uppercase">
              Kondisi Layak
            </p>
            <p className="text-xl font-mono font-black text-emerald-600 mt-1">
              {stats.baik} Aset
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 p-4 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
            <p className="text-[9px] font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-widest uppercase">
              Kondisi Rusak
            </p>
            <p className="text-xl font-mono font-black text-amber-600 mt-1">
              {stats.rusak} Node
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 p-4 rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
            <p className="text-[9px] font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-widest uppercase">
              Total Volume Unit
            </p>
            <p className="text-xl font-mono font-black text-purple-600 mt-1">
              {stats.totalUnit} Pcs
            </p>
          </div>
        </div>

        {isFormOpen && (
          <div className="bg-white dark:bg-zinc-900 p-6 lg:p-8 rounded-none border-2 border-zinc-950 dark:border-zinc-800 shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none animate-in fade-in zoom-in-95 duration-150 w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-zinc-950 dark:bg-zinc-800 border-2 border-zinc-950 dark:border-zinc-700 text-white flex items-center justify-center rounded-none shadow-none shrink-0">
                {editData ? <Pencil size={15} /> : <PlusCircle size={15} />}
              </div>
              <div>
                <h3 className="text-lg font-mono font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  {editData ? "Update Data Inventori" : "Registrasi Item Baru"}
                </h3>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono font-black uppercase mt-0.5 tracking-wider">
                  {editData
                    ? "Ubah spesifikasi atau lokasi rak perangkat lab"
                    : "Masukkan parameter alat praktikum baru"}
                </p>
              </div>
            </div>
            <AlatForm
              initialData={editData || undefined}
              onSuccess={() => {
                setIsFormOpen(false);
                setEditData(null);
                fetchData();
              }}
            />
          </div>
        )}

        <ToolbarInventory
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          conditionFilter={conditionFilter}
          setConditionFilter={setConditionFilter}
          pageSize={table.getState().pagination.pageSize}
          setPageSize={(size) => table.setPageSize(size)}
          onRefresh={fetchData}
          loading={loading}
        />

        <div className="w-full overflow-hidden">
          <InventoryTable
            table={table}
            loading={loading}
            columnsCount={columns.length}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/20 px-6 py-4 w-full">
          <span className="text-xs text-zinc-400 font-mono font-black uppercase tracking-wider">
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
      </div>
    </PageLayout>
  );
}
