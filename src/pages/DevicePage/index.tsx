import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getPaginationRowModel,
  type SortingState,
} from "@tanstack/react-table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "../../components/ui/pagination";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableCaption,
  TableRow,
} from "../../components/ui/table";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";

import { Button } from "../../components/ui/button";

import { devices, columns } from "./dummy";

import { MyButton } from "../../components/atoms/Button";
import { Scanner } from "@yudiel/react-qr-scanner";
import { IconX } from "@tabler/icons-react";

export function DeviceManagement() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [qr, setQr] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const table = useReactTable({
    columns,
    data: devices,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: { sorting, pagination },
  });

  const getPage = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        {" "}
        <MyButton
          titleButton="Add Device"
          onClick={() => setQr(!qr)}
          size="lg"
          className="w-24 text-xs sm:text-sm md:text-base 
    lg:w-32
  "
        />
      </div>
      {qr && (
        <div className="w-full inset-0  fixed flex items-center justify-center z-10 bg-black/50 ">
          <Card>
            <CardContent>
              <div className="w-50 flex flex-col gap-2">
                <div className="flex justify-end w-full">
                  <MyButton onClick={() => setQr(!qr)} className="w-8 h-8">
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
          {/* Pagination Size */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>asd</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {[5, 10, 15].map((size) => (
                <DropdownMenuItem
                  key={size}
                  onClick={() => table.setPageSize(size)}
                >
                  {size}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Pagination */}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  size="default"
                  onClick={() => table.previousPage()}
                  className={
                    !table.getCanPreviousPage()
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>

              {currentPage > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {Array.from({ length: table.getPageCount() }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    size="default"
                    isActive={table.getState().pagination.pageIndex === i}
                    onClick={() => table.setPageIndex(i)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {getPage > currentPage && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  size="default"
                  onClick={() => table.nextPage()}
                  className={
                    !table.getCanNextPage()
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

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
            <TableCaption>
              <span className="text-sm text-muted-foreground">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
            </TableCaption>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
