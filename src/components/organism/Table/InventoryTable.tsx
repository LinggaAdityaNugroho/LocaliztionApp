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

export const InventoryTable = ({
  table,
  loading,
  columnsCount,
}: {
  table: TanstackTable<any>;
  loading: boolean;
  columnsCount: number;
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
    <Table>
      <TableHeader className="bg-slate-900">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow
            key={headerGroup.id}
            className="hover:bg-transparent border-none"
          >
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="text-white font-bold text-[10px] uppercase h-12"
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
            <TableRow key={i}>
              <TableCell colSpan={columnsCount} className="p-4">
                <Skeleton className="h-10 w-full" />
              </TableCell>
            </TableRow>
          ))
        ) : table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className="py-4 px-4 font-medium text-slate-700"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columnsCount}
              className="h-32 text-center text-slate-400 font-bold uppercase text-xs"
            >
              Data Kosong
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);
