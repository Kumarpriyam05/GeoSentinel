import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useTheme } from "@/context/ThemeContext";
import AnimatedMarker from "./AnimatedMarker";

const DEFAULT_CENTER = [20, 0];
const DEFAULT_ZOOM = 2;

const AutoCenter = ({ enabled, target }) => {
  const map = useMap();
  const lastPanRef = useRef(0);

  useEffect(() => {
    if (!enabled || !target) return;
    const now = Date.now();
    if (now - lastPanRef.current < 800) return;
    map.flyTo([target.lat, target.lng], Math.max(map.getZoom(), 13), {
      animate: true,
      duration: 0.85,
    });
    lastPanRef.current = now;
  }, [enabled, target, map]);

  return null;
};

const LiveMap = ({ devices, locations, selectedDeviceId, onSelectDevice, autoCenter }) => {
  const { resolvedTheme } = useTheme();

  const markerData = useMemo(
    () =>
      devices
        .map((device) => ({
          device,
          position: locations[device.id],
        }))
        .filter(
          (item) =>
            Number.isFinite(item.position?.lat) &&
            Number.isFinite(item.position?.lng),
        ),
    [devices, locations],
  );

  const selectedPosition = selectedDeviceId ? locations[selectedDeviceId] : null;
  const tileUrl =
    resolvedTheme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="relative h-[420px] overflow-hidden rounded-2xl border border-base-200/60 md:h-[560px]">
      <MapContainer center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={tileUrl}
        />

        <AutoCenter enabled={autoCenter} target={selectedPosition} />

        {markerData.map(({ device, position }) => (
          <AnimatedMarker
            key={device.id}
            device={device}
            position={position}
            selected={selectedDeviceId === device.id}
            onSelect={onSelectDevice}
          />
        ))}
      </MapContainer>

      {markerData.length === 0 ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-base-50/65 backdrop-blur-sm">
          <div className="rounded-xl border border-base-200/80 bg-base-100/90 px-4 py-2 text-sm text-base-500 shadow-soft">
            Waiting for live location updates...
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default LiveMap;
