import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../../../components/ui/button";
import { MapPin, Tag, Pencil, Trash2 } from "lucide-react";
import { ConditionBadge } from "../../../components/atoms/ConditionBadge";
import { StockBadge } from "../../../components/atoms/StockBadge";

export const getColumns = (
  isStaff: boolean,
  onEdit: (data: any) => void,
  onDelete: (id: number) => void,
): ColumnDef<any>[] => [
  {
    header: "NO",
    cell: (info) => (
      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
        {info.row.index + 1}
      </div>
    ),
  },
  {
    header: "NAMA ALAT",
    accessorKey: "nama_alat",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-slate-900">
          {row.original.nama_alat}
        </span>
        <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1 uppercase font-semibold tracking-wider">
          <MapPin size={10} className="text-slate-400" /> {row.original.letak}
        </div>
      </div>
    ),
  },
  {
    header: "KODE TAG",
    accessorKey: "kode_tag",
    cell: ({ row }) =>
      row.original.kode_tag ? (
        <div className="inline-flex items-center gap-2 px-2 py-1 bg-indigo-50 border border-indigo-100 rounded-md">
          <Tag size={12} className="text-indigo-600" />
          <code className="text-[11px] font-black text-indigo-700 uppercase tracking-tighter">
            {row.original.kode_tag}
          </code>
        </div>
      ) : (
        <span className="text-[10px] font-bold text-slate-400 uppercase italic tracking-widest">
          Konsumsi
        </span>
      ),
  },
  {
    header: "STOK",
    accessorKey: "jumlah",
    cell: ({ row }) => <StockBadge jumlah={row.original.jumlah} />,
  },
  {
    header: "KONDISI",
    accessorKey: "kondisi",
    cell: ({ row }) => (
      <ConditionBadge
        kondisi={row.original.kondisi}
        isConsumable={!row.original.kode_tag}
      />
    ),
  },
  ...(isStaff
    ? [
        {
          header: "AKSI",
          id: "actions",
          cell: ({ row }: any) => (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-blue-600 border-blue-100 hover:bg-blue-50"
                onClick={() => onEdit(row.original)}
              >
                <Pencil size={14} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 text-red-600 border-red-100 hover:bg-red-50"
                onClick={() => onDelete(row.original.id)}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          ),
        },
      ]
    : []),
];
