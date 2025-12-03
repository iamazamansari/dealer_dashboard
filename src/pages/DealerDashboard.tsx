import { useState } from "react";
import { Layout } from "../components/Layout";
import { DealerTable } from "../components/DealerTable";
import { DealerFilters } from "../components/DealerFilter";

export default function DealerDashboard() {
  const [sortBy, setSortBy] = useState<"name" | "default">("default");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleResetFilters = () => {
    setSortBy("default");
    setFilterStatus("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-balance text-3xl font-bold text-foreground">
            Dealer Management
          </h1>
          <p className="text-muted-foreground">
            View and manage all dealer accounts across your network
          </p>
        </div>

        <DealerFilters
          sortBy={sortBy}
          filterStatus={filterStatus}
          searchQuery={searchQuery}
          onSortChange={setSortBy}
          onStatusChange={setFilterStatus}
          onSearchChange={handleSearchChange}
          onReset={handleResetFilters}
        />

        <DealerTable
          sortBy={sortBy}
          filterStatus={filterStatus}
          searchQuery={searchQuery}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </Layout>
  );
}
