import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "../../../components/ui/button";
import {
  ArrowUpDown,
  Image as ImageIcon,
  Tag,
  Clock,
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
        className="text-[10px] font-mono font-black tracking-wider text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-none transition-all"
      >
        ID <ArrowUpDown className="ml-1.5 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-mono text-xs font-black text-zinc-400 dark:text-zinc-500 ml-3">
        #{row.getValue("id")}
      </span>
    ),
  },
  {
    accessorKey: "user.name",
    header: "Nama",
    cell: ({ row }) => {
      const nama_mahasiswa = row.original.nama_mahasiswa;
      const nim_mahasiswa = row.original.nim_mahasiswa;
      return (
        <div className="flex items-center gap-3 py-1 text-left">
          <div>
            <div className="font-mono font-black text-zinc-900 dark:text-zinc-100 text-xs tracking-tight">
              {nama_mahasiswa || "N/A"}
            </div>
            <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 font-bold tracking-wide mt-0.5">
              NIM: {nim_mahasiswa || "---"}
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
        <div className="space-y-2 max-w-[220px] py-1 text-left">
          <div>
            <p className="text-xs font-sans font-black text-zinc-900 dark:text-zinc-100 leading-tight">
              {nama_alat}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 px-2.5 py-1 rounded-none   w-fit">
            <Tag size={10} className="text-zinc-400" />
            <span className="text-xs font-mono font-black text-zinc-800 dark:text-zinc-200 tracking-wider">
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
        <div className="flex gap-3 py-1 justify-start">
          {images.map((img, idx) => (
            <div key={idx} className="group relative">
              <span className="absolute -top-3.5 left-0.5 text-[7px] font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                {img.label}
              </span>

              {img.url ? (
                <div
                  className="h-12  w-24 rounded-none border-2 border-zinc-950 dark:border-zinc-800 bg-white cursor-pointer transition-all relative overflow-hidden shrink-0"
                  onClick={() => setSelectedImg(img.url!)}
                >
                  <img
                    src={img.url}
                    className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-200"
                    alt={img.label}
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="h-10 w-14 rounded-none bg-white dark:bg-zinc-950 border-2 border-dashed border-zinc-300 dark:border-zinc-800 flex items-center justify-center text-zinc-400 shrink-0 shadow-none">
                  <ImageIcon size={13} />
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
      const tgl_kembali = row.original.waktu_kembali;

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
        <div className="flex flex-col gap-3 min-w-[260px] p-4 bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 transition-all text-left">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-50 dark:bg-red-950/20 border-2 border-zinc-950 dark:border-zinc-800 text-red-500 rounded-none shrink-0 shadow-none">
              <AlertTriangle size={15} />
            </div>

            <div className="flex flex-col gap-0.5 flex-1">
              <span className="text-[9px] font-mono font-black tracking-widest text-red-500">
                Deskripsi kendala
              </span>
              <h2 className="text-xs font-sans font-black text-zinc-900 dark:text-zinc-100 leading-tight">
                {deskripsi_kerusakan || "Tidak ada deskripsi kerusakan"}
              </h2>
            </div>
          </div>

          <Separator className="bg-zinc-200 dark:bg-zinc-800 h-0.5" />

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 font-medium">
              <div className="p-1 bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-none">
                <Clock size={11} className="text-zinc-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] text-zinc-400 font-mono font-black tracking-wider leading-none">
                  Dilaporkan pada
                </span>
                <span className="leading-tight text-[11px] font-mono font-bold text-zinc-700 dark:text-zinc-300 mt-0.5">
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
