import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import SubscriptionPage from "./pages/SubscriptionPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/subscribe" element={<Navigate to="/subscribe/bloom-one" replace />} />
      <Route path="/subscribe/:planSlug" element={<SubscriptionPage />} />
    </Routes>
  );
}

export default App;
