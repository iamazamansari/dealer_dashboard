import { Search, RotateCcw } from "lucide-react";

interface DealerFiltersProps {
  sortBy: "name" | "default";
  filterStatus: string;
  searchQuery: string;
  onSortChange: (value: "name" | "default") => void;
  onStatusChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onReset: () => void;
}

export function DealerFilters({
  sortBy,
  filterStatus,
  searchQuery,
  onSortChange,
  onStatusChange,
  onSearchChange,
  onReset,
}: DealerFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by dealer name or location..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as "name" | "default")}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm"
          >
            <option value="default">Default</option>
            <option value="name">Dealer Name (A-Z)</option>
          </select>
        </div>

        <div className="flex-1 min-w-0">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter by Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors mt-8 md:mt-0"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
