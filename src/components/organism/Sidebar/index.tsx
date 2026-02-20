import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
} from "../../ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu.tsx";

import { useNavigate, Link } from "react-router-dom"; // Gunakan Link agar tidak refresh halaman
import { useEffect, useState } from "react";
import {
  IconMap,
  IconHome,
  IconDeviceAirtag,
  IconUser,
  IconHistory,
  IconFolder,
  IconChevronUp,
  IconSchool,
} from "@tabler/icons-react";
import api from "../../../services/api.ts";
import { getProfile } from "../../../services/user.service.ts";

const items = [
  { title: "Home", url: "/dashboard", icon: IconHome },
  {
    title: "Device Management",
    url: "/device-management",
    icon: IconDeviceAirtag,
  },
  { title: "Map", url: "/map", icon: IconMap },
  { title: "History", url: "/history", icon: IconHistory },
  {
    title: "Class",
    url: "/class",
    icon: IconSchool,
  },
  {
    title: "Manajemen Inventory",
    url: "/manajemen-inventory",
    icon: IconFolder,
  },
];

export function MySidebar() {
  const navigate = useNavigate();
  // Gabungkan state profile
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    getProfile()
      .then((data) => setProfile(data))
      .catch((err) => console.error("Error profile:", err));
  }, []);

  const logOut = async () => {
    const token = localStorage.getItem("token");
    try {
      await api.post(
        "/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (error) {
      console.log(error);
    }
    localStorage.removeItem("token");
    window.location.replace("/");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" onClick={() => navigate("/dashboard")}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <IconDeviceAirtag size={20} />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Localization App</span>
                <span className="truncate text-xs">v1.0.0</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link to={item.url}>
                    <item.icon size={20} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  {/* Perbaikan: Ukuran avatar disesuaikan untuk Sidebar */}
                  <img
                    src={profile.avatar || "/img/profile.png"} // Path profile diperbaiki
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {profile.name || "User"}
                    </span>
                    <span className="truncate text-xs text-slate-500">
                      {profile.email || "email@example.com"}
                    </span>
                  </div>
                  <IconChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top" // Sidebar footer biasanya buka ke atas
                className="w-[--radix-popper-anchor-width] min-w-56 rounded-lg"
                align="start"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile.username}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {profile.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <IconUser className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logOut}
                  className="text-red-600 focus:text-red-600"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
