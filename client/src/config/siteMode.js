// Defaults to the static sunset site. Set VITE_SERVICES_OFFLINE=false and
// rebuild to restore the preserved portal routes, sessions, and live status.
export const servicesOffline = import.meta.env.VITE_SERVICES_OFFLINE !== "false";
