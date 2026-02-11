// data dummy
import type { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../components/ui/dropdown-menu";

import { IconSelector, IconArrowUp, IconArrowDown } from "@tabler/icons-react";

import { Button } from "../../components/ui/button";

interface typeData {
  deviceID: string;
  name: string;
  Mac: number;
  type: string;
  status: string;
  position: string;
}

export const devices: typeData[] = [
  {
    deviceID: "A1",
    name: "Anchor 1",
    Mac: 1234,
    type: "Anchor",
    status: "Online",
    position: "(212, 322)",
  },
  {
    deviceID: "A2",
    name: "Anchor 2",
    Mac: 1234,
    type: "Anchor",
    status: "Offline",
    position: "(212, 322)",
  },
  {
    deviceID: "B1",
    name: "Beacon 2",
    Mac: 1234,
    type: "Beacon",
    status: "Online",
    position: "(212, 322)",
  },
  {
    deviceID: "B2",
    name: "Beacon 2",
    Mac: 1234,
    type: "Beacon",
    status: "Offline",
    position: "(212, 322)",
  },
  {
    deviceID: "B2",
    name: "Beacon 2",
    Mac: 1234,
    type: "Beacon",
    status: "Offline",
    position: "(212, 322)",
  },
  {
    deviceID: "B2",
    name: "Beacon 2",
    Mac: 1234,
    type: "Beacon",
    status: "Offline",
    position: "(212, 322)",
  },
  {
    deviceID: "B2",
    name: "Beacon 2",
    Mac: 1234,
    type: "Beacon",
    status: "Offline",
    position: "(212, 322)",
  },
  {
    deviceID: "B2",
    name: "Beacon 2",
    Mac: 1234,
    type: "Beacon",
    status: "Offline",
    position: "(212, 322)",
  },
  {
    deviceID: "B2",
    name: "Beacon 2",
    Mac: 1234,
    type: "Beacon",
    status: "Offline",
    position: "(212, 322)",
  },
  {
    deviceID: "B2",
    name: "Beacon 2",
    Mac: 1234,
    type: "Beacon",
    status: "Offline",
    position: "(212, 322)",
  },
  {
    deviceID: "B2",
    name: "Beacon 2",
    Mac: 1234,
    type: "Beacon",
    status: "Offline",
    position: "(212, 322)",
  },
  {
    deviceID: "B2",
    name: "Beacon 2",
    Mac: 1234,
    type: "Beacon",
    status: "Offline",
    position: "(212, 322)",
  },
  {
    deviceID: "B2",
    name: "Beacon 2",
    Mac: 1234,
    type: "Beacon",
    status: "Offline",
    position: "(212, 322)",
  },
  {
    deviceID: "B2",
    name: "Beacon 2",
    Mac: 1234,
    type: "Beacon",
    status: "Offline",
    position: "(212, 322)",
  },
  {
    deviceID: "B2",
    name: "Beacon 2",
    Mac: 1234,
    type: "Beacon",
    status: "Offline",
    position: "(212, 322)",
  },
  {
    deviceID: "B2",
    name: "Beacon 2",
    Mac: 1234,
    type: "Beacon",
    status: "Offline",
    position: "(212, 322)",
  },
  {
    deviceID: "B2",
    name: "Beacon 2",
    Mac: 1234,
    type: "Beacon",
    status: "Offline",
    position: "(212, 322)",
  },
  {
    deviceID: "B2",
    name: "Beacon 2",
    Mac: 1234,
    type: "Beacon",
    status: "Offline",
    position: "(212, 322)",
  },
  {
    deviceID: "B2",
    name: "Beacon 2",
    Mac: 1234,
    type: "Beacon",
    status: "Offline",
    position: "(212, 322)",
  },
  {
    deviceID: "B2",
    name: "Beacon 2",
    Mac: 1234,
    type: "Beacon",
    status: "Offline",
    position: "(212, 322)",
  },
  {
    deviceID: "B2",
    name: "Beacon 2",
    Mac: 1234,
    type: "Beacon",
    status: "Offline",
    position: "(212, 322)",
  },
];

export const columns: ColumnDef<typeData>[] = [
  {
    accessorKey: "deviceID",
    header: ({ column }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="border-0">
              Device ID
              <IconSelector stroke={2} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom">
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <IconArrowUp stroke={2} />
              <p>Asc</p>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <IconArrowDown stroke={2} />
              <p>Desc</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: true,
  },

  { accessorKey: "name", header: "Name", enableSorting: true },
  { accessorKey: "Mac", header: "MAC", enableSorting: true },
  { accessorKey: "type", header: "Type", enableSorting: true },
  { accessorKey: "status", header: "Status", enableSorting: true },
  { accessorKey: "position", header: "Position", enableSorting: true },
];
