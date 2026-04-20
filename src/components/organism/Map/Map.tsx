import { useEffect, useRef, useState } from "react";
import { MapContainer, ImageOverlay, useMap } from "react-leaflet";
import type { LatLngBoundsExpression, LatLngTuple } from "leaflet";
import L from "leaflet";
// @ts-ignore
import "leaflet.marker.slideto";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { MapPin } from "lucide-react";
import { renderToString } from "react-dom/server";
import echo from "../../../lib/echo";
import api from "../../../services/api";

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

const scale = 100;

function DevicesLayer({ devices }: { devices: Device[] }) {
  const map = useMap();
  const markersRef = useRef<Map<number, L.Marker>>(new Map());

  useEffect(() => {
    devices.forEach((device) => {
      const posX = device.x * scale;
      const posY = device.y * scale;

      const position: LatLngTuple = [posY, posX];
      const mapPin = renderToString(<MapPin />);
      const deviceIcon = L.divIcon({
        html: mapPin,
      });

      // Kalau marker belum ada → buat
      if (!markersRef.current.has(device.id)) {
        const marker = L.marker(position, { icon: deviceIcon }).addTo(map);

        marker.bindPopup(`
         <div class="custom-popup">
          <strong>${device.device_names}</strong><br/>
          MAC: ${device.mac_devices}<br/>
          X: ${device.x}, 
          Y: ${device.y}
        </div>
        `);

        markersRef.current.set(device.id, marker);
      } else {
        // Kalau sudah ada → slide
        const marker = markersRef.current.get(device.id);

        (marker as any).slideTo(position, {
          duration: 400,
          keepAtCenter: false,
        });
      }
    });
  }, [devices, map]);

  return null;
}

export function MapLab() {
  const bounds: LatLngBoundsExpression = [
    [0, 0],
    [764, 1600],
  ];

  const [devices, setDevices] = useState<Device[]>([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/devices");
        setDevices(response.data.data);
      } catch (err) {
        console.log("Error fetch data", err);
      }
    };
    fetchData();
  }, []);

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
              x: Number(incoming.x),
              y: Number(incoming.y),
            };
          } else {
            updated.unshift({
              ...incoming,
              x: Number(incoming.x),
              y: Number(incoming.y),
            });
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
    <div className="w-full h-[450px] rounded-xl overflow-hidden border z-10">
      <MapContainer
        crs={L.CRS.Simple}
        bounds={bounds}
        minZoom={-1}
        maxZoom={1}
        className="w-full h-full"
      >
        <FitBounds bounds={bounds} />
        <ImageOverlay url="/img/hoe.jpeg" bounds={bounds} />
        <DevicesLayer devices={devices} />
      </MapContainer>
    </div>
  );
}
