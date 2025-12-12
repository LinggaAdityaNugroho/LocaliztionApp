import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  type SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";

import { devices, columns } from "./dummy";

import { MyButton } from "../../components/atoms/Button";
import { Scanner } from "@yudiel/react-qr-scanner";
import { IconX } from "@tabler/icons-react";

export function DeviceManagement() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [qr, setQr] = useState(false);

  const table = useReactTable({
    columns,
    data: devices,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        {" "}
        <MyButton
          titleButton="Add Device"
          onClick={() => setQr(!qr)}
          size="lg"
          classsName="w-30"
        />
      </div>
      {qr && (
        <div className="w-full inset-0  fixed flex items-center justify-center z-10 bg-black/50 ">
          <Card>
            <CardContent>
              <div className="w-50 flex flex-col gap-2">
                <div className="flex justify-end w-full">
                  <MyButton onClick={() => setQr(!qr)} classsName="w-8 h-8">
                    <IconX />
                  </MyButton>
                </div>
                <div className="qr-wrap">
                  <Scanner
                    onScan={(result) => console.log(result)}
                    constraints={{
                      facingMode: "enviroment",
                      aspectRatio: 1,
                      width: { ideal: 200 },
                      height: { ideal: 200 },
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="font-bold text-3xl">Devices List</CardTitle>
        </CardHeader>

        <CardContent>
          <Table className="border-2 rounded-2xl">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="cursor-pointer select-none"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length}>No result…</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
