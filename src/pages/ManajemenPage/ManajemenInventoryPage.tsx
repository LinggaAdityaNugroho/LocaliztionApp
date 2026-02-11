import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type SortingState,
  type ColumnDef,
} from "@tanstack/react-table";

import { DeviceTable } from "../../components/molecules/DeviceTable";
import { DevicePagination } from "../../components/molecules/DevicePagination";
import { DeviceManagementTemplate } from "../../layouts/DeviceManagementTemplate";
import { DevicePageSize } from "../../components/molecules/DevicePageSize";
import { PeminjamanForm } from "../../components/molecules/PeminjamanForm";

interface Peminjaman {
  nama_mahasiswa: string;
  nim: string;
  laboratorium: string;
  tujuan_penggunaan: string;
  waktu_pinjam: string;
  waktu_kembali: string;
  status: string;
  alat: {
    id: number;
    nama_alat: string;
    ruang_lab: string;
    total: number;
    tersedia: number;
    kondisi: string;
  };
}

const columns: ColumnDef<Peminjaman>[] = [
  { header: "Nama Mahasiswa", accessorKey: "nama_mahasiswa" },
  { header: "NIM", accessorKey: "nim" },
  { header: "Lab", accessorKey: "laboratorium" },
  { header: "Tujuan", accessorKey: "tujuan_penggunaan" },
  { header: "Waktu Pinjam", accessorKey: "waktu_pinjam" },
  { header: "Waktu Kembali", accessorKey: "waktu_kembali" },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ getValue }) => (
      <span className="capitalize font-semibold">{getValue<string>()}</span>
    ),
  },
  {
    header: "Nama Alat",
    accessorFn: (row) => row.alat.nama_alat,
  },
  {
    header: "Ruang Alat",
    accessorFn: (row) => row.alat.ruang_lab,
  },
  {
    header: "Total",
    accessorFn: (row) => row.alat.total,
  },
  {
    header: "Tersedia",
    accessorFn: (row) => row.alat.tersedia,
  },
  {
    header: "Kondisi Alat",
    accessorFn: (row) => row.alat.kondisi,
    cell: ({ getValue }) =>
      getValue<string>() === "baik" ? (
        <span className="text-green-600 font-semibold">Baik</span>
      ) : (
        <span className="text-red-600 font-semibold">Rusak</span>
      ),
  },
];

export function ManajemenInventoryPage() {
  const [data, setData] = useState<Peminjaman[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/peminjaman")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((json) => setData(json.data ?? json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) return <p>Loading data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className=" mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Ajukan Peminjaman Alat</h1>
      <PeminjamanForm />
      <DeviceManagementTemplate
        header={
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Manajemen Peminjaman</h2>
            <DevicePageSize table={table} />
          </div>
        }
        table={<DeviceTable table={table} columns={columns} />}
        pagination={<DevicePagination table={table} />}
      />
    </div>
  );
}
