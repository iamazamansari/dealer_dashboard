import type React from "react";
import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { validateAddress } from "../services/geocoding";

interface LocationSearchProps {
  onLocationSearch: (
    location: string,
    coordinates: { lat: number; lng: number } | null
  ) => void;
}

export function LocationSearch({ onLocationSearch }: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setSearchError("Please enter a location");
      return;
    }

    setIsSearching(true);
    setSearchError("");
    console.log("[v0] Searching for location:", searchQuery);

    try {
      const result = await validateAddress(searchQuery);

      if (result && result.isValid) {
        console.log("[v0] Location found:", result.formattedAddress);
        onLocationSearch(searchQuery, { lat: result.lat, lng: result.lng });
      } else {
        console.log("[v0] Location not found");
        setSearchError("Location not found. Please try a different search.");
        onLocationSearch(searchQuery, null);
      }
    } catch (error) {
      console.error("[v0] Search error:", error);
      setSearchError("Failed to search location. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MapPin className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSearchError("");
          }}
          placeholder="Search by city, state, or address..."
          className="w-full pl-10 pr-24 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          disabled={isSearching}
        />
        <button
          type="submit"
          disabled={isSearching}
          className="absolute inset-y-0 right-0 flex items-center px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-r-lg transition-colors"
        >
          <Search className="w-4 h-4 mr-1" />
          {isSearching ? "Searching..." : "Search"}
        </button>
      </div>
      {searchError && (
        <p className="text-red-500 text-sm mt-1">{searchError}</p>
      )}
      <p className="text-gray-500 text-xs mt-1">
        Search for dealers near a specific location using the configured geocoding provider (OpenStreetMap by default)
      </p>
    </form>
  );
}
