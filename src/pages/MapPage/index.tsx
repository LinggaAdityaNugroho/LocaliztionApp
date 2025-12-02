import { MapContainer, ImageOverlay, Marker, Popup } from "react-leaflet";
import type { LatLngBoundsExpression, LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import L from "leaflet";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";

export function MapLab() {
  const bounds: LatLngBoundsExpression = [
    [0, 0],
    [480, 1280],
  ];

  const device1Position: LatLngTuple = [400, 500];
  const device2Position: LatLngTuple = [100, 200];
  const device3Position: LatLngTuple = [100, 500];

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            <CardTitle>
              {" "}
              <p>Map Laboratorium Timur</p>
            </CardTitle>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MapContainer
            crs={L.CRS.Simple}
            bounds={bounds}
            style={{ width: "100%", height: "100vh" }}
            maxZoom={1}
            minZoom={-1}
          >
            <ImageOverlay
              url="../../../public/img/denah.jpeg"
              bounds={bounds}
            />

            <Marker position={device1Position}>
              <Popup>Osiloscop</Popup>
            </Marker>

            <Marker position={device2Position}>
              <Popup>Function Generator</Popup>
            </Marker>

            <Marker position={device3Position}>
              <Popup>Device BLE 3</Popup>
            </Marker>
          </MapContainer>
        </CardContent>
      </Card>
    </div>
  );
}
