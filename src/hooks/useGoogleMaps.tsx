import { useEffect } from "react";

// Backwards-compatible hook kept for consumers that expect `useGoogleMaps`.
// Instead of loading Google scripts, this now reports the selected provider
// and marks maps as available for UI components to render a fallback map.
export function useGoogleMaps() {
  const isLoaded = true;
  const error: string | null = null;
  const provider: "openstreetmap" | "google" = "openstreetmap";

  useEffect(() => {
    // No-op: we intentionally do not attempt to load Google Maps.
    // Keep console info for debugging.
    console.log("[v0] Using geocoding provider:", provider);
  }, [provider]);

  return { isLoaded, error, provider } as const;
}
