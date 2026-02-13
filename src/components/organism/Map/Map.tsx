import { useEffect, useState } from "react";
import { MapContainer, ImageOverlay, useMap } from "react-leaflet";
import type { LatLngBoundsExpression, LatLngTuple } from "leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import echo from "../../../lib/echo";

import { MapMarker, MapFullscreenControl, MapPopup } from "../../ui/map";

type Device = {
  id: number;
  device_names: string;
  mac_devices: string;
  rssi: number;
  x: number;
  y: number;
};

function FitBounds({ bounds }: { bounds: LatLngBoundsExpression }) {
  const map = useMap();

  useEffect(() => {
    map.fitBounds(bounds);
  }, [map, bounds]);

  return null;
}

export function MapLab() {
  /**
   * Denah ukuran (pixel)
   * tinggi x lebar
   */
  const bounds: LatLngBoundsExpression = [
    [0, 0],
    [480, 1280],
  ];

  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/devices")
      .then((res) => res.json())
      .then((res) => {
        const parsed: Device[] = res.data.map((d: any) => ({
          id: d.id,
          device_names: d.device_names,
          mac_devices: d.mac_devices,
          rssi: d.rssi,
          x: Number(d.x),
          y: Number(d.y),
        }));

        setDevices(parsed);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // set realtime
  useEffect(() => {
    echo.channel("device-channel").listen(".device.updated", (e: any) => {
      if (!e.devices) return;

      setDevices((prev) => {
        let updated = [...prev];

        e.devices.forEach((incoming: any) => {
          const index = updated.findIndex(
            (d) => d.mac_devices === incoming.mac_devices,
          );

          if (index !== -1) {
            updated[index] = {
              ...updated[index],
              ...incoming,
            };
          } else {
            updated.unshift(incoming);
          }
        });

        return updated;
      });
    });

    return () => {
      echo.leave("device-channel");
    };
  }, []);

  return (
    <div className="w-full h-[450px] rounded-xl overflow-hidden border ">
      <MapContainer
        crs={L.CRS.Simple}
        bounds={bounds}
        minZoom={-1}
        maxZoom={1}
        className="w-full h-full "
      >
        {/* Force fit denah */}
        <FitBounds bounds={bounds} />
        <MapFullscreenControl />

        {/* Denah indoor */}
        <ImageOverlay url="/img/denah.jpeg" bounds={bounds} />

        {/* Render devices */}
        {!loading &&
          devices.map((device) => {
            const position: LatLngTuple = [device.y, device.x];

            return (
              <MapMarker key={device.id} position={position}>
                <MapPopup>
                  <strong>{device.device_names}</strong>
                  <br />
                  MAC: {device.mac_devices}
                  <br />
                  RSSI: {device.rssi}
                  <br />
                  X: {device.x}, Y: {device.y}
                </MapPopup>
              </MapMarker>
            );
          })}
      </MapContainer>
    </div>
  );
}
