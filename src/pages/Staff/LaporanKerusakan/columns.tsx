import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../../components/ui/button";
import {
  ArrowUpDown,
  Image as ImageIcon,
  Tag,
  Clock,
  User as UserIcon,
  AlertTriangle,
} from "lucide-react";
import { Separator } from "../../../components/ui/separator";

export const getColumns = (
  setSelectedImg: (url: string) => void,
): ColumnDef<any>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
      >
        ID <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs font-bold text-slate-400 ml-2">
        #{row.getValue("id")}
      </span>
    ),
  },
  {
    accessorKey: "user.name",
    header: "Peminjam",
    cell: ({ row }) => {
      const nama_mahasiswa = row.original.nama_mahasiswa;
      const nim_mahasiswa = row.original.nim_mahasiswa;
      return (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
            <UserIcon size={14} />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm leading-none mb-1">
              {nama_mahasiswa || "N/A"}
            </div>
            <div className="text-[10px] text-slate-500 font-medium tracking-wide">
              NIM: {nim_mahasiswa}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "informas_alat",
    header: "Informasi Alat",
    cell: ({ row }) => {
      const nama_alat = row.original.nama_alat;
      const kode_tag = row.original.kode_tag;
      return (
        <div className="space-y-2 max-w-[220px]">
          <div className="flex flex-wrap gap-1">
            <p className="text-[11px] font-bold text-indigo-700 leading-tight">
              {nama_alat}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-indigo-50/50 px-2 py-1 rounded-md border border-indigo-100 w-fit">
            <Tag size={10} className="text-indigo-500 shrink-0" />
            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-tight tabular-nums">
              {kode_tag}
            </span>
          </div>
        </div>
      );
    },
  },

  {
    id: "dokumentasi",
    header: "Dokumentasi",
    cell: ({ row }) => {
      const getImageUrl = (path: string | null) =>
        path ? `http://localhost:8000/storage/${path}` : null;

      const images = [
        { url: getImageUrl(row.original.foto_before), label: "Before" },
        { url: getImageUrl(row.original.foto_after), label: "After" },
      ];

      return (
        <div className="flex  gap-3">
          {images.map((img, idx) => (
            <div key={idx} className="group relative">
              {/* Label melayang saat hover */}
              <span className="absolute -top-3 left-0 text-[7px] font-black uppercase text-slate-400 tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                {img.label}
              </span>

              {img.url ? (
                <div
                  className="h-12 w-12 rounded-xl border-2 border-white shadow-sm overflow-hidden cursor-zoom-in ring-1 ring-slate-200 hover:ring-indigo-500 hover:scale-110 transition-all bg-slate-100"
                  onClick={() => setSelectedImg(img.url!)}
                >
                  <img
                    src={img.url}
                    className="h-full w-full object-cover"
                    alt={img.label}
                    loading="lazy"
                  />
                </div>
              ) : (
                /* Tampilan jika foto kosong/null */
                <div className="h-12 w-12 rounded-xl bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center">
                  <ImageIcon size={14} className="text-slate-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      );
    },
  },

  {
    accessorKey: "detail_kerusakan",
    header: "Detail Kerusakan",
    cell: ({ row }) => {
      const deskripsi_kerusakan = row.original.deskripsi_kerusakan;
      const tgl_kembali = row.original.tanggal_kembali;

      const formatDateTime = (dateString: any) => {
        if (!dateString) return "-";
        try {
          const date = new Date(dateString);
          return new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
            .format(date)
            .replace(",", " •");
        } catch (e) {
          return dateString;
        }
      };

      return (
        <div className="flex flex-col gap-3 min-w-[250px] p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
          {/* Header: Judul Kerusakan with Warning Accent */}
          <div className="flex items-start gap-3">
            {/* Visual Warning Icon */}
            <div className="p-2 bg-red-100 rounded-lg text-red-600 group-hover:scale-110 transition-transform">
              <AlertTriangle size={20} className="stroke-[2.5]" />
            </div>

            <div className="flex flex-col gap-0.5 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-700">
                Deskripsi Kendala
              </span>
              <h2 className="text-sm font-semibold text-slate-900 leading-tight">
                {deskripsi_kerusakan || "Tidak ada deskripsi"}
              </h2>
            </div>
          </div>

          <Separator className="bg-red-100/50" />

          {/* Footer: Time with Subtle Accent */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <div className="p-1 bg-red-100 rounded-md">
                <Clock size={12} className="text-red-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-red-400 font-medium leading-none">
                  Dilaporkan pada
                </span>
                <span className="leading-tight text-xs text-slate-700">
                  {formatDateTime(tgl_kembali)}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
];
