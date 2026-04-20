import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Skeleton } from "../../ui/skeleton";

interface RiwayatPeminjamanAlatTableProps {
  table: TanstackTable<any>;
  loading: boolean;
  columnsCount: number;
}

export const RiwayatPeminjamanAlatTable = ({
  table,
  loading,
  columnsCount,
}: RiwayatPeminjamanAlatTableProps) => (
  <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
    <Table>
      <TableHeader className="bg-slate-900">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow
            key={headerGroup.id}
            className="hover:bg-transparent border-b border-slate-700"
          >
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="text-white font-bold text-[10px] uppercase h-14"
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i} className="border-b border-slate-100">
              <TableCell colSpan={columnsCount} className="p-4">
                <Skeleton className="h-24 w-full rounded-xl" />
              </TableCell>
            </TableRow>
          ))
        ) : table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              // Menambahkan border-b (garis bawah) yang lebih tegas dan padding vertikal
              className="group hover:bg-slate-50/80 transition-colors border-b border-slate-100 last:border-0"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="py-5 px-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columnsCount} className="h-40 text-center">
              <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                Data tidak ditemukan
              </span>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);
