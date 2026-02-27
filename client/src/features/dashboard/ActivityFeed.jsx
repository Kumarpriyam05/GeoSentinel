import Card from "@/components/common/Card";

const ActivityFeed = ({ activityFeed, devices }) => {
  const labelByDeviceId = new Map(devices.map((device) => [device.id, device.name]));

  return (
    <Card className="h-full min-h-[280px]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-base-700">Live Activity</h3>
        <span className="text-xs text-base-500">{activityFeed.length} recent events</span>
      </div>

      <div className="space-y-2 overflow-y-auto pr-1">
        {activityFeed.length ? (
          activityFeed.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-base-200/70 bg-base-100/55 px-3 py-2.5 dark:bg-base-100/20"
            >
              <p className="text-xs font-medium text-base-700">
                {labelByDeviceId.get(item.deviceId) || "Unknown Device"}
              </p>
              <p className="text-xs text-base-500">{new Date(item.timestamp).toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-base-500">No activity yet. Send or ingest a location update to begin.</p>
        )}
      </div>
    </Card>
  );
};

export default ActivityFeed;

