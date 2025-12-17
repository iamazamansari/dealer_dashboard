import React from "react";
import { useState } from "react";
import { Modal } from "../components/Modal";
import { AddressAutocomplete } from "../components/Address-autocomplete";
import { ProviderBadge } from "./ProviderBadge";

interface DealerData {
  id: number;
  name: string;
  location: string;
  contact: string;
  status: "Active" | "Inactive" | "Pending";
  email?: string;
  address?: string;
  operatingHours?: string;
  lat?: number;
  lng?: number;
  placeId?: string;
}

interface DealerModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealer: DealerData | null;
  mode: "view" | "edit";
  onSave?: (updatedDealer: DealerData) => void;
}

export function DealerModal({
  isOpen,
  onClose,
  dealer,
  mode,
  onSave,
}: DealerModalProps) {
  const [formData, setFormData] = useState<DealerData | null>(dealer);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [addressDetails, setAddressDetails] = useState<{ lat?: number; lng?: number; placeId?: string } | null>(null);

  React.useEffect(() => {
    setFormData(dealer);
    setErrors({});
    setAddressDetails(null);
  }, [dealer, isOpen]);

  const handleAddressChange = (value: string, placeDetails?: { lat?: number; lng?: number; placeId?: string }) => {
    setFormData({ ...formData!, location: value });
    if (placeDetails) {
      console.log("[v0] Address validated with coordinates:", placeDetails);
      setAddressDetails(placeDetails);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData?.name?.trim()) {
      newErrors.name = "Dealer name is required";
    }

    if (!formData?.location?.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData?.contact?.trim()) {
      newErrors.contact = "Contact is required";
    } else if (!/^\d{10,}$/.test(formData.contact.replace(/\D/g, ""))) {
      newErrors.contact = "Contact must be at least 10 digits";
    }

    if (formData?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm() && formData && onSave) {
      const updatedDealer = {
        ...formData,
        ...(addressDetails && {
          lat: addressDetails.lat,
          lng: addressDetails.lng,
          placeId: addressDetails.placeId,
        }),
      };
      console.log("[v0] Saving dealer with validated address:", updatedDealer);
      onSave(updatedDealer);
      onClose();
    }
  };

  if (!dealer || !formData) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === "view" ? "View Dealer Details" : "Edit Dealer Information"
      }
      size="lg"
    >
      <div className="space-y-6">
        {/* Dealer Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Dealer Name
          </label>
          {mode === "view" ? (
            <div className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
              {formData.name}
            </div>
          ) : (
            <>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            Location <span className="ml-2"><ProviderBadge provider="openstreetmap" /></span>
          </label>
          {mode === "view" ? (
            <div className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
              {formData.location}
            </div>
          ) : (
            <AddressAutocomplete
              value={formData.location}
              onChange={handleAddressChange}
              placeholder="Enter dealer address"
              error={errors.location}
              name="location"
            />
          )}
        </div>

        {/* Contact */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Contact
          </label>
          {mode === "view" ? (
            <div className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
              <a
                href={`tel:${formData.contact}`}
                className="hover:text-purple-600 underline"
              >
                {formData.contact}
              </a>
            </div>
          ) : (
            <>
              <input
                type="tel"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.contact && (
                <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
              )}
            </>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Email
          </label>
          {mode === "view" ? (
            <div className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
              {formData.email ? (
                <a
                  href={`mailto:${formData.email}`}
                  className="hover:text-purple-600 underline"
                >
                  {formData.email}
                </a>
              ) : (
                <span className="text-gray-500">Not provided</span>
              )}
            </div>
          ) : (
            <>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="optional@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Status
          </label>
          {mode === "view" ? (
            <div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                  formData.status
                )}`}
              >
                {formData.status.charAt(0).toUpperCase() +
                  formData.status.slice(1)}
              </span>
            </div>
          ) : (
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as DealerData['status'] })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
            </select>
          )}
        </div>

        {addressDetails && mode === "edit" && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <p className="text-sm text-green-700 dark:text-green-300 font-medium">
              ✓ Address validated (verified)
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              Coordinates: {typeof addressDetails.lat === 'number' ? addressDetails.lat.toFixed(6) : 'N/A'},{" "}
              {typeof addressDetails.lng === 'number' ? addressDetails.lng.toFixed(6) : 'N/A'}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {mode === "view" ? "Close" : "Cancel"}
          </button>
          {mode === "edit" && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200";
    case "inactive":
      return "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200";
    case "pending":
      return "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200";
    default:
      return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200";
  }
};
