import { useEffect, useState, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type SortingState,
  type ColumnDef,
} from "@tanstack/react-table";

// API Service
import api from "../../services/api";


import { Badge } from "../../components/atoms/Badge";
import { Button } from "../../components/ui/button";
import { SectionHeader } from "../../components/molecules/SectionHeader";
import { InventoryTable } from "../../components/organism/InventoryTable";
import { AlatForm } from "../../components/molecules/AlatForm";
import { InventoryTemplate } from "../../layouts/InventoryTemplate";

// --- Interfaces ---
interface Alat {
  id: number;
  nama_alat: string;
  ruang_lab: string;
  total: number;
  tersedia: number;
  kondisi: string;
}

export function ManajemenInventoryPage() {
  // --- States ---
  const [alatList, setAlatList] = useState<Alat[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // --- API Functions ---
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/alat");
      const result = response.data?.data || response.data || [];
      setAlatList(result);
    } catch (err: any) {
      console.error("Gagal mengambil data alat:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Column Definitions ---
  const columnsAlat: ColumnDef<Alat>[] = [
    {
      header: "Nama Alat",
      accessorKey: "nama_alat",
      cell: ({ row }) => (
        <span className="font-bold text-slate-900 dark:text-white">
          {row.original.nama_alat}
        </span>
      ),
    },
    {
      header: "Ruang Lab",
      accessorKey: "ruang_lab",
      cell: ({ row }) => (
        <span className="text-indigo-600 font-semibold">
          {row.original.ruang_lab}
        </span>
      ),
    },
    {
      header: "Total",
      accessorKey: "total",
      cell: ({ row }) => (
        <span className="text-center block font-mono">
          {row.original.total}
        </span>
      ),
    },
    {
      header: "Tersedia",
      accessorKey: "tersedia",
      cell: ({ row }) => (
        <span
          className={`font-black ${row.original.tersedia > 0 ? "text-emerald-500" : "text-rose-500"
            }`}
        >
          {row.original.tersedia}
        </span>
      ),
    },
    {
      header: "Kondisi",
      accessorKey: "kondisi",
      cell: ({ row }) => (
        <Badge variant={row.original.kondisi.toLowerCase() === "baik" ? "success" : "danger"}>
          {row.original.kondisi}
        </Badge>
      ),
    },
  ];

  // --- React Table Instance ---
  const tableAlat = useReactTable({
    data: alatList,
    columns: columnsAlat,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <InventoryTemplate
      header={
        <SectionHeader
          title="Manajemen Inventaris"
          badgeText="Admin Control"
          description="Kelola stok dan kondisi aset laboratorium secara real-time."
          rightElement={
            <Button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className={`px-8 py-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isFormOpen
                ? "bg-slate-800 hover:bg-slate-700"
                : "bg-indigo-600 shadow-xl shadow-indigo-100 hover:bg-indigo-700"
                }`}
            >
              {isFormOpen ? "Tutup Form" : "+ Input Alat Baru"}
            </Button>
          }
        />
      }
      form={
        isFormOpen && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-4 border-indigo-50 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                !
              </div>
              <h2 className="text-xl font-black text-slate-800 dark:text-white">
                Registrasi Alat Baru
              </h2>
            </div>
            <AlatForm
              onSuccess={() => {
                setIsFormOpen(false);
                fetchData();
              }}
            />
          </div>
        )
      }
      table={
        <InventoryTable
          table={tableAlat}
          columns={columnsAlat}
          loading={loading}
          header="Daftar Alat"
        />
      }
    />
  );
}