import { Mail, Phone, MapPin, Clock, CheckCircle, Globe } from "lucide-react";
import { ProviderBadge } from "./ProviderBadge";

interface PreviewProps {
  data: {
    name: string;
    address: string;
    email: string;
    phone: string;
    operatingHours: string;
    lat?: number;
    lng?: number;
    placeId?: string;
  };
}

export function ProfilePreview({ data }: PreviewProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800 p-8 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-purple-200 dark:border-purple-800">
        <CheckCircle className="w-6 h-6 text-green-500" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          Profile Preview
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Dealer Name
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {data.name}
          </p>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
              <span><ProviderBadge provider="openstreetmap" /></span>
            </div>
            <p className="text-gray-900 dark:text-white">{data.address}</p>
            {data.lat && data.lng && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                ✓ Verified Location: {data.lat.toFixed(6)}, {data.lng.toFixed(6)}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
            <a
              href={`mailto:${data.email}`}
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              {data.email}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
            <a
              href={`tel:${data.phone}`}
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              {data.phone}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Operating Hours
            </p>
            <p className="text-gray-900 dark:text-white whitespace-pre-line">
              {data.operatingHours}
            </p>
          </div>
        </div>

        {data.lat && data.lng && (
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View on Map
              </p>
              <a
                href={`https://www.openstreetmap.org/?mlat=${data.lat}&mlon=${data.lng}#map=18/${data.lat}/${data.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1"
              >
                Open in OpenStreetMap
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-purple-200 dark:border-purple-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          ✓ All information successfully submitted
        </p>
      </div>
    </div>
  );
}
