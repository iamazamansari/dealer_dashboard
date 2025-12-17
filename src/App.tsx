import { Routes, Route } from "react-router-dom";
import DealerDashboard from "./pages/DealerDashboard";
import DealerProfile from "./pages/DealerProfile";
import ApiTest from "./pages/ApiTest";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DealerDashboard />} />
      <Route path="/dealer-profile" element={<DealerProfile />} />
      <Route path="/api-test" element={<ApiTest />} />
    </Routes>
  );
}
