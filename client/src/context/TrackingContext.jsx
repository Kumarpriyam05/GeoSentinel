import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { deviceApi } from "@/api/deviceApi";
import { useSocket } from "./SocketContext";
import { throttle } from "@/lib/throttle";

const TrackingContext = createContext(null);

const normalizeLocation = (payload) => ({
  deviceId: payload.deviceId,
  lat: Number(payload.lat),
  lng: Number(payload.lng),
  speed: Number(payload.speed || 0),
  heading: Number(payload.heading || 0),
  accuracy: Number(payload.accuracy || 0),
  source: payload.source || "ingest",
  capturedAt: payload.capturedAt || new Date().toISOString(),
  isOnline: payload.isOnline ?? true,
});

export const TrackingProvider = ({ children }) => {
  const { socket, connected } = useSocket();
  const [devices, setDevices] = useState([]);
  const [locations, setLocations] = useState({});
  const [activityFeed, setActivityFeed] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [loadingDevices, setLoadingDevices] = useState(true);
  const [createdDeviceKey, setCreatedDeviceKey] = useState(null);

  const latestLocationsRef = useRef({});
  const commitLocations = useMemo(
    () =>
      throttle(() => {
        setLocations({ ...latestLocationsRef.current });
      }, 200),
    [],
  );

  const applyLocation = useCallback(
    (rawPayload) => {
      const payload = normalizeLocation(rawPayload);
      latestLocationsRef.current[payload.deviceId] = payload;
      commitLocations();

      setDevices((prev) =>
        prev.map((device) =>
          device.id === payload.deviceId
            ? {
                ...device,
                isOnline: true,
                lastActiveAt: payload.capturedAt,
                lastLocation: {
                  lat: payload.lat,
                  lng: payload.lng,
                  speed: payload.speed,
                  heading: payload.heading,
                  accuracy: payload.accuracy,
                  timestamp: payload.capturedAt,
                },
              }
            : device,
        ),
      );

      setActivityFeed((prev) =>
        [
          {
            id: `${payload.deviceId}-${payload.capturedAt}`,
            type: "location",
            deviceId: payload.deviceId,
            message: `Device ${payload.deviceId.slice(-6)} updated location`,
            timestamp: payload.capturedAt,
          },
          ...prev,
        ].slice(0, 50),
      );
    },
    [commitLocations],
  );

  const fetchDevices = useCallback(async (filters = {}) => {
    setLoadingDevices(true);
    try {
      const response = await deviceApi.list(filters);
      setDevices(response.devices);

      const nextLocations = {};
      response.devices.forEach((device) => {
        if (
          Number.isFinite(device.lastLocation?.lat) &&
          Number.isFinite(device.lastLocation?.lng)
        ) {
          nextLocations[device.id] = {
            deviceId: device.id,
            lat: Number(device.lastLocation.lat),
            lng: Number(device.lastLocation.lng),
            speed: Number(device.lastLocation.speed || 0),
            heading: Number(device.lastLocation.heading || 0),
            accuracy: Number(device.lastLocation.accuracy || 0),
            capturedAt: device.lastLocation.timestamp || device.updatedAt,
            isOnline: device.isOnline,
            source: "history",
          };
        }
      });
      latestLocationsRef.current = nextLocations;
      setLocations(nextLocations);

      setSelectedDeviceId((current) => {
        if (current && response.devices.some((device) => device.id === current)) return current;
        return response.devices[0]?.id || null;
      });
    } catch (_error) {
      setDevices([]);
      latestLocationsRef.current = {};
      setLocations({});
      setSelectedDeviceId(null);
    } finally {
      setLoadingDevices(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  useEffect(() => {
    if (!socket) return;

    const onLocationUpdated = (payload) => applyLocation(payload);
    const onActivity = (payload) => applyLocation(payload);
    const onDeviceStatus = (payload) => {
      setDevices((prev) =>
        prev.map((device) =>
          device.id === payload.deviceId
            ? {
                ...device,
                isOnline: payload.isOnline,
                lastActiveAt: payload.at || device.lastActiveAt,
              }
            : device,
        ),
      );
    };

    socket.on("location:updated", onLocationUpdated);
    socket.on("activity:location", onActivity);
    socket.on("device:status", onDeviceStatus);

    return () => {
      socket.off("location:updated", onLocationUpdated);
      socket.off("activity:location", onActivity);
      socket.off("device:status", onDeviceStatus);
    };
  }, [socket, applyLocation]);

  useEffect(() => {
    if (!socket || !connected || devices.length === 0) return;
    const deviceIds = devices.map((device) => device.id);
    socket.emit("tracking:subscribe", { deviceIds });
    return () => {
      socket.emit("tracking:unsubscribe", { deviceIds });
    };
  }, [socket, connected, devices]);

  const addDevice = async (name) => {
    const response = await deviceApi.create({ name });
    setDevices((prev) => [response.device, ...prev]);
    setSelectedDeviceId(response.device.id);
    setCreatedDeviceKey({ trackingId: response.device.trackingId, ingestKey: response.ingestKey });
    return response.device;
  };

  const renameDevice = async (deviceId, name) => {
    const response = await deviceApi.update(deviceId, { name });
    setDevices((prev) => prev.map((device) => (device.id === deviceId ? response.device : device)));
    return response.device;
  };

  const setDeviceOnline = async (deviceId, isOnline) => {
    const response = await deviceApi.update(deviceId, { isOnline });
    setDevices((prev) => prev.map((device) => (device.id === deviceId ? response.device : device)));
    return response.device;
  };

  const removeDevice = async (deviceId) => {
    await deviceApi.remove(deviceId);
    setDevices((prev) => prev.filter((device) => device.id !== deviceId));
    setActivityFeed((prev) => prev.filter((item) => item.deviceId !== deviceId));

    const clone = { ...latestLocationsRef.current };
    delete clone[deviceId];
    latestLocationsRef.current = clone;
    setLocations(clone);

    setSelectedDeviceId((current) => (current === deviceId ? null : current));
  };

  const pushLocation = async (deviceId, payload) => {
    const response = await deviceApi.pushLocation(deviceId, payload);
    applyLocation(response.location);
    return response.location;
  };

  const getHistory = async (deviceId, limit = 150) => {
    const response = await deviceApi.history(deviceId, limit);
    return response.history;
  };

  const clearCreatedDeviceKey = () => setCreatedDeviceKey(null);

  const selectedDevice = useMemo(
    () => devices.find((device) => device.id === selectedDeviceId) || null,
    [devices, selectedDeviceId],
  );

  const value = useMemo(
    () => ({
      devices,
      selectedDevice,
      selectedDeviceId,
      setSelectedDeviceId,
      loadingDevices,
      locations,
      activityFeed,
      createdDeviceKey,
      clearCreatedDeviceKey,
      fetchDevices,
      addDevice,
      renameDevice,
      setDeviceOnline,
      removeDevice,
      pushLocation,
      getHistory,
    }),
    [
      devices,
      selectedDevice,
      selectedDeviceId,
      loadingDevices,
      locations,
      activityFeed,
      createdDeviceKey,
      fetchDevices,
    ],
  );

  return <TrackingContext.Provider value={value}>{children}</TrackingContext.Provider>;
};

export const useTracking = () => {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error("useTracking must be used within TrackingProvider");
  }
  return context;
};
