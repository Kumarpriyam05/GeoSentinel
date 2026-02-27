import { useEffect, useState } from "react";

export const useGeoSender = ({ enabled, deviceId, pushLocation }) => {
  const [geoStatus, setGeoStatus] = useState("idle");

  useEffect(() => {
    if (!enabled || !deviceId) {
      setGeoStatus("idle");
      return;
    }

    if (!("geolocation" in navigator)) {
      setGeoStatus("unsupported");
      return;
    }

    let active = true;
    let debounceTimer;
    setGeoStatus("tracking");

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (!active) return;
        const { latitude, longitude, speed, heading, accuracy } = position.coords;

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          if (!active) return;
          try {
            await pushLocation(deviceId, {
              lat: latitude,
              lng: longitude,
              speed: Number(speed || 0),
              heading: Number(heading || 0),
              accuracy: Number(accuracy || 0),
              timestamp: new Date(position.timestamp).toISOString(),
            });
            setGeoStatus("sending");
          } catch (_error) {
            setGeoStatus("error");
          }
        }, 1100);
      },
      () => {
        if (active) setGeoStatus("error");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 3500,
        timeout: 15000,
      },
    );

    return () => {
      active = false;
      clearTimeout(debounceTimer);
      navigator.geolocation.clearWatch(watchId);
    };
  }, [enabled, deviceId, pushLocation]);

  return geoStatus;
};

