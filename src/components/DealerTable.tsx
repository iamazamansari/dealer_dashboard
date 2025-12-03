import { useState } from "react";
import { Eye, Edit2 } from "lucide-react";
import { DealerModal } from "./DealerModal";

interface Dealer {
  id: string;
  name: string;
  location: string;
  contact: string;
  status: "active" | "inactive" | "pending";
  email?: string;
  address?: string;
  operatingHours?: string;
}

interface DealerTableProps {
  sortBy: "name" | "default";
  filterStatus: string;
  searchQuery: string;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const initialDealers: Dealer[] = [
  {
    id: "1",
    name: "Premium Motors",
    location: "New York, NY",
    contact: "(555) 123-4567",
    status: "active",
    email: "info@premiummotors.com",
  },
  {
    id: "2",
    name: "City Auto Sales",
    location: "Los Angeles, CA",
    contact: "(555) 987-6543",
    status: "active",
    email: "sales@cityauto.com",
  },
  {
    id: "3",
    name: "Highway Imports",
    location: "Chicago, IL",
    contact: "(555) 456-7890",
    status: "inactive",
  },
  {
    id: "4",
    name: "Elite Dealerships",
    location: "Houston, TX",
    contact: "(555) 321-0987",
    status: "pending",
  },
  {
    id: "5",
    name: "Auto Express",
    location: "Phoenix, AZ",
    contact: "(555) 654-3210",
    status: "active",
  },
  {
    id: "6",
    name: "Sunset Automotive",
    location: "San Diego, CA",
    contact: "(555) 111-2222",
    status: "active",
  },
  {
    id: "7",
    name: "North Star Motors",
    location: "Dallas, TX",
    contact: "(555) 333-4444",
    status: "active",
  },
  {
    id: "8",
    name: "Mountain View Auto",
    location: "San Jose, CA",
    contact: "(555) 555-6666",
    status: "inactive",
  },
  {
    id: "9",
    name: "Liberty Car Sales",
    location: "Austin, TX",
    contact: "(555) 777-8888",
    status: "pending",
  },
  {
    id: "10",
    name: "Golden State Motors",
    location: "San Francisco, CA",
    contact: "(555) 999-0000",
    status: "active",
  },
  {
    id: "11",
    name: "Tech Valley Autos",
    location: "Seattle, WA",
    contact: "(555) 111-3333",
    status: "active",
  },
  {
    id: "12",
    name: "Metro Auto Group",
    location: "Boston, MA",
    contact: "(555) 222-4444",
    status: "active",
  },
  {
    id: "13",
    name: "Riverside Dealers",
    location: "Miami, FL",
    contact: "(555) 333-5555",
    status: "inactive",
  },
  {
    id: "14",
    name: "Crown Automotive",
    location: "Denver, CO",
    contact: "(555) 444-6666",
    status: "active",
  },
  {
    id: "15",
    name: "Westside Motors",
    location: "Portland, OR",
    contact: "(555) 555-7777",
    status: "pending",
  },
];

const ITEMS_PER_PAGE = 10;

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

export function DealerTable({
  sortBy,
  filterStatus,
  searchQuery,
  currentPage,
  onPageChange,
}: DealerTableProps) {
  const [dealers, setDealers] = useState<Dealer[]>(initialDealers);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");

  const handleViewDealer = (dealer: Dealer) => {
    setSelectedDealer(dealer);
    setModalMode("view");
    setModalOpen(true);
  };

  const handleEditDealer = (dealer: Dealer) => {
    setSelectedDealer(dealer);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleSaveDealer = (updatedDealer: Dealer) => {
    setDealers(
      dealers.map((d) => (d.id === updatedDealer.id ? updatedDealer : d))
    );
    setModalOpen(false);
  };

  let filteredDealers = [...dealers];

  if (searchQuery.trim()) {
    filteredDealers = filteredDealers.filter(
      (d) =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (filterStatus !== "all") {
    filteredDealers = filteredDealers.filter((d) => d.status === filterStatus);
  }

  if (sortBy === "name") {
    filteredDealers.sort((a, b) => a.name.localeCompare(b.name));
  }

  const totalPages = Math.ceil(filteredDealers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedDealers = filteredDealers.slice(startIndex, endIndex);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-3 text-left font-semibold text-gray-900 dark:text-white">
                  Dealer Name
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900 dark:text-white">
                  Location
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900 dark:text-white">
                  Contact
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900 dark:text-white">
                  Status
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-900 dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedDealers.length > 0 ? (
                paginatedDealers.map((dealer) => (
                  <tr
                    key={dealer.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-3 text-gray-900 dark:text-white font-medium">
                      {dealer.name}
                    </td>
                    <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                      {dealer.location}
                    </td>
                    <td className="px-6 py-3 text-gray-600 dark:text-gray-400">
                      {dealer.contact}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          dealer.status
                        )}`}
                      >
                        {dealer.status.charAt(0).toUpperCase() +
                          dealer.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDealer(dealer)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-xs font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => handleEditDealer(dealer)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 rounded hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors text-xs font-medium"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No dealers found matching your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredDealers.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredDealers.length)} of{" "}
              {filteredDealers.length} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => onPageChange(page)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-purple-600 text-white"
                          : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <DealerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        dealer={selectedDealer}
        mode={modalMode}
        onSave={handleSaveDealer}
      />
    </>
  );
}
