import { useState, useEffect, useMemo, useRef } from "react";
import { MapPin, X } from "lucide-react";
import L from "leaflet";

interface Dealer {
  id: number;
  name: string;
  location: string;
  contact: string;
  status: string;
  lat?: number;
  lng?: number;
}

interface DealerMapProps {
  dealers: Dealer[];
  onClose: () => void;
}

export function DealerMap({ dealers, onClose }: DealerMapProps) {
  const error: string | null = null;
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);

  // Compute center based on dealer coordinates
  const coords = useMemo(
    () =>
      dealers
        .filter((d) => typeof d.lat === "number" && typeof d.lng === "number")
        .map((d) => ({ lat: d.lat!, lng: d.lng! })),
    [dealers]
  );

  const defaultCenter = coords.length
    ? {
        lat: coords.reduce((s, c) => s + c.lat, 0) / coords.length,
        lng: coords.reduce((s, c) => s + c.lng, 0) / coords.length,
      }
    : { lat: 40.7128, lng: -74.006 };

  // Use a stable initial center (we let Leaflet handle subsequent pans/zooms)
  const initialCenter = defaultCenter;

  // Map container ref to initialize a Leaflet map instance
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map once
    if (!leafletRef.current) {
      leafletRef.current = L.map(mapRef.current, {
        center: [initialCenter.lat, initialCenter.lng],
        zoom: coords.length ? 6 : 4,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(leafletRef.current);
    }

    const map = leafletRef.current as L.Map;

    // Clear previous markers
    map.eachLayer((layer) => {
      // keep the tile layer and attribution control; remove circle markers/popups
      const l = layer as L.Layer & { options?: { pane?: string } };
      if (l.options && l.options.pane === "markerPane") {
        map.removeLayer(layer);
      }
    });

    // Add circle markers for dealers
    const markers: L.CircleMarker[] = [];
    dealers.forEach((dealer) => {
      if (typeof dealer.lat === "number" && typeof dealer.lng === "number") {
        const cm = L.circleMarker([dealer.lat, dealer.lng], {
          radius: 8,
          color: dealer.status === "Active" ? "#16a34a" : dealer.status === "Inactive" ? "#dc2626" : "#d97706",
          fillColor: dealer.status === "Active" ? "#bbf7d0" : dealer.status === "Inactive" ? "#fecaca" : "#fed7aa",
          fillOpacity: 1,
        }).addTo(map);

        cm.bindPopup(`<div><strong>${dealer.name}</strong><div style='font-size:12px;'>${dealer.location}</div><div style='font-size:12px;'>${dealer.contact}</div><div style='font-size:11px;color:#666;margin-top:6px;'>Status: ${dealer.status}</div></div>`);
        markers.push(cm);
      }
    });

    // fit bounds to markers if present
    if (markers.length) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds(), { padding: [40, 40] });
    }

    return () => {
      // optional: keep map instance alive for performance; remove popups/markers on next run
    };
  }, [dealers, coords, initialCenter.lat, initialCenter.lng]);


  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Map Error
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-6xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Dealer Locations
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 min-h-0 relative">
          {/* Interactive Leaflet map (responsive). Markers are rendered as small circle markers with popups. */}
          <div ref={mapRef} className="w-full h-full" aria-hidden="false" />

          <div className="absolute bottom-4 left-4 space-y-2 sm:max-w-md max-w-[90%] max-h-[40vh] overflow-auto">
            {dealers.map((dealer) =>
              dealer.lat && dealer.lng ? (
                <div
                  key={dealer.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {dealer.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {dealer.location}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => {
                          // Pan the Leaflet map to the dealer and zoom in for focus
                          if (leafletRef.current && typeof dealer.lat === "number" && typeof dealer.lng === "number") {
                            leafletRef.current.panTo([dealer.lat, dealer.lng]);
                            try {
                              leafletRef.current.setZoom(12);
                            } catch {
                              // ignore if setZoom isn't available
                            }
                          }
                        }}
                        className="text-sm px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded"
                      >
                        Center
                      </button>
                      <a
                        href={`https://www.openstreetmap.org/?mlat=${dealer.lat}&mlon=${dealer.lng}#map=18/${dealer.lat}/${dealer.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-600 dark:text-gray-400 underline"
                      >
                        Open
                      </a>
                    </div>
                  </div>
                </div>
              ) : null
            )}

            {selectedDealer && (
              <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {selectedDealer.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedDealer.location}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedDealer.contact}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedDealer(null)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-500">Showing location powered by OpenStreetMap</div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Inactive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DealerMap;