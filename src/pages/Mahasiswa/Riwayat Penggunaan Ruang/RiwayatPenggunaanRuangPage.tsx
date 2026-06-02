import { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import type { SortingState } from "@tanstack/react-table";

import api from "../../../services/api";
import { getColumns } from "./columns";
import { LoanFilterCard } from "../../../components/molecules/LoanFilterCard";
import { StatsSummaryGrid } from "../../../components/organism/StatsSummaryGrid";
import { Lightbox } from "../../../components/atoms/LightBox";

import { RiwayatPeminjamanAlatTable } from "../../../components/organism/Table/RiwayatPeminjamanAlatTable";
import { PageLayout } from "../../../layouts/PageLayout";
import { LoanPagination } from "../../../components/organism/LoanPagination";

export function RiwayatPenggunaanRuangPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // Form State untuk Filter Waktu Sesi Lab
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndingDate] = useState<string>("");

  const fetchRiwayat = async () => {
    try {
      setLoading(true);
      const response = await api.get("mahasiswa/riwayat-ruang");
      setData(response.data.data || []);
    } catch (error) {
      console.error("Gagal sinkronisasi data riwayat ruang:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  const columns = useMemo(() => getColumns(setSelectedImg), []);

  // 👑 FILTER LOGIC: Menyaring data respons lokal berdasarkan format penanggalan
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (!item.waktu_masuk) return true;

      // Parsing format response "25 May 2026, 17:44" -> ambil bagian tanggal saja
      // "25 May 2026" diubah menjadi objek Date untuk dievaluasi rentangnya
      const cleanDateStr = item.waktu_masuk.split(",")[0].trim();
      const itemDate = new Date(cleanDateStr);

      if (isNaN(itemDate.getTime())) return true;

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (itemDate < start) return false;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (itemDate > end) return false;
      }

      return true;
    });
  }, [data, startDate, endDate]);

  const stats = useMemo(() => {
    return {
      total: filteredData.length,
      returned: filteredData.filter((i) => {
        const status = i.status?.toLowerCase().trim();
        return (
          status === "returned" ||
          status === "selesai" ||
          status === "dikembalikan"
        );
      }).length,
      baik: filteredData.filter((i) => {
        const kondisi = i.kondisi_keluar?.toLowerCase().trim();
        return kondisi === "baik" || kondisi === "bersih" || kondisi === "good";
      }).length,
      rusak: filteredData.filter((i) => {
        const kondisi = i.kondisi_keluar?.toLowerCase().trim();
        return (
          kondisi === "rusak" || kondisi === "broken" || kondisi === "kotor"
        );
      }).length,
    };
  }, [filteredData]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  const table = useReactTable({
    data: filteredData, // Gunakan data hasil filter penanggalan
    columns,
    state: {
      globalFilter,
      sorting,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: itemsPerPage,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  const handleClearFilters = () => {
    setStartDate("");
    setEndingDate("");
    setCurrentPage(1);
  };

  return (
    <PageLayout
      pageTitle="Riwayat Penggunaan Ruang"
      pageDescription="Daftar rekam jejak penggunaan ruang lab praktikum, status inventarisasi log, serta lampiran verifikasi kondisi fisik."
    >
      <div className="py-6 w-full space-y-6 antialiased text-left bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300">
        <StatsSummaryGrid stats={stats} />

        {/* 👑 INTEGRASI FILTER: Panel filter waktu berbasis Atomic DatePicker */}
        <LoanFilterCard
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={(val) => {
            setStartDate(val);
            setCurrentPage(1);
          }}
          onEndDateChange={(val) => {
            setEndingDate(val);
            setCurrentPage(1);
          }}
          onClear={handleClearFilters}
        />

        <div className="overflow-hidden w-full">
          <RiwayatPeminjamanAlatTable
            table={table}
            loading={loading}
            columnsCount={columns.length}
          />
        </div>

        <div className="w-full flex justify-center pt-2">
          <LoanPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        <Lightbox src={selectedImg} onClose={() => setSelectedImg(null)} />
      </div>
    </PageLayout>
  );
}
