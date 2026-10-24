import { lazy, Suspense } from "react";
import { servicesOffline } from "../../config/siteMode";
import OfflineServerStatusDisplay from "./OfflineServerStatusDisplay";

const LiveServerStatusDisplay = lazy(() => import("./LiveServerStatusDisplay"));

export default function ServerStatusDisplay() {
  if (servicesOffline) return <OfflineServerStatusDisplay />;

  return (
    <Suspense fallback={<p role="status">Loading server status...</p>}>
      <LiveServerStatusDisplay />
    </Suspense>
  );
}
