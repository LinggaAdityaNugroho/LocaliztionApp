import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../ui/card";

import { useEffect, useState } from "react";

interface Device {
  id: number;
  devices_name: string;
  mac_devices: string;
  rssi: number;
  tipe_device: boolean;
  status: number;
  x: number;
  y: number;
}

export function DashboardCard() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/device");
        if (!res.ok) throw new Error("Failed to fetch device");

        const json = await res.json();
        setDevices(json.data ?? json);
      } catch (err: any) {
        setError(err.message);
        setDevices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const total = devices.length;
  const online = devices.filter((d) => d.status === 1).length;
  const offline = devices.filter((d) => d.status === 0).length;

  return (
    <Card className="aspect-auto">
      <CardHeader>
        <CardTitle>
          <div className="flex w-full justify-between items-center">
            <p className="text-md">Total Active Tags</p>

            <div className="flex gap-2 items-center text-sm">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                <p>{online} Online</p>
              </div>

              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-red-500 rounded-full" />
                <p>{offline} Offline</p>
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="font-bold text-2xl">
          {online}
          <span className="font-light text-sm">/{total}</span> Devices
        </p>
      </CardContent>

      <CardFooter>
        <div className="flex w-full justify-end gap-2">
          <p className="text-sm font-light">Last updated</p>
          <p className="text-sm font-light">
            {new Date().toLocaleTimeString()}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
