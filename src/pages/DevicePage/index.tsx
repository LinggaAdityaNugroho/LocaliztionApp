import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { DeviceTable } from "../../components/molecules/DeviceTable";
import { DevicePagination } from "../../components/molecules/DevicePagination";
import { QrScannerModal } from "../../components/molecules/QRScannerModal";
import { DeviceManagementTemplate } from "../../layouts/DeviceManagementTemplate";
import { MyButton } from "../../components/atoms/Button";
import { deviceColumns } from "./columns";
import type { Device, DeviceUpdateEvent } from "../../types/Device";
import { DevicePageSize } from "../../components/molecules/DevicePageSize";
import echo from "../Chat/echo";

export function DeviceManagement() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [qr, setQr] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  // fetch api
  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/device");
        const dataDevice = await response.json();
        setDevices([...dataDevice.data].reverse());
      } catch (err) {
        console.log(err);
      }
    };
    fetchDevice();
  }, []);

  // set realtime
  useEffect(() => {
    echo.channel("device-channel").listen(".device.updated", (e: any) => {
      setDevices((prev) => {
        const isExist = prev.some((device) => device.id === e.id);
        if (isExist) {
          return prev.map((device) => (device.id === e.id ? e : device));
        } else {
          return [e, ...prev];
        }
      });
    });

    return () => {
      echo.leave("device-channel");
    };
  }, []);

  // setup table
  const table = useReactTable({
    data: devices,
    columns: deviceColumns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <QrScannerModal open={qr} onClose={() => setQr(false)} />

      <DeviceManagementTemplate
        header={
          <div className="flex justify-between items-center gap-4">
            <h2 className="text-2xl font-bold">Devices List</h2>
            <div className="flex items-center gap-2">
              <DevicePageSize table={table} />
              <MyButton titleButton="Add Device" onClick={() => setQr(true)} />
            </div>
          </div>
        }
        table={<DeviceTable table={table} columns={deviceColumns} />}
        pagination={<DevicePagination table={table} />}
      />
    </>
  );
}
