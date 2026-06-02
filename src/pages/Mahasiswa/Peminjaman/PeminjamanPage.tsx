import { useEffect, useState, useCallback, useMemo } from "react";
import DetailPeminjamanModal from "./DetailPeminjamanModal";
import { LoanStatsGrid } from "../../../components/organism/LoanStatGrid";
import { LoanCard } from "../../../components/molecules/LoanCard";
import { LoanFilterCard } from "../../../components/molecules/LoanFilterCard";
import { LoanStatusTabs } from "../../../components/organism/LoanStatusTabs";
import { LoanPagination } from "../../../components/organism/LoanPagination";
import { PageLayout } from "../../../layouts/PageLayout";
import api from "../../../services/api";
import { Loader2, ClipboardX } from "lucide-react";
import Swal from "sweetalert2";

type StatusTab =
  | "ALL"
  | "PENDING"
  | "APPROVED"
  | "ONGOING"
  | "SELESAI"
  | "DITOLAK";
const TABS_LIST: StatusTab[] = [
  "ALL",
  "PENDING",
  "APPROVED",
  "ONGOING",
  "SELESAI",
  "DITOLAK",
];

export default function PeminjamanPage() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);

  const [activeTab, setActiveTab] = useState<StatusTab>("ALL");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;

  const fetchMyLoans = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/mahasiswa/riwayat-saya");
      const responseData = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      const normalizedLoans = responseData.map((item: any) => {
        let mappedStatus = item.status;
        if (item.status === "menunggu" || item.status === "dipesan")
          mappedStatus = "pending";
        if (item.status === "disetujui") mappedStatus = "approved";
        if (item.status === "berlangsung") mappedStatus = "ongoing";

        return { ...item, status: mappedStatus };
      });

      const activeLoans = normalizedLoans.filter((item: any) =>
        ["pending", "approved", "ongoing", "selesai", "ditolak"].includes(
          item.status,
        ),
      );

      setList(activeLoans);
    } catch (err) {
      console.error("Gagal mengambil data peminjaman", err);
      setList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyLoans();
  }, [fetchMyLoans]);

  const handleFileChange = async (
    id: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("foto_before", file);

    try {
      setUploading(id);
      await api.post(`/peminjaman/${id}/upload-before`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        title: "Unggah Sukses",
        text: "Foto alat berhasil disimpan! Status peminjaman Anda sekarang Berlangsung (Ongoing).",
        icon: "success",
        confirmButtonColor: "#18181b",
      });

      fetchMyLoans();
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Gagal mengunggah foto. Pastikan ukuran file max 2MB.";
      Swal.fire("Gagal", msg, "error");
    } finally {
      setUploading(null);
    }
  };

  const handleCardClick = (item: any) => {
    setSelectedData(item);
    setIsModalOpen(true);
  };

  const filteredList = useMemo(() => {
    return list.filter((item) => {
      const matchStatus =
        activeTab === "ALL" || item.status?.toUpperCase() === activeTab;
      if (!item.created_at) return matchStatus;

      const itemDate = new Date(item.created_at).setHours(0, 0, 0, 0);
      const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
      const end = endDate ? new Date(endDate).setHours(0, 0, 0, 0) : null;

      if (start && itemDate < start) return false;
      if (end && itemDate > end) return false;

      return matchStatus;
    });
  }, [list, activeTab, startDate, endDate]);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1;

  const paginatedList = useMemo(() => {
    const offset = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(offset, offset + itemsPerPage);
  }, [filteredList, currentPage]);

  const stats = useMemo(() => {
    return {
      total: list.length,
      menunggu: list.filter((item) => item.status === "pending").length,
      disetujui: list.filter((item) => item.status === "approved").length,
      berlangsung: list.filter((item) => item.status === "ongoing").length,
      selesai: list.filter((item) => item.status === "selesai").length,
      ditolak: list.filter((item) => item.status === "ditolak").length,
      dipesan: 0,
    };
  }, [list]);

  return (
    <PageLayout
      pageTitle="Riwayat Peminjaman"
      pageDescription="Pantau status validasi praktikum, unggah dokumen telemetri, dan kelola sasis logbook."
    >
      <div className="space-y-6">
        <LoanStatsGrid stats={stats} />

        <LoanFilterCard
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={(val) => {
            setStartDate(val);
            setCurrentPage(1);
          }}
          onEndDateChange={(val) => {
            setEndDate(val);
            setCurrentPage(1);
          }}
          onClear={() => {
            setStartDate("");
            setEndDate("");
            setCurrentPage(1);
          }}
        />

        <LoanStatusTabs
          tabs={TABS_LIST}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentPage(1);
          }}
          listData={list}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 gap-3 bg-white dark:bg-zinc-900/10 rounded-4xl border-2 border-zinc-950 dark:border-zinc-800">
            <Loader2 className="animate-spin h-7 w-7 text-zinc-900 dark:text-zinc-50" />
            <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-mono font-black uppercase tracking-widest">
              Sinkronisasi Berkas Peminjaman...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {paginatedList.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-4 animate-in fade-in duration-200">
                  {paginatedList.map((item) => (
                    <LoanCard
                      key={item.id}
                      item={item}
                      uploading={uploading}
                      onCardClick={handleCardClick}
                      onFileChange={handleFileChange}
                    />
                  ))}
                </div>

                <LoanPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : (
              <div className="text-center py-24 bg-zinc-50/50 dark:bg-zinc-950/20 rounded-4xl border-2 border-dashed border-zinc-200 dark:border-zinc-800/80">
                <div className="w-14 h-14 bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 rounded-xl flex items-center justify-center mx-auto mb-4 text-zinc-400 dark:text-zinc-600 shadow-sm">
                  <ClipboardX size={24} />
                </div>
                <h3 className="text-xs font-mono font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-widest">
                  Data Tidak Ditemukan
                </h3>
              </div>
            )}
          </div>
        )}

        <DetailPeminjamanModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={selectedData}
        />
      </div>
    </PageLayout>
  );
}
