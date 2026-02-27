import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import StatusBadge from "@/components/common/StatusBadge";
import { useTracking } from "@/context/TrackingContext";
import { cn } from "@/lib/cn";

const DeviceSidebar = ({ collapsed, setCollapsed }) => {
  const {
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    addDevice,
    renameDevice,
    removeDevice,
    fetchDevices,
    loadingDevices,
  } = useTracking();

  const [nameInput, setNameInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState("all");
  const [saving, setSaving] = useState(false);

  const visibleDevices = useMemo(() => {
    const search = searchInput.toLowerCase().trim();
    return devices.filter((device) => {
      if (status === "online" && !device.isOnline) return false;
      if (status === "offline" && device.isOnline) return false;
      if (!search) return true;
      return (
        device.name.toLowerCase().includes(search) || device.trackingId.toLowerCase().includes(search)
      );
    });
  }, [devices, searchInput, status]);

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!nameInput.trim()) return;
    setSaving(true);
    try {
      await addDevice(nameInput.trim());
      setNameInput("");
    } finally {
      setSaving(false);
    }
  };

  const handleRename = async (device) => {
    const nextName = window.prompt("Rename device", device.name);
    if (!nextName || nextName === device.name) return;
    await renameDevice(device.id, nextName.trim());
  };

  const handleRemove = async (device) => {
    const confirmed = window.confirm(`Delete ${device.name}? This also removes location history.`);
    if (!confirmed) return;
    await removeDevice(device.id);
  };

  const handleRefresh = () => fetchDevices({ search: searchInput, status });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-base-200/60 p-4">
        <div className={cn("transition-opacity", collapsed ? "opacity-0" : "opacity-100")}>
          <h2 className="text-sm font-semibold text-base-700">Devices</h2>
          <p className="text-xs text-base-500">{devices.length} tracked assets</p>
        </div>
        <button
          type="button"
          className="rounded-lg border border-base-300/70 px-2 py-1 text-xs text-base-500 transition hover:border-accent-500 hover:text-accent-600"
          onClick={() => setCollapsed((prev) => !prev)}
        >
          {collapsed ? ">" : "<"}
        </button>
      </div>

      {collapsed ? (
        <div className="space-y-2 p-3">
          {devices.slice(0, 8).map((device) => (
            <button
              key={device.id}
              type="button"
              className={cn(
                "w-full rounded-lg border border-base-200/60 py-2 text-xs font-semibold transition",
                selectedDeviceId === device.id
                  ? "border-accent-500/70 bg-accent-500/10 text-accent-600"
                  : "text-base-500 hover:border-accent-500/40",
              )}
              onClick={() => setSelectedDeviceId(device.id)}
            >
              {device.name.slice(0, 2).toUpperCase()}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
          <form className="space-y-2" onSubmit={handleCreate}>
            <Input
              placeholder="Add new device"
              value={nameInput}
              onChange={(event) => setNameInput(event.target.value)}
            />
            <Button className="w-full" loading={saving} type="submit">
              Create Device
            </Button>
          </form>

          <div className="space-y-2">
            <Input
              placeholder="Search by name or tracking ID"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
            <div className="flex gap-2">
              {["all", "online", "offline"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition",
                    status === item
                      ? "bg-accent-500/15 text-accent-600"
                      : "bg-base-100/70 text-base-500 hover:text-base-700 dark:bg-base-100/20",
                  )}
                  onClick={() => setStatus(item)}
                >
                  {item}
                </button>
              ))}
              <button
                type="button"
                className="ml-auto rounded-lg px-2.5 py-1 text-xs font-medium text-base-500 hover:text-accent-600"
                onClick={handleRefresh}
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
            {loadingDevices ? (
              <p className="px-1 text-xs text-base-500">Loading devices...</p>
            ) : visibleDevices.length ? (
              visibleDevices.map((device, index) => (
                <motion.button
                  key={device.id}
                  type="button"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className={cn(
                    "w-full rounded-xl border p-3 text-left transition",
                    selectedDeviceId === device.id
                      ? "border-accent-500/60 bg-accent-500/10 shadow-glow"
                      : "border-base-200/60 bg-base-100/60 hover:border-accent-500/40 dark:bg-base-100/20",
                  )}
                  onClick={() => setSelectedDeviceId(device.id)}
                >
                  <div className="mb-1.5 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-base-700">{device.name}</h3>
                    <StatusBadge online={device.isOnline} />
                  </div>
                  <p className="mb-2 font-mono text-[11px] text-base-500">{device.trackingId}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      className="rounded-md px-2 py-1 text-base-500 transition hover:bg-base-100/60 hover:text-accent-600"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleRename(device);
                      }}
                      type="button"
                    >
                      Rename
                    </button>
                    <button
                      className="rounded-md px-2 py-1 text-base-500 transition hover:bg-base-100/60 hover:text-rose-500"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleRemove(device);
                      }}
                      type="button"
                    >
                      Remove
                    </button>
                  </div>
                </motion.button>
              ))
            ) : (
              <p className="px-1 text-xs text-base-500">No devices match your filters.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceSidebar;

