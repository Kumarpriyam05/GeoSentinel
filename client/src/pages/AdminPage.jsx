import { useEffect, useMemo, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import Skeleton from "@/components/common/Skeleton";
import { adminApi } from "@/api/adminApi";
import { useSocket } from "@/context/SocketContext";

const AdminPage = () => {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const { socket } = useSocket();

  const loadData = async () => {
    setLoading(true);
    try {
      const [overviewResponse, usersResponse] = await Promise.all([adminApi.overview(), adminApi.activeUsers()]);
      setOverview(overviewResponse.metrics);
      setUsers(usersResponse.users);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const onLocation = (payload) => {
      setEvents((prev) =>
        [
          {
            id: `${payload.deviceId}-${payload.capturedAt}`,
            label: `Location update for ${payload.deviceId.slice(-6)}`,
            time: payload.capturedAt,
          },
          ...prev,
        ].slice(0, 30),
      );
    };

    const onStatus = (payload) => {
      setEvents((prev) =>
        [
          {
            id: `${payload.deviceId}-${payload.at}`,
            label: `Device ${payload.deviceId.slice(-6)} is ${payload.isOnline ? "online" : "offline"}`,
            time: payload.at,
          },
          ...prev,
        ].slice(0, 30),
      );
    };

    socket.on("admin:location", onLocation);
    socket.on("admin:device-status", onStatus);

    return () => {
      socket.off("admin:location", onLocation);
      socket.off("admin:device-status", onStatus);
    };
  }, [socket]);

  const metrics = useMemo(
    () => [
      { label: "Total Users", value: overview?.totalUsers ?? 0 },
      { label: "Total Devices", value: overview?.totalDevices ?? 0 },
      { label: "Online Devices", value: overview?.onlineDevices ?? 0 },
      { label: "Updates 24h", value: overview?.updatesLast24h ?? 0 },
    ],
    [overview],
  );

  return (
    <AppLayout title="Admin Command Center">
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button variant="secondary" onClick={loadData}>
            Refresh Analytics
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-24 w-full" />)
            : metrics.map((metric) => (
                <Card key={metric.label} className="p-4">
                  <p className="text-xs uppercase tracking-wide text-base-500">{metric.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-base-800">{metric.value}</p>
                </Card>
              ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.25fr_1fr]">
          <Card className="min-h-[320px]">
            <h2 className="mb-4 text-sm font-semibold text-base-700">Active Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[460px] text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-base-500">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Email</th>
                    <th className="pb-2">Role</th>
                    <th className="pb-2">Online Devices</th>
                    <th className="pb-2">Last Seen</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t border-base-200/50 text-base-700">
                      <td className="py-2">{user.name}</td>
                      <td className="py-2 text-base-500">{user.email}</td>
                      <td className="py-2 capitalize">{user.role}</td>
                      <td className="py-2">{user.onlineDevices}</td>
                      <td className="py-2 text-base-500">{new Date(user.lastSeenAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="min-h-[320px]">
            <h2 className="mb-4 text-sm font-semibold text-base-700">Realtime Monitoring</h2>
            <div className="space-y-2">
              {events.length ? (
                events.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-xl border border-base-200/60 bg-base-100/60 px-3 py-2 dark:bg-base-100/20"
                  >
                    <p className="text-sm text-base-700">{event.label}</p>
                    <p className="text-xs text-base-500">{new Date(event.time).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-base-500">Waiting for realtime system events...</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminPage;

