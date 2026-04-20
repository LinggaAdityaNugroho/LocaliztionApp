import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  ArrowUpDown,
  MessageSquare,
  Image as ImageIcon,
  Clock,
  User as UserIcon,
  Circle,
} from "lucide-react";

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
    accessorKey: "lab_dan_keperluan",
    header: "Lab Dan Keperluan",
    cell: ({ row }) => {
      const laboratorium = row.original.laboratorium;
      const keperluan = row.original.keperluan;
      return (
        <div className="space-y-2 max-w-[220px]">
          <div className="flex flex-wrap gap-1">
            <p className="text-[11px] font-bold text-indigo-700 leading-tight">
              {laboratorium}
            </p>
            <p className="text-[11px] font-bold text-indigo-700 leading-tight">
              {keperluan}
            </p>
          </div>
          <div className="flex items-start gap-1.5 text-[10px] text-slate-500 bg-slate-50 p-1.5 rounded-md border border-slate-100">
            <MessageSquare
              size={12}
              className="mt-0.5 text-slate-400 shrink-0"
            />
            <span className="italic line-clamp-2">"{keperluan}"</span>
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
    accessorKey: "status",
    header: "Status & Kondisi",
    cell: ({ row }) => {
      const status = row.original.status || "Dipinjam";

      const masuk = row.original.kondisi_masuk;
      const keluar = row.original.kondisi_keluar;

      const isReturned = status === "returned";

      return (
        <div className="flex flex-col gap-2  min-w-[100px]">
          {/* Badge Status Peminjaman */}
          <Badge
            className={`px-2 py-0.5 rounded-full border-none font-bold text-[10px] uppercase tracking-wider ${
              isReturned
                ? "bg-slate-100 text-slate-600"
                : "bg-amber-100 text-amber-700 animate-pulse"
            }`}
          >
            <Circle
              size={8}
              className={`mr-1 fill-current ${isReturned ? "text-slate-400" : "text-amber-500"}`}
            />
            {status}
          </Badge>

          {/* Info Kondisi (Masuk & Keluar) */}
          <div className="flex flex-col gap-1 ">
            {masuk && (
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                Awal: <span className="text-slate-600">{masuk}</span>
              </div>
            )}

            {keluar && (
              <div
                className={`flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                  keluar.toLowerCase() === "bersih" ||
                  keluar.toLowerCase() === "kotor"
                    ? "bg-red-50 text-red-600"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {keluar.toLowerCase() === "bersih" ||
                keluar.toLowerCase() === "kotor"
                  ? `✗ ${keluar}`
                  : `✓ ${keluar}`}
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "waktu",
    header: "Timeline",
    cell: ({ row }) => {
      const formatWaktu = (dateString: string | null) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return {
          date: date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
          }),
          time: date.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
      };

      const inTime = formatWaktu(row.original.created_at);
      const outTime = formatWaktu(row.original.waktu_kembali);

      return (
        <div className="flex flex-col gap-2 min-w-[120px]">
          <div className="flex items-center justify-between bg-emerald-50/50 p-1.5 rounded-lg border border-emerald-100">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-emerald-600 uppercase">
                Check-In
              </span>
              <span className="text-[10px] font-bold text-slate-700">
                {inTime?.date}, {inTime?.time}
              </span>
            </div>
            <Clock size={12} className="text-emerald-400" />
          </div>

          <div
            className={`flex items-center justify-between p-1.5 rounded-lg border ${
              outTime
                ? "bg-slate-50 border-slate-200"
                : "bg-slate-50/30 border-dashed border-slate-200"
            }`}
          >
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-400 uppercase">
                Check-Out
              </span>
              <span
                className={`text-[10px] font-bold ${outTime ? "text-slate-700" : "text-slate-300 italic"}`}
              >
                {outTime ? `${outTime.date}, ${outTime.time}` : "Pending"}
              </span>
            </div>
            <Clock
              size={12}
              className={outTime ? "text-slate-400" : "text-slate-200"}
            />
          </div>
        </div>
      );
    },
  },
];
