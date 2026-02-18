import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function ProtectedRoute({ children }: any) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuth(false);
        setLoading(false);
        return;
      }

      try {
        await api.get("/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIsAuth(true);
      } catch (error) {
        localStorage.removeItem("token");
        setIsAuth(false);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return null;

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
}
