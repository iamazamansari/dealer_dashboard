import React from "react";

import { useState } from "react";
import { Modal } from "./Modal";

interface DealerData {
  id: string;
  name: string;
  location: string;
  contact: string;
  status: "active" | "inactive" | "pending";
  email?: string;
  address?: string;
  operatingHours?: string;
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

  React.useEffect(() => {
    setFormData(dealer);
    setErrors({});
  }, [dealer, isOpen]);

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
      onSave(formData);
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
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Location
          </label>
          {mode === "view" ? (
            <div className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
              {formData.location}
            </div>
          ) : (
            <>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </>
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
                setFormData({ ...formData, status: e.target.value as any })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          )}
        </div>

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
  switch (status) {
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
