

interface ProviderBadgeProps {
  provider?: "openstreetmap" | "google" | string;
}

export function ProviderBadge({ provider = "openstreetmap" }: ProviderBadgeProps) {
  const label =
    provider === "google" ? "Google Maps" : provider === "openstreetmap" ? "OpenStreetMap" : provider;
  const color = provider === "google" ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800";

  return (
    <span className={`inline-flex items-center gap-2 px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: provider === "google" ? "#4285F4" : "#16A34A" }} />
      <span>{label}</span>
    </span>
  );
}

export default ProviderBadge;
