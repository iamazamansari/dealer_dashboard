import { useState } from "react";
import { Layout } from "../components/Layout";
import { AddressAutocomplete } from "../components/Address-autocomplete";
import { LocationSearch } from "../components/Location-search";
import { validateAddress } from "../services/geocoding";
import { CheckCircle, XCircle, MapPin } from "lucide-react";
import { ApiDiagnostics } from "../components/Api-diagnostics";

export default function ApiTest() {
  const [testAddress, setTestAddress] = useState("");
  const [testAddressDetails, setTestAddressDetails] = useState<any>(null);
  const [manualAddress, setManualAddress] = useState("");
  const [manualResult, setManualResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleManualValidation = async () => {
    if (!manualAddress.trim()) return;

    setIsValidating(true);
    console.log("[v0] Manual validation test:", manualAddress);

    const result = await validateAddress(manualAddress);
    setManualResult(result);
    setIsValidating(false);

    console.log("[v0] Validation result:", result);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Maps API Test (demo)
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test Places Autocomplete and Geocoding integration (uses configured provider)
          </p>
        </div>

        <ApiDiagnostics />

        {/* Test 1: Places Autocomplete API */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-600" />
            Test 1: Places Autocomplete
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Start typing an address to see autocomplete suggestions from the configured provider
          </p>

          <AddressAutocomplete
            value={testAddress}
            onChange={(value, details) => {
              setTestAddress(value);
              setTestAddressDetails(details);
            }}
            placeholder="Type an address (e.g., 1600 Amphitheatre Parkway)"
          />

          {testAddressDetails && (
            <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-green-900 dark:text-green-100">
                    Address validated successfully!
                  </p>
                  <div className="mt-2 space-y-1 text-sm text-green-800 dark:text-green-200">
                    <p>
                      <strong>Formatted Address:</strong> {testAddress}
                    </p>
                    <p>
                      <strong>Latitude:</strong> {testAddressDetails.lat}
                    </p>
                    <p>
                      <strong>Longitude:</strong> {testAddressDetails.lng}
                    </p>
                    <p>
                      <strong>Place ID:</strong> {testAddressDetails.placeId}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Test 2: Geocoding API */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Test 2: Geocoding API
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Enter any address and click validate to test the Geocoding API
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              placeholder="Enter full address (e.g., New York, NY)"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              onKeyDown={(e) => e.key === "Enter" && handleManualValidation()}
            />
            <button
              onClick={handleManualValidation}
              disabled={isValidating || !manualAddress.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
            >
              {isValidating ? "Validating..." : "Validate"}
            </button>
          </div>

          {manualResult && (
            <div
              className={`mt-4 rounded-lg p-4 border ${
                manualResult.isValid
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
              }`}
            >
              <div className="flex items-start gap-2">
                {manualResult.isValid ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                )}
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      manualResult.isValid
                        ? "text-green-900 dark:text-green-100"
                        : "text-red-900 dark:text-red-100"
                    }`}
                  >
                    {manualResult.isValid
                      ? "Valid Address Found!"
                      : "Address Not Found"}
                  </p>
                  {manualResult.isValid && (
                    <div
                      className={`mt-2 space-y-1 text-sm ${
                        manualResult.isValid
                          ? "text-green-800 dark:text-green-200"
                          : "text-red-800 dark:text-red-200"
                      }`}
                    >
                      <p>
                        <strong>Formatted Address:</strong>{" "}
                        {manualResult.formattedAddress}
                      </p>
                      <p>
                        <strong>Latitude:</strong> {manualResult.lat}
                      </p>
                      <p>
                        <strong>Longitude:</strong> {manualResult.lng}
                      </p>
                      <p>
                        <strong>Place ID:</strong> {manualResult.placeId}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Test 3: Location Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-600" />
            Test 3: Location-Based Search
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Search by location to find coordinates (used in dealer dashboard)
          </p>

          <LocationSearch
            onLocationSearch={(location, coords) => {
              console.log(
                "[v0] Location search test result:",
                location,
                coords
              );
            }}
          />
        </div>

        {/* Test 4: OpenStreetMap (OSM) Fallback */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            Test 4: OpenStreetMap (OSM) Fallback
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Free fallback lookup using OpenStreetMap (OSM). Good for testing and as a backup when Google API is unavailable.
          </p>

          <AddressAutocomplete
            value={testAddress}
            onChange={(value, details) => {
              setTestAddress(value);
              setTestAddressDetails(details);
            }}
            placeholder="Try: 10 Downing St, London"
          />

          {testAddressDetails && (
            <div className="mt-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-emerald-900 dark:text-emerald-100">
                    Address found (fallback)
                  </p>
                  <div className="mt-2 space-y-1 text-sm text-emerald-800 dark:text-emerald-200">
                    <p>
                      <strong>Formatted Address:</strong> {testAddress}
                    </p>
                    <p>
                      <strong>Latitude:</strong> {testAddressDetails?.lat}
                    </p>
                    <p>
                      <strong>Longitude:</strong> {testAddressDetails?.lng}
                    </p>
                    <p>
                      <strong>Place ID:</strong> {testAddressDetails?.placeId}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Provider Status */}
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
            Geocoding Provider
          </h3>
          <p className="text-sm text-purple-800 dark:text-purple-200">
            Using <strong>OpenStreetMap (OSM)</strong> for lookup and validation in demo mode.
          </p>
          <p className="text-xs text-purple-600 dark:text-purple-300 mt-1">
            (If you add a Google API key and enable the related APIs, the app can optionally use Google when available.)
          </p>
        </div>
      </div>
    </Layout>
  );
}
