import { useState } from "react";
import { Layout } from "../components/Layout";
import { DealerTable } from "../components/DealerTable";
import { DealerFilters } from "../components/DealerFilter";
import { DealerMap } from "../components/DealerMap";
import { LocationSearch } from "../components/Location-search";
import { MapPin } from "lucide-react";
import type { Dealer } from "../types/dealer";


const SAMPLE_DEALERS: Dealer[] = [
  { id: 1, name: "AutoMart NYC", location: "New York, NY", contact: "contact@automart.com", status: "Active", lat: 40.7128, lng: -74.006 },
  { id: 2, name: "Premium Motors LA", location: "Los Angeles, CA", contact: "info@premiummotors.com", status: "Active", lat: 34.0522, lng: -118.2437 },
  { id: 3, name: "Elite Dealers Chicago", location: "Chicago, IL", contact: "sales@elitedealers.com", status: "Inactive", lat: 41.8781, lng: -87.6298 },
  { id: 4, name: "Gulf Coast Autos", location: "Houston, TX", contact: "sales@gulfcoastautos.com", status: "Active", lat: 29.7604, lng: -95.3698 },
  { id: 5, name: "Sunshine Motors Miami", location: "Miami, FL", contact: "hello@sunshinemotors.com", status: "Active", lat: 25.7617, lng: -80.1918 },
  { id: 6, name: "Lone Star Cars", location: "Dallas, TX", contact: "support@lonestarcars.com", status: "Active", lat: 32.7767, lng: -96.797 },
  { id: 7, name: "RainCity Autos", location: "Seattle, WA", contact: "info@raincityautos.com", status: "Active", lat: 47.6062, lng: -122.3321 },
  { id: 8, name: "Rocky Mountain Rides", location: "Denver, CO", contact: "sales@rmrides.com", status: "Active", lat: 39.7392, lng: -104.9903 },
  { id: 9, name: "Bay Area Motors", location: "San Francisco, CA", contact: "contact@bayareamotors.com", status: "Inactive", lat: 37.7749, lng: -122.4194 },
  { id: 10, name: "Harbor Auto Boston", location: "Boston, MA", contact: "hello@harborauto.com", status: "Active", lat: 42.3601, lng: -71.0589 },
  { id: 11, name: "Peachtree Auto", location: "Atlanta, GA", contact: "sales@peachtreeauto.com", status: "Active", lat: 33.749, lng: -84.388 },
  { id: 12, name: "London Motors", location: "London, UK", contact: "uk@londonmotors.co.uk", status: "Active", lat: 51.5074, lng: -0.1278 },
  { id: 13, name: "Toronto Autos", location: "Toronto, ON", contact: "info@torontoautos.ca", status: "Active", lat: 43.65107, lng: -79.347015 },
  { id: 14, name: "Sydney Wheels", location: "Sydney, AU", contact: "contact@sydneywheels.au", status: "Active", lat: -33.8688, lng: 151.2093 },
];

export default function DealerDashboard() {
  const [sortBy, setSortBy] = useState<"name" | "default">("default");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showMap, setShowMap] = useState(false);
  const [locationFilter, setLocationFilter] = useState<{
    query: string;
    coordinates: { lat: number; lng: number } | null;
  } | null>(null);
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleLocationSearch = (
    location: string,
    coordinates: { lat: number; lng: number } | null
  ) => {
    console.log("[v0] Location search executed:", location, coordinates);
    setLocationFilter({ query: location, coordinates });
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSortBy("default");
    setFilterStatus("all");
    setSearchQuery("");
    setLocationFilter(null);
    setCurrentPage(1);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        {/* <ApiDiagnostics /> */}

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-balance text-3xl font-bold text-foreground">
              Dealer Management
            </h1>
            <p className="text-muted-foreground">
              View and manage all dealer accounts across your network
            </p>
          </div>
          <button
            onClick={() => setShowMap(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            <MapPin className="w-4 h-4" />
            Map View
          </button>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Search Dealers by Location
          </h2>
          
          <LocationSearch onLocationSearch={handleLocationSearch} />
          {locationFilter && (
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              {locationFilter.coordinates ? (
                <span className="text-green-600 dark:text-green-400">
                  ✓ Location found: {locationFilter.query} (
                  {locationFilter.coordinates.lat.toFixed(4)},{" "}
                  {locationFilter.coordinates.lng.toFixed(4)})
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400">
                  No coordinates found for: {locationFilter.query}
                </span>
              )}
            </div>
          )}
        </div>

        <DealerFilters
          sortBy={sortBy}
          filterStatus={filterStatus}
          searchQuery={searchQuery}
          onSortChange={setSortBy}
          onStatusChange={setFilterStatus}
          onSearchChange={handleSearchChange}
          onReset={handleResetFilters}
        />

        <DealerTable
          sortBy={sortBy}
          filterStatus={filterStatus}
          searchQuery={searchQuery}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          externalDealers={SAMPLE_DEALERS}
          nearCoordinates={locationFilter?.coordinates ?? null}
          nearRadiusKm={50}
        />

        {showMap && (
          <DealerMap
            dealers={SAMPLE_DEALERS}
            onClose={() => setShowMap(false)}
          />
        )}
      </div>
    </Layout>
  );
}
