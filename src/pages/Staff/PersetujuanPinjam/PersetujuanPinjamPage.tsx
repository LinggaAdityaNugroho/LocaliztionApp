import { useState, useEffect, useMemo } from "react";
import api from "../../../services/api";
import {
  X,
  AlertCircle,
  Check,
  XCircle,
  Clock,
  Inbox,
  Activity,
  Calendar,
} from "lucide-react";
import Swal from "sweetalert2";

export function PersetujuanPinjamPage() {
  const [dataPinjam, setDataPinjam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [alasanTolak, setAlasanTolak] = useState("");

  const fetchPeminjaman = async () => {
    try {
      setLoading(true);
      const res = await api.get("/peminjaman/semua");
      setDataPinjam(Array.isArray(res.data) ? res.data : res.data.data);
    } catch (err) {
      console.error("Gagal mengambil data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeminjaman();
  }, []);

  const handleSetujui = async (id: number, currentStatus: string) => {
    const isBooking =
      currentStatus === "booking" || currentStatus === "pesanan";

    const result = await Swal.fire({
      title: "Konfirmasi Persetujuan",
      text: isBooking
        ? "Setujui pesanan ini? Status akan menjadi 'Terjadwal'."
        : "Setujui peminjaman ini? Stok akan langsung berkurang.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      confirmButtonText: "Ya, Setujui!",
    });

    if (!result.isConfirmed) return;

    try {
      setProcessing(id);
      await api.post(`/peminjaman/${id}/setujui`);
      Swal.fire("Berhasil!", "Peminjaman telah disetujui.", "success");
      fetchPeminjaman();
    } catch (err: any) {
      Swal.fire(
        "Gagal!",
        err.response?.data?.message || "Gagal menyetujui",
        "error",
      );
    } finally {
      setProcessing(null);
    }
  };

  const openRejectModal = (id: number) => {
    setSelectedId(id);
    setIsRejectModalOpen(true);
    setAlasanTolak("");
  };

  const confirmTolak = async () => {
    if (!alasanTolak.trim() || !selectedId) return;

    try {
      setProcessing(selectedId);
      await api.post(`/peminjaman/${selectedId}/tolak`, {
        alasan: alasanTolak,
      });
      setIsRejectModalOpen(false);
      Swal.fire("Ditolak", "Pengajuan telah ditolak.", "info");
      fetchPeminjaman();
    } catch (err: any) {
      Swal.fire(
        "Gagal!",
        err.response?.data?.message || "Gagal menolak",
        "error",
      );
    } finally {
      setProcessing(null);
      setSelectedId(null);
    }
  };

  const stats = useMemo(() => {
    const total = dataPinjam.length;
    const pending = dataPinjam.filter(
      (item: any) => item.status === "pending",
    ).length;
    const booking = dataPinjam.filter(
      (item: any) => item.status === "booking" || item.status === "pesanan",
    ).length;
    const approved = dataPinjam.filter(
      (item: any) => item.status === "approved" || item.status === "disetujui",
    ).length;
    const ongoing = dataPinjam.filter(
      (item: any) => item.status === "ongoing",
    ).length;

    return { total, pending, approved, ongoing, booking };
  }, [dataPinjam]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* STATISTICS CARDS */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total"
            value={stats.total}
            color="blue"
            icon={<Inbox size={20} />}
          />
          <StatCard
            title="Booking"
            value={stats.booking}
            color="purple"
            icon={<Calendar size={20} />}
          />
          <StatCard
            title="Menunggu"
            value={stats.pending}
            color="amber"
            icon={<Clock size={20} />}
          />
          <StatCard
            title="Disetujui"
            value={stats.approved}
            color="emerald"
            icon={<Check size={20} />}
          />
          <StatCard
            title="Berlangsung"
            value={stats.ongoing}
            color="indigo"
            icon={<Activity size={20} />}
          />
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900 text-white text-left">
              <tr>
                <th className="p-5 text-xs font-black uppercase">ID</th>
                <th className="p-5 text-xs font-black uppercase">Mahasiswa</th>
                <th className="p-5 text-xs font-black uppercase">
                  Lab & Tujuan
                </th>
                <th className="p-5 text-xs font-black uppercase">Alat</th>
                <th className="p-5 text-xs font-black uppercase">Status</th>
                <th className="p-5 text-center text-xs font-black uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dataPinjam.map((item: any) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="p-5 font-bold text-slate-400 text-sm">
                    #{item.id}
                  </td>
                  <td className="p-5">
                    <div className="font-bold text-slate-800">
                      {item.user?.name}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                      {item.user?.nim_nip || "No NIM"}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="font-bold text-indigo-600 text-sm">
                      {item.ruangan_lab}
                    </div>
                    <div className="text-xs text-slate-500 truncate max-w-[150px] italic">
                      "{item.keperluan}"
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="space-y-1">
                      {item.details?.map((det: any) => (
                        <div
                          key={det.id}
                          className="text-[11px] font-medium text-slate-600 flex items-center gap-1"
                        >
                          <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                          {det.alat?.nama_alat}{" "}
                          <span className="font-bold text-slate-900">
                            (x{det.jumlah_pinjam})
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-5">
                    <StatusBadge
                      status={item.status}
                      jenis={item.status_peminjaman}
                    />
                  </td>
                  <td className="p-5">
                    <div className="flex justify-center gap-2">
                      {item.status === "pending" ||
                      item.status === "booking" ||
                      item.status === "pesanan" ? (
                        <>
                          <button
                            onClick={() => handleSetujui(item.id, item.status)}
                            disabled={processing === item.id}
                            className="w-9 h-9 flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-100 transition-all disabled:opacity-50"
                          >
                            {processing === item.id ? (
                              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                              <Check size={18} />
                            )}
                          </button>
                          <button
                            onClick={() => openRejectModal(item.id)}
                            disabled={processing === item.id}
                            className="w-9 h-9 flex items-center justify-center bg-white border-2 border-red-100 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all disabled:opacity-50"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                          Selesai
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {dataPinjam.length === 0 && !loading && (
            <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-sm">
              Data Tidak Ditemukan
            </div>
          )}
        </div>
      </div>

      {/* REJECT MODAL */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => !processing && setIsRejectModalOpen(false)}
          ></div>
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden p-8 border border-slate-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
                <AlertCircle size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 leading-none">
                  Tolak Pengajuan
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-bold uppercase">
                  ID Peminjaman #{selectedId}
                </p>
              </div>
            </div>

            <textarea
              value={alasanTolak}
              onChange={(e) => setAlasanTolak(e.target.value)}
              placeholder="Berikan alasan penolakan..."
              className="w-full h-32 p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-red-500 focus:ring-0 transition-all resize-none text-sm font-medium mb-6"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all"
              >
                Batal
              </button>
              <button
                onClick={confirmTolak}
                disabled={!alasanTolak.trim() || processing !== null}
                className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-700 shadow-lg shadow-red-200 transition-all disabled:opacity-50"
              >
                {processing ? "Loading..." : "Konfirmasi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// SUB-COMPONENTS UNTUK KEBERSIHAN KODE
function StatCard({ title, value, color, icon }: any) {
  const colors: any = {
    blue: "from-blue-500 to-blue-600 shadow-blue-100 text-blue-600",
    purple: "from-purple-500 to-purple-600 shadow-purple-100 text-purple-600",
    amber: "from-amber-500 to-amber-600 shadow-amber-100 text-amber-600",
    emerald:
      "from-emerald-500 to-emerald-600 shadow-emerald-100 text-emerald-600",
    indigo: "from-indigo-500 to-indigo-600 shadow-indigo-100 text-indigo-600",
  };

  return (
    <div className="bg-white border-2 border-slate-50 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-black text-slate-800">{value}</p>
        </div>
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-50 ${colors[color].split(" ").pop()} group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status, jenis }: { status: string; jenis?: string }) {
  const isPesanan =
    status === "booking" || status === "pesanan" || status === "approved";

  const styles: any = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    booking: "bg-purple-100 text-purple-700 border-purple-200",
    pesanan: "bg-purple-100 text-purple-700 border-purple-200",
    approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
    disetujui: "bg-emerald-100 text-emerald-700 border-emerald-200",
    ongoing: "bg-indigo-600 text-white border-indigo-700",
    rejected: "bg-red-100 text-red-700 border-red-200",
  };

  const label =
    status === "approved" || status === "disetujui" ? "📅 Terjadwal" : status;

  return (
    <span
      className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border-b-2 ${styles[status] || "bg-slate-100"}`}
    >
      {label}
    </span>
  );
}
