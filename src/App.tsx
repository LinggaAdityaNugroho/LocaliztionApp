import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { MapLab } from "./pages/MapPage";
import { Dashboard } from "./pages/DashboardPage";
import { SettingPage } from "./pages/SettingPage";
import { DeviceManagement } from "./pages/DevicePage";
import { AppLayout } from "./layouts/AppLayout/layouts";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<AppLayout />}>
          <Route path="/map" element={<MapLab />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<SettingPage />} />
          <Route path="/device-management" element={<DeviceManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
