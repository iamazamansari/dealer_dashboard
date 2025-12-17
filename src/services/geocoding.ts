// Geocoding helpers
// Purpose: provide a small, typed wrapper around OpenStreetMap (OSM) HTTP lookups
// so the UI can validate and convert textual addresses into coordinates without
// requiring a Google API key for demos and local usage.
export interface GeocodingResult {
  lat: number;
  lng: number;
  formattedAddress: string;
  // A simple key/value map of address parts returned by the OSM API
  addressComponents: Record<string, string> | Record<string, unknown>;
  placeId: string;
  isValid: boolean;
}

export async function validateAddress(
  address: string
): Promise<GeocodingResult | null> {
  // Use OpenStreetMap (OSM) for address validation by default.
  // Google Geocoding support has been removed/commented out to avoid
  // relying on a private API key in this demo.
  try {
    console.log("[v0] Validating address with OSM:", address);
    const result = await validateAddressWithOSM(address);
    return result;
  } catch (error) {
    console.error("[v0] Failed to validate address with OSM:", error);
    return null;
  }
}

export async function searchDealersByLocation(
  location: string
): Promise<Array<{ name: string; lat: number; lng: number; placeId: string }>> {
  // Simple fallback: return the geocoded location as a single 'place' result.
  try {
    console.log("[v0] Searching (fallback) near:", location);
    const geocodeResult = await validateAddress(location);

    if (!geocodeResult || !geocodeResult.isValid) {
      console.log("[v0] Invalid location for search");
      return [];
    }

    return [
      {
        name: geocodeResult.formattedAddress,
        lat: geocodeResult.lat,
        lng: geocodeResult.lng,
        placeId: geocodeResult.placeId,
      },
    ];
  } catch (error) {
    console.error("[v0] Failed to search by location:", error);
    return [];
  }
}

// ---- OpenStreetMap (OSM) fallback helpers ----
// NOTE: OpenStreetMap's public geocoding service is a shared resource with usage policies and rate limits.
// For production use, proxy requests through your server and add caching + a User-Agent header.

export interface OSMResultRaw {
  display_name: string;
  lat: string;
  lon: string;
  osm_id?: number;
  osm_type?: string;
  place_id?: string;
  type?: string;
  address?: Record<string, string> | Record<string, unknown>;
}

export async function osmSearch(query: string): Promise<OSMResultRaw[]> {
  if (!query || !query.trim()) return [];
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(
      query
    )}`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error("[v0] OSM search failed:", response.statusText);
      return [];
    }

    const data = await response.json();
    return data as OSMResultRaw[];
  } catch (error) {
    console.error("[v0] OSM search error:", error);
    return [];
  }
}

export interface OSMReverseRaw {
  display_name?: string;
  lat?: string;
  lon?: string;
  address?: Record<string, string> | Record<string, unknown>;
}

export async function osmReverse(lat: number, lon: number): Promise<OSMReverseRaw | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=${lat}&lon=${lon}`;
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error("[v0] OSM reverse failed:", response.statusText);
      return null;
    }

    const data = await response.json();
    return data as OSMReverseRaw;
  } catch (error) {
    console.error("[v0] OSM reverse error:", error);
    return null;
  }
}

/*
// ---- Google Geocoding (removed) ----
// The original implementation used the Google Geocoding API when a
// VITE_GOOGLE_MAPS_API_KEY was present. That dependency has been
// intentionally removed for this demo to avoid requiring a private API key.
export async function googleGeocode(address: string): Promise<GeocodingResult | null> {
  // Implementation intentionally disabled.
  return null;
}
*/

export async function validateAddressWithOSM(
  address: string
): Promise<GeocodingResult | null> {
  try {
    const results = await osmSearch(address);
    if (!results || results.length === 0) {
      return {
        lat: 0,
        lng: 0,
        formattedAddress: address,
        addressComponents: {},
        placeId: "",
        isValid: false,
      };
    }

    const first = results[0];
    const formatted = first.display_name;

    return {
      lat: parseFloat(first.lat),
      lng: parseFloat(first.lon),
      formattedAddress: formatted,
      addressComponents: (first.address as Record<string, string>) || {},
      placeId: `osm:${first.osm_type || ""}/${first.osm_id || ""}`,
      isValid: true,
    };
  } catch (error) {
    console.error("[v0] OSM validation error:", error);
    return null;
  }
}

// Convenience helper: validate the textual address and return a small, typed result
// that the rest of the app can use.
// Note: OSM's public endpoint is a shared service with rate limits — for production
// recommend proxying requests server-side, adding caching and a proper User-Agent.

