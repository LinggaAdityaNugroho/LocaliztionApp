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
  TableRow,
} from "../../components/ui/table";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../components/ui/card";

import { Button } from "../../components/ui/button";

import { devices, columns } from "./dummy";

import { MyButton } from "../../components/atoms/Button";
import { Scanner } from "@yudiel/react-qr-scanner";
import { IconX } from "@tabler/icons-react";

export function HistoryPage() {
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
  const visiblePage = 3;
  let startPage = Math.max(1, currentPage - Math.floor(visiblePage / 2));
  let endPage = startPage + visiblePage - 1;

  if (endPage > getPage) {
    endPage = getPage;
    startPage = Math.max(1, endPage - visiblePage + 1);
  }

  return (
    <div className="flex flex-col gap-3 mt-8">
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
          <div className="flex justify-between">
            <CardTitle className="font-bold text-3xl">Devices List</CardTitle>
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
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {/* Pagination Size */}
          <div className="w-full flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>Size Page</Button>
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
          </div>
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
        <CardFooter className="flex flex-col gap-8">
          <span className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
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

              {getPage === visiblePage ? (
                <PaginationItem>
                  <PaginationEllipsis className="hidden" />
                </PaginationItem>
              ) : currentPage >= 3 ? (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                currentPage < 3 && (
                  <PaginationItem>
                    <PaginationEllipsis className="hidden" />
                  </PaginationItem>
                )
              )}

              {Array.from(
                { length: endPage - startPage + 1 },
                (_, i) => startPage + i
              ).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    size="default"
                    isActive={currentPage === page}
                    onClick={() => table.setPageIndex(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {visiblePage === getPage ? (
                <PaginationItem>
                  <PaginationEllipsis className="hidden" />
                </PaginationItem>
              ) : currentPage < getPage ? (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : null}

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
        </CardFooter>
      </Card>
    </div>
  );
}
