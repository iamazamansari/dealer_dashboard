import { Routes, Route } from "react-router-dom";
import DealerDashboard from "./pages/DealerDashboard";
import DealerProfile from "./pages/DealerProfile";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DealerDashboard />} />
      <Route path="/dealer-profile" element={<DealerProfile />} />
    </Routes>
  );
}
