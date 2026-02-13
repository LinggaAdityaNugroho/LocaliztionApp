import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { MapLabPage } from "./pages/MapPage";
import { Dashboard } from "./pages/DashboardPage";
import { SettingPage } from "./pages/SettingPage";
import { DeviceManagement } from "./pages/DevicePage";
import { AppLayout } from "./layouts/AppLayout/layouts";
import { HistoryPage } from "./pages/HistoryPage";
import { ManajemenInventoryPage } from "./pages/ManajemenPage/ManajemenInventoryPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<AppLayout />}>
          <Route path="/map" element={<MapLabPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<SettingPage />} />
          <Route path="/device-management" element={<DeviceManagement />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route
            path="/manajemen-inventory"
            element={<ManajemenInventoryPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
