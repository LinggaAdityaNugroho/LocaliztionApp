import { MyButton } from "../../components/atoms/Button";
import { useTheme } from "../../components/themes/themes-provider";
import { Moon, Sun, User, Globe, Palette, Camera } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import api from "../../services/api";
import { useEffect, useState } from "react";

interface UserData {
  name: string;
  email: string;
  avatar: string;
}

export function SettingPage() {
  const { theme, setTheme } = useTheme();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await api.get("user");
        setUserData(res.data);
      } catch (error) {
        console.log("Failed get data");
      }
    };
    getUser();
  }, []);

  return (
    <div className="py-6 px-4 lg:py-10 lg:px-12 max-w-7xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="border-b pb-6">
        <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">
          Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your account details, preferences, and interface themes.
        </p>
      </div>

      <div className="grid gap-10">
        {/* Section: Profile */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <User className="text-blue-600" size={20} />
            <h2 className="text-xl font-bold">Profile Details</h2>
          </div>

          <Card className="border-none shadow-sm bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md">
            <CardContent className="p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
                <div className="lg:col-span-3 space-y-8 order-2 lg:order-1">
                  {/* Name Section */}
                  <div className="group flex flex-col space-y-1.5 transition-all">
                    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                      <User
                        size={14}
                        className="group-hover:text-blue-500 transition-colors"
                      />
                      <span className="text-xs font-bold uppercase tracking-widest">
                        Full Name
                      </span>
                    </div>
                    <p className="text-xl font-black text-slate-800 dark:text-slate-100 sm:text-2xl tracking-tight">
                      {userData?.name || "Anonymous User"}
                    </p>
                    <div className="h-0.5 w-12 bg-blue-500/30 rounded-full group-hover:w-24 transition-all duration-500" />
                  </div>

                  {/* Email Section */}
                  <div className="group flex flex-col space-y-1.5 transition-all">
                    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                      <Globe
                        size={14}
                        className="group-hover:text-purple-500 transition-colors"
                      />
                      <span className="text-xs font-bold uppercase tracking-widest">
                        Email Address
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">
                      {userData?.email || "email@example.com"}
                    </p>
                  </div>
                </div>

                {/* Avatar Upload */}
                <div className="flex flex-col gap-4 items-center order-1 lg:order-2">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
                    <img
                      src={userData?.avatar || "/public/img/profile.png"}
                      alt="Profile"
                      className="relative w-28 h-28 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-xl"
                    />
                    <button className="absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                      <Camera size={16} />
                    </button>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-400 font-medium">
                      JPG, GIF or PNG. Max 2MB
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Section: Preferences */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Theme Card */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="text-purple-600" size={20} />
              <h2 className="text-lg font-bold">Appearance</h2>
            </div>
            <Card className="hover:border-purple-200 transition-colors">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">
                    Interface Theme
                  </p>
                  <p className="text-sm text-slate-400">
                    Switch between light and dark mode
                  </p>
                </div>
                <MyButton
                  variant="outline"
                  size="icon"
                  className="rounded-xl h-12 w-12 border-2"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Sun className="text-yellow-500" />
                  ) : (
                    <Moon className="text-blue-600" />
                  )}
                </MyButton>
              </CardContent>
            </Card>
          </section>

          {/* Language Card */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="text-emerald-600" size={20} />
              <h2 className="text-lg font-bold">Region</h2>
            </div>
            <Card className="hover:border-emerald-200 transition-colors">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">
                    Language
                  </p>
                  <p className="text-sm text-slate-400">
                    Set your preferred language
                  </p>
                </div>
                <select className="bg-transparent font-medium text-sm border rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option>English (US)</option>
                  <option>Bahasa Indonesia</option>
                  <option>Japanese</option>
                </select>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
