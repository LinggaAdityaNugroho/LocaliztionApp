import { MapContainer, ImageOverlay, Marker, Popup } from "react-leaflet";
import type { LatLngBoundsExpression, LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import L from "leaflet";
import { MapLab } from "../../components/organism/Map/Map";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";

export function MapLabPage() {
  // const bounds: LatLngBoundsExpression = [
  //   [0, 0],
  //   [480, 1280],
  // ];

  // const device1Position: LatLngTuple = [400, 500];
  // const device2Position: LatLngTuple = [100, 200];
  // const device3Position: LatLngTuple = [100, 500];

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
          <MapLab />
        </CardContent>
      </Card>
    </div>
  );
}
