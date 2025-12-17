import { useEffect, useState, useRef, useId } from "react";
import { osmSearch, validateAddressWithOSM } from "../services/geocoding";
import { ProviderBadge } from "./ProviderBadge";

interface PlaceDetails {
  lat?: number;
  lng?: number;
  placeId?: string;
  // structured address object (key/value map) or components array
  addressComponents?: Record<string, unknown> | unknown[] | undefined;
}

interface OSMResult {
  display_name: string;
  lat: string;
  lon: string;
  osm_id?: number;
  osm_type?: string;
  place_id?: string;
  type?: string;
  address?: Record<string, unknown>;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string, details?: PlaceDetails) => void;
  placeholder?: string;
  error?: string;
  name?: string;
  onBlur?: () => void;
}

export function AddressAutocomplete({
  value,
  onChange,
  placeholder = "Enter address",
  error,
  name,
  onBlur,
}: AddressAutocompleteProps) {
  const [input, setInput] = useState(() => value || "");
  const [suggestions, setSuggestions] = useState<OSMResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const listboxId = `osm-listbox-${useId()}`;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const controllerRef = useRef<AbortController | null>(null);
  const timerRef = useRef<number | null>(null);

  const syncTimeoutRef = useRef<number | null>(null);
  useEffect(() => {
    if (value !== input) {
      if (syncTimeoutRef.current) window.clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = window.setTimeout(() => {
        setInput(value || "");
      }, 0);
    }

    return () => {
      if (syncTimeoutRef.current) window.clearTimeout(syncTimeoutRef.current);
    };
  }, [value, input]);

  useEffect(() => {
    if (!input.trim()) {
      // defer state changes to avoid synchronous setState inside effect
      if (suggestions.length > 0) {
        window.setTimeout(() => setSuggestions([]), 0);
      }
      if (isValidated) {
        window.setTimeout(() => setIsValidated(false), 0);
      }
      return;
    }

    // debounce
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(async () => {
      if (controllerRef.current) controllerRef.current.abort();
      controllerRef.current = new AbortController();
      setIsLoading(true);

      try {
        const results = await osmSearch(input);
        setSuggestions(results || []);
      } catch (err) {
        console.error("[v0] OSM search error:", err);
        setSuggestions([]);
      }

      setIsLoading(false);
    }, 350);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [input, suggestions.length, isValidated]);

  const handleSelect = (place: OSMResult) => {
    setInput(place.display_name);
    setSuggestions([]);
    setIsValidated(true);
    setHighlightedIndex(-1);

    onChange(place.display_name, {
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
      placeId: `osm:${place.osm_type}/${place.osm_id}`,
      addressComponents: place.address || {},
    });

    // return focus to input for better keyboard flow
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(suggestions.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(-1, i - 1));
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        e.preventDefault();
        handleSelect(suggestions[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setHighlightedIndex(-1);
    }
  };

  const handleBlur = async () => {
    // If user typed and left without selecting, try to validate the typed address
    if (!isValidated && input.trim()) {
      setIsLoading(true);
      const res = await validateAddressWithOSM(input);
      setIsLoading(false);

      if (res && res.isValid) {
        setInput(res.formattedAddress);
        setIsValidated(true);
        onChange(res.formattedAddress, {
          lat: res.lat,
          lng: res.lng,
          placeId: res.placeId,
          addressComponents: res.addressComponents,
        });
      }
    }
  };

  return (
    <div className="relative">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-3">
        Address *
        <span className="ml-2">
          <ProviderBadge provider="openstreetmap" />
        </span>
        {isValidated && (
          <span className="text-green-600 text-xs ml-auto inline-flex items-center gap-2">
            <svg className="w-3 h-3 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-xs">Validated</span>
          </span>
        )}
      </label>

      <input
        ref={inputRef}
        name={name}
        aria-controls={listboxId}
        aria-expanded={suggestions.length > 0}
        aria-autocomplete="list"
        role="combobox"
        type="text"
        value={input}
        onKeyDown={handleKeyDown}
        onChange={(e) => {
          setIsValidated(false);
          setHighlightedIndex(-1);
          setInput(e.target.value);
          onChange(e.target.value);
        }}
        onBlur={() => {
          setTimeout(handleBlur, 150);
          if (typeof onBlur === "function") onBlur();
        }}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors ${
          isValidated ? "border-green-500" : "border-gray-300 dark:border-gray-600"
        }`}      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {isLoading && <p className="text-gray-500 text-xs mt-1">Searching...</p>}

      {suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md z-10 max-h-48 overflow-auto">
          {suggestions.map((s, idx) => (
            <li
              key={`${s.place_id || s.osm_id}-${idx}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(s)}
              className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
            >
              <div className="font-medium truncate">{s.display_name}</div>
              <div className="text-xs text-gray-500 truncate">{s.type}</div>
            </li>
          ))}
        </ul>
      )}

      <p className="text-gray-500 text-xs mt-1">
        This uses OpenStreetMap (OSM) as a free fallback for address lookup.
      </p>
    </div>
  );
}

export default AddressAutocomplete;
