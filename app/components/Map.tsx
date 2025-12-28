"use client";
import { MapContainer, ImageOverlay, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ReactNode } from 'react';

const MAP_BOUNDS: [[number, number], [number, number]] = [
  [0, 0], // top-left
  [4096, 4096], // bottom-right (ajuste conforme o tamanho real do mapa)
];

function MapClickHandler({ onClick }: { onClick: (coords: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

interface MapProps {
  children?: ReactNode;
  onMapClick?: (coords: L.LatLng) => void;
}

export default function Map({ children, onMapClick }: MapProps) {
  return (
    <MapContainer
      crs={L.CRS.Simple}
      bounds={MAP_BOUNDS}
      minZoom={-2}
      maxZoom={2}
      style={{ height: '100%', width: '100%' }}
    >
      <ImageOverlay
        url="/map/palworld-map.png"
        bounds={MAP_BOUNDS}
      />
      {onMapClick && <MapClickHandler onClick={onMapClick} />}
      {children}
    </MapContainer>
  );
}
