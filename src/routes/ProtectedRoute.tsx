import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuth(false);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/user");
        setIsAuth(true);
        // Pastikan backend kamu mengirim field 'role', jika tidak ada ganti ke 'user'
        setUserRole(response.data.role || "user");
      } catch (error: any) {
        console.error("Auth Error:", error);

        // HANYA tendang ke login jika error 401 (Token kadaluarsa/salah)
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          setIsAuth(false);
        } else {
          // Jika error 500 atau koneksi Ngrok bermasalah,
          // tetap izinkan masuk selama ada token di storage (opsional)
          setIsAuth(true);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return null;

  if (!isAuth) return <Navigate to="/" replace />;

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? children : <Outlet />;
}
