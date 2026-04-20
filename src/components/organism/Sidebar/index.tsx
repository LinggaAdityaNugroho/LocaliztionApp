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
  SidebarProvider,
} from "../../ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu.tsx";

import { useNavigate, Link } from "react-router-dom";
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
  IconAlertTriangle,
  IconBoxSeam,
  IconFileCheck,
  IconDoorEnter,
  IconArmchair,
  IconTool,
} from "@tabler/icons-react";
import { getProfile } from "../../../services/user.service.ts";

const items = [
  { title: "Home", url: "/dashboard", icon: IconHome },
  {
    title: "Device Management",
    url: "/device-management",
    icon: IconDeviceAirtag,
    roles: ["admin"],
  },
  { title: "Map", url: "/map", icon: IconMap },
  { title: "History", url: "/history", icon: IconHistory },
  {
    title: "Class",
    url: "/class",
    icon: IconSchool,
    roles: ["mahasiswa", "dosen"],
  },

  {
    title: "Ketersediaan Alat",
    url: "/ketersediaan-alat",
    icon: IconBoxSeam,
    roles: ["admin", "staff"],
  },
  {
    title: "Persetujuan Pinjam",
    url: "/persetujuan-pinjam",
    icon: IconFileCheck,
    roles: ["admin", "staff"],
  },
  {
    title: "Riwayat Peminjaman Ruang",
    url: "/riwayat-peminjaman-ruang",
    icon: IconDoorEnter,
    roles: ["admin", "staff"],
  },
  {
    title: "Riwayat Peminjaman Alat",
    url: "/riwayat-peminjaman-alat",
    icon: IconTool,
    roles: ["admin", "staff"],
  },
  {
    title: "Laporan Kerusakan",
    url: "/laporan-kerusakan",
    icon: IconAlertTriangle,
    roles: ["admin", "staff"],
  },
  {
    title: "Peminjaman Aktif",
    url: "/peminjaman-aktif",
    icon: IconAlertTriangle,
    roles: ["admin", "mahasiswa"],
  },
  {
    title: "Pengembalian Alat",
    url: "/pengembalian-alat",
    icon: IconAlertTriangle,
    roles: ["admin", "mahasiswa"],
  },
  {
    title: "Penggunaan Ruang Lab",
    url: "/penggunaan-ruang-lab",
    icon: IconAlertTriangle,
    roles: ["admin", "mahasiswa"],
  },
  {
    title: "Riwayat Peminjaman Alat",
    url: "/riwayat-peminjaman-alat",
    icon: IconAlertTriangle,
    roles: ["admin", "mahasiswa"],
  },
  {
    title: "Riwayat Penggunaan Ruang",
    url: "/riwayat-penggunaan-ruang",
    icon: IconAlertTriangle,
    roles: ["admin", "mahasiswa"],
  },
  {
    title: "Pengajuan Pinjam Alat",
    url: "/pengajuan-pinjam-alat",
    icon: IconAlertTriangle,
    roles: ["admin", "mahasiswa"],
  },
];

export function MySidebar() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatar: "",
    role: "",
  });

  useEffect(() => {
    getProfile()
      .then((data) => setProfile(data))
      .catch((err) => console.error("Error profile:", err));
  }, []);

  const filteredItems = items.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(profile.role?.toLowerCase());
  });

  const mainItems = filteredItems.filter((i) =>
    ["Home", "Map", "History", "Class"].includes(i.title),
  );
  const adminItems = filteredItems.filter(
    (i) => !["Home", "Map", "History", "Class"].includes(i.title),
  );

  const logOut = async () => {
    localStorage.removeItem("token");
    window.location.replace("/");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200">
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="hover:bg-blue-50 transition-colors"
            >
              <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                <IconDeviceAirtag size={22} />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                <span className="truncate font-bold text-slate-800">
                  Localization App
                </span>
                <span className="truncate text-[10px] font-medium text-slate-400">
                  Management System
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Menu Utama
          </SidebarGroupLabel>
          <SidebarMenu>
            {mainItems.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className="hover:bg-slate-100 rounded-lg"
                >
                  <Link to={item.url} className="flex items-center py-2 px-3">
                    <item.icon size={20} className="text-slate-500" />
                    <span className="ml-3 font-medium text-slate-700">
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {adminItems.length > 0 && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Manajemen & Log
            </SidebarGroupLabel>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className="hover:bg-indigo-50 group rounded-lg"
                  >
                    <Link to={item.url} className="flex items-center py-2 px-3">
                      <item.icon size={20} className="text-slate-500 " />
                      <span className="ml-3 font-medium text-slate-600 ">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-slate-100 bg-slate-50/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="w-full hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all shadow-sm active:scale-95 px-2"
                >
                  {/* AVATAR: Tetap tampil karena berada di level utama SidebarMenuButton */}
                  <div className="relative flex shrink-0">
                    <img
                      src={profile.avatar || "/img/profile.png"}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                  </div>

                  <div className="grid flex-1 text-left text-sm leading-tight ml-3 group-data-[collapsible=icon]:hidden transition-all">
                    <span className="truncate font-bold text-slate-800">
                      {profile.name || "User"}
                    </span>
                    <span className="truncate text-[10px] font-medium text-slate-400  tracking-tighter ">
                      {profile.role || "No Role"}
                    </span>
                  </div>

                  <IconChevronUp className="ml-auto size-4 text-slate-400 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="right"
                align="end"
                sideOffset={12}
                className="w-64 mb-2 rounded-2xl p-2 shadow-2xl border-slate-200"
              >
                <DropdownMenuLabel className="font-normal px-4 py-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold text-slate-800">
                      {profile.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate("/settings")}
                  className="rounded-lg cursor-pointer py-2 px-4 hover:bg-slate-50"
                >
                  <IconUser className="mr-3 h-4 w-4 text-slate-500" />
                  <span className="font-medium">Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logOut}
                  className="rounded-lg cursor-pointer py-2 px-4 text-red-600 focus:bg-red-50 focus:text-red-700 transition-colors"
                >
                  <span className="font-bold text-sm tracking-widest">
                    LogOut
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
