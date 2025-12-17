import { useState } from "react";
import { osmSearch } from "../services/geocoding";

export function ApiDiagnostics() {
  const [testStatus, setTestStatus] = useState<
    null | "idle" | "loading" | "success" | "error"
  >(null);
  const [testMessage, setTestMessage] = useState<string | null>(null);

  const runOSMTest = async () => {
    setTestStatus("loading");
    setTestMessage(null);

    try {
      const results = await osmSearch("Delhi");
      if (results && results.length > 0) {
        setTestStatus("success");
        setTestMessage(`OK — ${results[0].display_name}`);
      } else {
        setTestStatus("error");
        setTestMessage("No results returned from OpenStreetMap");
      }
    } catch (e) {
      setTestStatus("error");
      setTestMessage(String(e));
    }
  };

  const runGoogleTest = async () => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!key) return;

    setTestStatus("loading");
    setTestMessage(null);

    try {
      const resp = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          "Delhi"
        )}&key=${key}`
      );
      const data = await resp.json();

      if (data.status === "OK" && data.results && data.results.length > 0) {
        setTestStatus("success");
        setTestMessage(`OK — ${data.results[0].formatted_address}`);
      } else {
        setTestStatus("error");
        setTestMessage(`${data.status}${data.error_message ? `: ${data.error_message}` : ""}`);
      }
    } catch (e) {
      setTestStatus("error");
      setTestMessage(String(e));
    }
  };

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
      <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
        Geocoding Provider Status
      </h3>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium text-yellow-700 dark:text-yellow-300">
            Provider:
          </span>
          <span className="text-green-600 font-semibold">OpenStreetMap (OSM)</span>
        </div>

        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-2">
            <button
              onClick={runOSMTest}
              disabled={testStatus === "loading"}
              className="inline-flex items-center gap-2 px-3 py-1 rounded bg-yellow-700 text-white disabled:opacity-50"
            >
              {testStatus === "loading" ? "Testing…" : "Test OpenStreetMap"}
            </button>
            <span className="text-xs text-gray-500">Quick connectivity check</span>
          </div>

          {import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
            <div className="flex items-center gap-2">
              <button
                onClick={runGoogleTest}
                disabled={testStatus === "loading"}
                className="inline-flex items-center gap-2 px-3 py-1 rounded bg-gray-800 text-white disabled:opacity-50"
              >
                {testStatus === "loading" ? "Testing…" : "Test Google"}
              </button>
              <span className="text-xs text-gray-500">Test your configured Google key</span>
            </div>
          )}

          {testStatus && testStatus !== "loading" && (
            <div className="ml-0 mt-1">
              <span
                className={`text-sm font-medium ${
                  testStatus === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {testMessage}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
