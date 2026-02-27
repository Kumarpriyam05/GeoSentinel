import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";

const createMarkerIcon = (online) =>
  L.divIcon({
    className: "",
    html: `<div class="geosentinel-marker ${online ? "online" : "offline"}"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

const lerp = (start, end, progress) => start + (end - start) * progress;

const AnimatedMarker = ({ device, position, selected, onSelect }) => {
  const markerRef = useRef(null);
  const frameRef = useRef(null);
  const lastPositionRef = useRef(position);
  const icon = useMemo(() => createMarkerIcon(device.isOnline), [device.isOnline]);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    cancelAnimationFrame(frameRef.current);
    const from = lastPositionRef.current;
    const to = position;
    const durationMs = 550;
    const startedAt = performance.now();

    const animate = (timestamp) => {
      const elapsed = timestamp - startedAt;
      const progress = Math.min(1, elapsed / durationMs);
      const lat = lerp(from.lat, to.lat, progress);
      const lng = lerp(from.lng, to.lng, progress);
      marker.setLatLng([lat, lng]);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    lastPositionRef.current = to;

    return () => cancelAnimationFrame(frameRef.current);
  }, [position]);

  return (
    <Marker
      ref={(instance) => {
        markerRef.current = instance;
      }}
      position={[position.lat, position.lng]}
      icon={icon}
      eventHandlers={{ click: () => onSelect(device.id) }}
    >
      <Popup>
        <div className="space-y-1">
          <p className="font-semibold">{device.name}</p>
          <p className="text-xs">Tracking ID: {device.trackingId}</p>
          <p className="text-xs">{selected ? "Selected" : "Tap to focus"}</p>
        </div>
      </Popup>
    </Marker>
  );
};

export default AnimatedMarker;

