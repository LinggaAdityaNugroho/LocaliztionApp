import { type ColumnDef } from "@tanstack/react-table";
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
    header: "Peminjam",
    cell: ({ row }) => {
      const nama_mahasiswa = row.original.nama_mahasiswa;
      const nim_mahasiswa = row.original.nim_mahasiswa;
      return (
        <div className="flex items-center gap-3 py-1 text-left">
          <div className="h-8 w-8 rounded-none bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-900 dark:text-white border-2 border-zinc-950 dark:border-zinc-800 shrink-0">
            <UserIcon size={13} />
          </div>
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
    accessorKey: "lab_dan_keperluan",
    header: "Lab & Keperluan",
    cell: ({ row }) => {
      const laboratorium = row.original.laboratorium;
      const keperluan = row.original.keperluan;
      return (
        <div className="space-y-2 max-w-[220px] py-1 text-left">
          <div className="flex flex-wrap gap-1.5">
            <div className="bg-white dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-800 rounded-none px-2.5 py-0.5 shadow-none text-xs font-sans font-black text-zinc-900 dark:text-zinc-100 leading-tight">
              {laboratorium || "N/A"}
            </div>
          </div>
          {keperluan && (
            <div className="flex items-start gap-1.5 text-[10px] font-sans font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/40 p-2 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-none">
              <MessageSquare
                size={11}
                className="mt-0.5 text-zinc-400 shrink-0"
              />
              <span className="line-clamp-2">"{keperluan}"</span>
            </div>
          )}
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
                  className="h-10 w-14 rounded-none border-2 border-zinc-950 dark:border-zinc-800 bg-white cursor-pointer shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none transition-all relative overflow-hidden shrink-0"
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
    accessorKey: "status",
    header: "Status & Kondisi",
    cell: ({ row }) => {
      const status = row.original.status || "Ongoing";
      const masuk = row.original.kondisi_masuk;
      const keluar = row.original.kondisi_keluar;
      const isReturned =
        status?.toLowerCase().trim() === "returned" ||
        status?.toLowerCase().trim() === "selesai";

      return (
        <div className="flex flex-col gap-2 items-start py-1 text-left">
          <Badge
            variant="outline"
            className={`px-2 py-0.5 rounded-none border-2 shadow-none font-mono font-black text-[9px] tracking-wider uppercase ${
              isReturned
                ? "bg-white dark:bg-zinc-900 text-zinc-500 border-zinc-950 dark:border-zinc-800"
                : "bg-white dark:bg-zinc-900 text-amber-600 border-zinc-950 dark:border-zinc-800 animate-pulse"
            }`}
          >
            <Circle
              size={6}
              className={`mr-1.5 fill-current ${isReturned ? "text-zinc-400" : "text-amber-500"}`}
            />
            {status}
          </Badge>

          <div className="flex flex-col gap-1 w-full">
            {masuk && (
              <div className="text-[9px] font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-wider uppercase pl-0.5">
                Awal:{" "}
                <span className="text-zinc-700 dark:text-zinc-300">
                  {masuk}
                </span>
              </div>
            )}

            {keluar && (
              <Badge
                variant="outline"
                className={`px-2 py-0.5 rounded-none border-2 shadow-none font-mono font-black text-[9px] tracking-wider uppercase w-fit ${
                  keluar.toLowerCase().trim() === "kotor" ||
                  keluar.toLowerCase().trim() === "rusak"
                    ? "bg-white dark:bg-zinc-900 text-red-500 border-zinc-950 dark:border-zinc-800"
                    : "bg-white dark:bg-zinc-900 text-emerald-600 border-zinc-950 dark:border-zinc-800"
                }`}
              >
                {keluar.toLowerCase().trim() === "kotor" ||
                keluar.toLowerCase().trim() === "rusak"
                  ? `✗ ${keluar}`
                  : `✓ ${keluar}`}
              </Badge>
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
            year: "numeric",
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
        <div className="flex flex-col gap-2 min-w-[140px] py-1 text-left">
          <div className="flex items-center justify-between bg-white dark:bg-zinc-900 p-2 border-2 border-zinc-950 dark:border-zinc-800 rounded-none shadow-none">
            <div className="flex flex-col">
              <span className="text-[8px] font-mono font-black text-emerald-600 tracking-wider uppercase">
                Check-in
              </span>
              <span className="text-[10px] font-mono font-bold text-zinc-700 dark:text-zinc-300 mt-0.5">
                {inTime ? `${inTime.date} • ${inTime.time}` : "-"}
              </span>
            </div>
            <Clock size={11} className="text-zinc-400 shrink-0 ml-1" />
          </div>

          <div
            className={`flex items-center justify-between bg-white dark:bg-zinc-900 p-2 border-2 rounded-none shadow-none ${
              outTime
                ? "border-zinc-950 dark:border-zinc-800"
                : "border-dashed border-zinc-300 dark:border-zinc-800"
            }`}
          >
            <div className="flex flex-col">
              <span className="text-[8px] font-mono font-black text-zinc-400 dark:text-zinc-500 tracking-wider uppercase">
                Check-out
              </span>
              <span
                className={`text-[10px] font-mono font-bold mt-0.5 ${outTime ? "text-zinc-700 dark:text-zinc-300" : "text-zinc-300 dark:text-zinc-700 font-medium"}`}
              >
                {outTime ? `${outTime.date} • ${outTime.time}` : "Pending"}
              </span>
            </div>
            <Clock
              size={11}
              className={
                outTime
                  ? "text-zinc-400 shrink-0 ml-1"
                  : "text-zinc-200 dark:text-zinc-800 shrink-0 ml-1"
              }
            />
          </div>
        </div>
      );
    },
  },
];
