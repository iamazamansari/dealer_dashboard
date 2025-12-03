import type React from "react";

import { useState } from "react";

interface FormData {
  name: string;
  address: string;
  email: string;
  phone: string;
  operatingHours: string;
}

interface Errors {
  [key: string]: string;
}

interface DealerProfileFormProps {
  onSubmit: (data: FormData) => void;
}

export function DealerProfileForm({ onSubmit }: DealerProfileFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    address: "",
    email: "",
    phone: "",
    operatingHours: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.name.trim()) newErrors.name = "Dealer name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (formData.phone.replace(/\D/g, "").length < 10)
      newErrors.phone = "Phone must be at least 10 digits";
    if (!formData.operatingHours.trim())
      newErrors.operatingHours = "Operating hours are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        name: "",
        address: "",
        email: "",
        phone: "",
        operatingHours: "",
      });
      setTouched({});
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Dealer Information
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Dealer Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter dealer name"
          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors ${
            errors.name
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Address *
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter dealer address"
          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors ${
            errors.address
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter email address"
          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors ${
            errors.email
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Phone *
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter phone number"
          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors ${
            errors.phone
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Operating Hours *
        </label>
        <textarea
          name="operatingHours"
          value={formData.operatingHours}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="e.g., Mon-Fri: 9AM-6PM, Sat: 10AM-4PM"
          rows={3}
          className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors resize-none ${
            errors.operatingHours
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
        />
        {errors.operatingHours && (
          <p className="text-red-500 text-sm mt-1">{errors.operatingHours}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
      >
        Submit
      </button>
    </form>
  );
}
