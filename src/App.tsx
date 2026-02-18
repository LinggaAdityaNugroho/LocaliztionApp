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
import AuthSuccess from "./components/organism/FormLogin/AuthSuccess";
import GuestRoute from "./routes/GuestRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import { NotFoundPage } from "./pages/NotFoundPage/NotFoundPage";
import { ProtectedNotFoundPage } from "./routes/ProtectedNotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/success" element={<AuthSuccess />} />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<MapLabPage />} />
          <Route path="/settings" element={<SettingPage />} />
          <Route path="/device-management" element={<DeviceManagement />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route
            path="/manajemen-inventory"
            element={<ManajemenInventoryPage />}
          />

          <Route path="*" element={<ProtectedNotFoundPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
