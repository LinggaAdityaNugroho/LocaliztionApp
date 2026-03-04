import { useEffect, useState, useCallback } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    type SortingState,
    type ColumnDef,
} from "@tanstack/react-table";
import api from "../../services/api";
import { Button } from "../../components/ui/button";
import { InventoryTemplate } from "../../layouts/InventoryTemplate";
import { SectionHeader } from "../../components/molecules/SectionHeader";
import { InventoryTable } from "../../components/organism/InventoryTable";
import { AlatForm } from "../../components/molecules/AlatForm";


// --- Interfaces ---
interface Alat {
    id: number;
    nama_alat: string;
    ruang_lab: string;
    total: number;
    tersedia: number;
    kondisi: string;
}

interface Peminjaman {
    id: number;
    alat_id: number;
    nama_mahasiswa: string;
    nim: string;
    laboratorium: string;
    tujuan_penggunaan: string;
    waktu_pinjam: string;
    waktu_kembali: string;
    status: string;
    foto_before: string;
    foto_after: string;
    kondisi_kembali?: string | null;
    deskripsi_kerusakan?: string | null;
    alat: Alat;
}

export function PeminjamanPage() {
    // --- States  ---
    const [peminjamanList, setPeminjamanList] = useState<Peminjaman[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Helper URL Gambar
    const getImageUrl = (path: string) => {
        if (!path) return null;
        const baseUrl = "http://localhost:8000/storage/";
        return path.startsWith('http') ? path : `${baseUrl}${path}`;
    };


    // fetch api data
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/peminjaman')
            const result = response.data?.data || response.data || []
            setPeminjamanList(result)
        } catch (err: any) {
            console.error("Gagal mengambil data.");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleUpdateStatus = async (id: number, newStatus: string) => {
        try {
            await api.patch(`/peminjaman/${id}/status`, { status: newStatus });
            alert(`Status berhasil diperbarui menjadi ${newStatus}`);
            fetchData();
        } catch (err) {
            alert("Gagal memperbarui status.");
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Kolom Tabel Peminjaman ---
    const columns: ColumnDef<Peminjaman>[] = [
        {
            header: "Mahasiswa",
            accessorKey: "nama_mahasiswa",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-900 dark:text-white">{row.original.nama_mahasiswa}</span>
                    <span className="text-[10px] text-slate-500 font-mono tracking-tighter">{row.original.nim}</span>
                </div>
            )
        },
        {
            header: "Alat & Ruangan",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-bold text-xs">{row.original.alat?.nama_alat}</span>
                    <span className="text-[10px] text-indigo-500 font-black uppercase">{row.original.laboratorium}</span>
                </div>
            )
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: ({ getValue }) => {
                const status = getValue<string>().toLowerCase();
                const styles: Record<string, string> = {
                    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30",
                    disetujui: "bg-blue-100 text-blue-700 dark:bg-blue-900/30",
                    selesai: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30",
                    ditolak: "bg-rose-100 text-rose-700 dark:bg-rose-900/30",
                };
                return (
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${styles[status] || "bg-gray-100"}`}>
                        {status}
                    </span>
                );
            }
        },
        {
            header: "Bukti Foto",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <div className="flex flex-col items-center">
                        <span className="text-[7px] font-black text-slate-400">BEFORE</span>
                        {row.original.foto_before ? (
                            <img src={getImageUrl(row.original.foto_before)!} className="w-10 h-10 object-cover rounded cursor-zoom-in" onClick={() => setSelectedImage(getImageUrl(row.original.foto_before)!)} />
                        ) : <img src="../public/img/no-image.png" className="w-10 h-10 object-cover rounded cursor-zoom-in" onClick={() => setSelectedImage(getImageUrl(row.original.foto_before)!)} />}
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[7px] font-black text-slate-400">AFTER</span>
                        {row.original.foto_after ? (
                            <img src={getImageUrl(row.original.foto_after)!} className="w-10 h-10 object-cover rounded cursor-zoom-in" onClick={() => setSelectedImage(getImageUrl(row.original.foto_after)!)} />
                        ) : <img src="../public/img/no-image.png" className="w-10 h-10 object-cover rounded cursor-zoom-in" onClick={() => setSelectedImage(getImageUrl(row.original.foto_after)!)} />}
                    </div>
                </div>
            )
        },
        {
            header: "Aksi Staff",
            id: "actions",
            cell: ({ row }) => {
                const item = row.original;
                const status = item.status.toLowerCase();
                return (
                    <div className="flex gap-2">
                        {status === "pending" && (
                            <>
                                <button onClick={() => handleUpdateStatus(item.id, "disetujui")} className="px-2 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded">SETUJUI</button>
                                <button onClick={() => handleUpdateStatus(item.id, "ditolak")} className="px-2 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold rounded">TOLAK</button>
                            </>
                        )}
                        {status === "disetujui" && <button onClick={() => handleUpdateStatus(item.id, "selesai")} className="px-2 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded">KEMBALI</button>}
                    </div>
                );
            }
        }
    ];



    // --- Instance Tabel ---
    const table = useReactTable({
        data: peminjamanList,
        columns,
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
                    title="Inventaris"
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
                            {isFormOpen ? "Tutup Form" : "Tambah Alat Baru"}
                        </Button>
                    }
                />
            }
            form={isFormOpen && (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem]  shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-xl font-black text-slate-800 dark:text-white">
                            Tambah Alat Baru
                        </h2>
                    </div>
                    <AlatForm
                        onSuccess={() => {
                            setIsFormOpen(false);
                            fetchData();
                        }}
                    />
                </div>
            )}
            table={
                <InventoryTable
                    table={table}
                    columns={columns}
                    loading={loading}
                    header="Daftar Peminjaman Alat"
                />
            }
            modal={
                selectedImage && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedImage(null)}>
                        <Button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4">Tutup</Button>
                        <img src={selectedImage || "../public/img/no-image.png"} className="max-w-full max-h-[90vh] rounded-xl shadow-2xl border-2 border-white" />
                    </div>
                )
            }
        />
    );
}