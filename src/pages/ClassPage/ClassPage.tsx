import { useEffect, useState, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type SortingState,
  type ColumnDef,
} from "@tanstack/react-table";

// UI Components
import { QrScannerModal } from "../../components/molecules/QRScannerModal";
import { Button } from "../../components/ui/button";
import { DeviceTable } from "../../components/molecules/DeviceTable";
import { DevicePagination } from "../../components/molecules/DevicePagination";
import { DevicePageSize } from "../../components/molecules/DevicePageSize";
import { PeminjamanForm } from "../../components/molecules/PeminjamanForm";
import { RandomizerMenu } from "../../components/molecules/RandomizerMenu";

import api from "../../services/api";

// ... Interface tetap sama seperti kode Anda ...
interface UserData {
  name: string;
  email: string;
  nim: string;
  student_class: { class: string };
}

interface Peminjaman {
  id: number;
  nama_mahasiswa: string;
  nim: string;
  laboratorium: string;
  waktu_pinjam: string;
  status: string;
  alat: { nama_alat: string };
}

export function ClassPage() {
  const [qr, setQr] = useState(false);
  const [activeTab, setActiveTab] = useState<"peminjaman" | "randomizer">("peminjaman");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [scanResult, setScanResult] = useState<any>(null);
  const [classmates, setClassmates] = useState<any[]>([]); // Data teman sekelas untuk randomizer
  const [inventoryData, setInventoryData] = useState<Peminjaman[]>([]);
  const [loading, setLoading] = useState(true);
  const [processLoading, setProcessLoading] = useState(false);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

  const initApp = useCallback(async () => {
    try {
      setLoading(true);
      const [userRes, sessionRes, invRes] = await Promise.all([
        api.get("user"),
        api.get("scan-room/check-session"),
        api.get("peminjaman"),
      ]);

      setUserData(userRes.data);
      setInventoryData(invRes.data?.data || invRes.data || []);

      if (sessionRes.data.active) {
        setScanResult(sessionRes.data.data);
        setClassmates(sessionRes.data.classmates || []); // Ambil teman sekelas dari session
      } else {
        setScanResult(null);
      }
    } catch (error) {
      console.error("Gagal sinkronisasi data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initApp();
  }, [initApp]);

  // ... handleScan & handleCheckout tetap sama ...
  const handleScan = async (scannedId: string) => {
    setProcessLoading(true);
    try {
      await api.post("scan-room/scan", {
        roomclass_id: parseInt(scannedId),
        keperluan: "Praktikum Lab",
      });
      await initApp();
      setQr(false);
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal scan");
    } finally {
      setProcessLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!scanResult?.id) return;
    setProcessLoading(true);
    try {
      await api.post(`scan-room/checkout/${scanResult.id}`);
      setScanResult(null);
      await initApp();
    } catch (error) {
      alert("Gagal keluar ruangan");
    } finally {
      setProcessLoading(false);
    }
  };

  const columns: ColumnDef<Peminjaman>[] = [
    { header: "Alat", accessorFn: (row) => row.alat.nama_alat },
    { header: "Pinjam", accessorKey: "waktu_pinjam" },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }) => {
        const status = getValue<string>()?.toLowerCase() || "pending";
        const styles: Record<string, string> = {
          pending: "bg-amber-100 text-amber-700",
          disetujui: "bg-blue-100 text-blue-700",
          selesai: "bg-emerald-100 text-emerald-700",
          ditolak: "bg-rose-100 text-rose-700",
        };
        return (
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${styles[status] || "bg-gray-100"}`}>
            {status}
          </span>
        );
      },
    },
  ];

  const table = useReactTable({
    data: inventoryData,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Singkronisasi Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-8 transition-all duration-300">
      <QrScannerModal open={qr} onClose={() => setQr(false)} onScan={handleScan} />

      <div className="max-w-7xl mx-auto">
        {!scanResult ? (
          /* TAMPILAN SEBELUM SCAN */
          <div className="max-w-md mx-auto p-10 rounded-[3rem] shadow-2xl text-center mt-20 border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-500 bg-white dark:bg-slate-900">
            <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Akses Lab</h1>
            <p className="text-slate-500 mb-10 text-sm font-medium leading-relaxed">Silakan scan QR Code ruangan untuk memulai presensi dan fitur lainnya.</p>
            <Button onClick={() => setQr(true)} className="w-full py-8 text-lg rounded-3xl bg-indigo-600 font-bold" disabled={processLoading}>
              {processLoading ? "Memproses..." : "Scan QR Masuk"}
            </Button>
          </div>
        ) : (
          /* TAMPILAN DASHBOARD SETELAH SCAN */
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                  {scanResult.room?.name || scanResult.roomclass || "Laboratorium"}
                </h2>
                <p className="text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest mt-1">
                  {userData?.name} ({userData?.student_class?.class})
                </p>
              </div>

              {/* MENU SWITCHER */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-full md:w-auto">
                <button
                  onClick={() => setActiveTab("peminjaman")}
                  className={`flex-1 md:px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === "peminjaman" ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600" : "text-slate-500"}`}
                >
                  PEMINJAMAN
                </button>
                <button
                  onClick={() => setActiveTab("randomizer")}
                  className={`flex-1 md:px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === "randomizer" ? "bg-white dark:bg-slate-700 shadow-sm text-indigo-600" : "text-slate-500"}`}
                >
                  RANDOMIZER
                </button>
              </div>

              <Button variant="destructive" className="rounded-2xl px-8 py-6 font-black text-xs tracking-widest uppercase" onClick={handleCheckout} disabled={processLoading}>
                Keluar
              </Button>
            </header>

            {/* KONTEN BERDASARKAN TAB */}
            <div className="animate-in fade-in duration-500">
              {activeTab === "peminjaman" ? (
                /* TAB PEMINJAMAN */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-4">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm">
                      <h3 className="font-black text-slate-800 dark:text-white uppercase text-sm mb-6">Pinjam Alat Baru</h3>
                      <PeminjamanForm
                        userContext={{
                          nama_mahasiswa: userData?.name || "",
                          nim: userData?.nim || "",
                          laboratorium: scanResult.room?.name || scanResult.roomclass || "Lab",
                        }}
                        onSuccess={initApp}
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-8">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm overflow-hidden h-full flex flex-col">
                      <div className="p-6 border-b flex justify-between items-center ">
                        <h3 className="font-black text-slate-200 text-sm uppercase">Riwayat Pinjam</h3>
                        <DevicePageSize table={table} />
                      </div>
                      <div className="p-6 overflow-x-auto grow">
                        <DeviceTable table={table} columns={columns} />
                      </div>
                      <div className="p-6 border-t">
                        <DevicePagination table={table} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* TAB RANDOMIZER */
                <RandomizerMenu classmates={classmates} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}