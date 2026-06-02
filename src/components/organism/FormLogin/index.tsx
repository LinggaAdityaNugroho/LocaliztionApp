import { useState } from "react";
import { MyInputForm } from "../../molecules/Form";
import { Button } from "../../ui/button";
import { Loader2, Eye, EyeOff } from "lucide-react";
import api from "../../../services/api";
import { Card } from "../../ui/card";

export function FormLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await api.post("/auth/sync", { email, password });

      localStorage.setItem("auth", JSON.stringify(response.data));

      localStorage.setItem("token", response.data.token);

      window.location.replace("/dashboard");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Koneksi ke server gagal.";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center mb-6">
      <form onSubmit={handleLogin} className="space-y-4">
        {errorMsg && (
          <Card className="border-2 border-red-500 dark:border-red-900 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] dark:shadow-none p-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-3 text-left">
              <div className="overflow-hidden">
                <p className="font-bold text-xs tracking-tight leading-tight">
                  {errorMsg}
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="text-left">
          <MyInputForm
            label="Email"
            type="email"
            placeholder="nama@email.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1 relative text-left">
          <MyInputForm
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-black hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <Button
          type="submit"
          variant={"brutal"}
          className="w-full py-6 bg-blue-700 text-white"
          disabled={isLoading}
        >
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
    </div>
  );
}
