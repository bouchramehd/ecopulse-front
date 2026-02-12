import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function RiskMap({ point }) {
  if (!point) return null;

  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden">
      <MapContainer
        center={[point.lat, point.lng]}
        zoom={7}
        style={{ height: "300px", width: "100%" }}
        key={`${point.lat}-${point.lng}`}
      >
        <TileLayer
          attribution='© OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[point.lat, point.lng]}>
          <Popup>{point.label}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
