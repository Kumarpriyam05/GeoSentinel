import { useMemo, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import DeviceSidebar from "@/components/layout/DeviceSidebar";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import LiveMap from "@/components/map/LiveMap";
import ActivityFeed from "@/features/dashboard/ActivityFeed";
import StatsCards from "@/features/dashboard/StatsCards";
import { useTracking } from "@/context/TrackingContext";
import { useGeoSender } from "@/hooks/useGeoSender";

const DashboardPage = () => {
  const {
    devices,
    selectedDevice,
    selectedDeviceId,
    setSelectedDeviceId,
    locations,
    activityFeed,
    createdDeviceKey,
    clearCreatedDeviceKey,
    setDeviceOnline,
    pushLocation,
  } = useTracking();

  const [autoCenter, setAutoCenter] = useState(true);
  const [shareLocation, setShareLocation] = useState(false);
  const [copyState, setCopyState] = useState("");

  const geoStatus = useGeoSender({
    enabled: shareLocation && Boolean(selectedDeviceId),
    deviceId: selectedDeviceId,
    pushLocation,
  });

  const selectedPosition = selectedDeviceId ? locations[selectedDeviceId] : null;

  const selectedStats = useMemo(() => {
    if (!selectedPosition) return null;
    return {
      speed: Math.round(selectedPosition.speed || 0),
      heading: Math.round(selectedPosition.heading || 0),
      accuracy: Math.round(selectedPosition.accuracy || 0),
      capturedAt: selectedPosition.capturedAt,
    };
  }, [selectedPosition]);

  const copyCredentials = async () => {
    if (!createdDeviceKey) return;
    const text = `Tracking ID: ${createdDeviceKey.trackingId}\nIngest Key: ${createdDeviceKey.ingestKey}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopyState("Copied");
      setTimeout(() => setCopyState(""), 1800);
    } catch (_error) {
      setCopyState("Unable to copy");
      setTimeout(() => setCopyState(""), 1800);
    }
  };

  return (
    <AppLayout title="Realtime Tracking Dashboard" sidebar={(props) => <DeviceSidebar {...props} />}>
      <div className="grid gap-4 xl:grid-cols-[1.95fr_1fr]">
        <div className="space-y-4">
          <StatsCards devices={devices} activityFeed={activityFeed} />

          <Card className="flex flex-wrap items-center gap-2.5 px-4 py-3">
            <Button variant={autoCenter ? "primary" : "secondary"} onClick={() => setAutoCenter((prev) => !prev)}>
              Auto Center: {autoCenter ? "On" : "Off"}
            </Button>
            <Button
              variant={shareLocation ? "primary" : "secondary"}
              onClick={() => setShareLocation((prev) => !prev)}
              disabled={!selectedDeviceId}
            >
              Browser Share: {shareLocation ? "On" : "Off"}
            </Button>
            {selectedDevice ? (
              <Button
                variant="ghost"
                onClick={() => setDeviceOnline(selectedDevice.id, !selectedDevice.isOnline)}
              >
                Set {selectedDevice.isOnline ? "Offline" : "Online"}
              </Button>
            ) : null}
            <span className="ml-auto text-xs text-base-500">Geo Sender: {geoStatus}</span>
          </Card>

          <LiveMap
            devices={devices}
            locations={locations}
            selectedDeviceId={selectedDeviceId}
            onSelectDevice={setSelectedDeviceId}
            autoCenter={autoCenter}
          />
        </div>

        <div className="space-y-4">
          <Card>
            <h3 className="text-sm font-semibold text-base-700">Selected Device</h3>
            {selectedDevice ? (
              <div className="mt-3 space-y-2 text-sm">
                <p className="text-base-800">{selectedDevice.name}</p>
                <p className="font-mono text-xs text-base-500">{selectedDevice.trackingId}</p>
                {selectedStats ? (
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-base-100/60 p-2 dark:bg-base-100/20">
                      <p className="text-xs text-base-500">Speed</p>
                      <p className="font-semibold text-base-800">{selectedStats.speed}</p>
                    </div>
                    <div className="rounded-xl bg-base-100/60 p-2 dark:bg-base-100/20">
                      <p className="text-xs text-base-500">Heading</p>
                      <p className="font-semibold text-base-800">{selectedStats.heading}</p>
                    </div>
                    <div className="rounded-xl bg-base-100/60 p-2 dark:bg-base-100/20">
                      <p className="text-xs text-base-500">Accuracy</p>
                      <p className="font-semibold text-base-800">{selectedStats.accuracy}m</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-base-500">No location telemetry yet.</p>
                )}
              </div>
            ) : (
              <p className="mt-3 text-sm text-base-500">Select a device to inspect telemetry details.</p>
            )}
          </Card>

          {createdDeviceKey ? (
            <Card>
              <h3 className="text-sm font-semibold text-base-700">New Device Credentials</h3>
              <p className="mt-2 text-xs text-base-500">Store this ingest key now. It is shown once.</p>
              <div className="mt-3 space-y-2 rounded-xl bg-base-100/60 p-3 font-mono text-xs dark:bg-base-100/20">
                <p>Tracking ID: {createdDeviceKey.trackingId}</p>
                <p>Ingest Key: {createdDeviceKey.ingestKey}</p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Button variant="secondary" onClick={copyCredentials}>
                  Copy
                </Button>
                <Button variant="ghost" onClick={clearCreatedDeviceKey}>
                  Dismiss
                </Button>
                {copyState ? <span className="text-xs text-base-500">{copyState}</span> : null}
              </div>
            </Card>
          ) : null}

          <ActivityFeed activityFeed={activityFeed} devices={devices} />
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;

