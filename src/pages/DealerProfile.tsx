import { useState } from "react";
import { Layout } from "../components/Layout";
import { DealerProfileForm } from "../components/DealerProfileForm";
import { ProfilePreview } from "../components/ProfilePreview";

interface DealerData {
  name: string;
  address: string;
  email: string;
  phone: string;
  operatingHours: string;
}

export default function DealerProfile() {
  const [submittedData, setSubmittedData] = useState<DealerData | null>(null);

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-balance text-3xl font-bold text-gray-900 dark:text-white">
            Dealer Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create or update dealer information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DealerProfileForm onSubmit={setSubmittedData} />
          {submittedData && <ProfilePreview data={submittedData} />}
        </div>
      </div>
    </Layout>
  );
}
