import { useState } from "react";
import { MyInputForm } from "../../molecules/Form";
import { MyButtonIcon } from "../../atoms/Button";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import api from "../../../services/api";
import { Button } from "../../ui/button";
import { Loader2, Eye, EyeOff } from "lucide-react"; // Tambahkan icon Eye

export function FormLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const loginGoogle = () => {
    window.location.href = "http://localhost:8000/api/auth/google/redirect";
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await api.post("/login", { email, password });
      localStorage.setItem("token", response.data.token);
      window.location.replace("/dashboard");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Koneksi ke server gagal.";
      setErrorMsg(msg);
      console.error("Login Error:", error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center mb-6">
      <form onSubmit={handleLogin} className="space-y-4">
        {errorMsg && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
            {errorMsg}
          </div>
        )}

        <MyInputForm
          label="Email"
          type="email"
          placeholder="nama@email.com"
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="space-y-1 relative">
          <MyInputForm
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>

          <div className="flex justify-end">
            <a href="#" className="text-xs text-blue-600 hover:underline">
              Lupa password?
            </a>
          </div>
        </div>

        <Button type="submit" className="w-full py-6" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Tunggu sebentar...
            </>
          ) : (
            "Masuk Sekarang"
          )}
        </Button>
      </form>

      {/* ... sisanya sama ... */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Atau masuk dengan</span>
        </div>
      </div>

      <MyButtonIcon
        className="w-full border border-gray-300 py-3 hover:bg-gray-50"
        titleButton="Google Workspace"
        icon={faGoogle}
        size="lg"
        onClick={loginGoogle}
      />
    </div>
  );
}
