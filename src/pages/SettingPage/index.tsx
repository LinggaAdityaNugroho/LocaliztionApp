import { MyInputForm } from "../../components/molecules/Form";
import { MyButton } from "../../components/atoms/Button";
import { useTheme } from "../../components/themes/themes.provider";
import { Moon, Sun } from "lucide-react";

export function SettingPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="py-2 px-4 lg:py-4 lg:px-8 space-y-10 ">
      <div>
        <h2 className="font-bold">User & Account Settings</h2>
        <p>Manage your account settings and preferences</p>
      </div>

      {/* Profile */}
      <div>
        <div>
          <p className="font-bold">Profile</p>
          <p className="font-light">Set your account detail</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 py-4 gap-10 w-full ">
          <div className="flex flex-1 flex-col gap-4 col-span-2 lg:col-span-3 order-2 lg:order-1 place-content-between ">
            <MyInputForm label="Name" />
            <MyInputForm label="Password" type="password" />
          </div>
          <div className="flex flex-col gap-2 items-center order-1 lg:order-2 col-span-2 lg:col-span-1 ">
            <img
              src="/img/ryujin.jpg"
              alt="Profile"
              className="w-20 h-20 lg:w-24 lg:h-24 rounded-full object-cover"
            />

            <div className="flex gap-3  ">
              <MyButton titleButton="Edit Photo" size="sm" />
              <MyButton titleButton="i" size="sm" variant="circle" />
            </div>
          </div>
        </div>
      </div>

      {/* Themes & Language */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className=" space-y-5 ">
          <div>
            <p className="font-bold">Theme</p>
            <MyButton
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </MyButton>
          </div>
        </div>
        <div className="space-y-5 ">
          <div>
            <p className="font-bold">Language</p>
          </div>
        </div>
      </div>
    </div>
  );
}
