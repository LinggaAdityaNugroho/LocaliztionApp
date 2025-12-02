import { useEffect, useState } from "react";

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

// import {
//   Item,
//   ItemMedia,
//   ItemTitle,
//   ItemContent,
//   ItemDescription,
// } from "../../ui/item";

import { Home, FolderCog, History, UserRound } from "lucide-react";
import { getProfile } from "../../../services/user.service.ts";
const items = [
  {
    titleGroup: "Application",
    title: "Home",
    url: "/#",
    icon: Home,
  },
  {
    title: "Device Management",
    url: "/#",
    icon: FolderCog,
  },
  {
    title: "History",
    url: "/#",
    icon: History,
  },
];

function profilePage() {
  const [profile, setProfile] = useState({ username: "", email: "" });

  useEffect(() => {
    getProfile()
      .then((data) => setProfile(data))
      .catch((err) => console.error(err));
  }, []);

  return profile;
}

export function MySidebar() {
  const profile = profilePage();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <UserRound />
              <span>Localization App</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <p>Application</p>
          </SidebarGroupLabel>
          <SidebarContent className="pt-2">
            {items.map((item) => (
              <a href={item.url} className="font-black">
                <SidebarMenuButton>
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </a>
            ))}
          </SidebarContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="my-4">
        <SidebarMenu>
          <SidebarContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size={"lg"}>
                  <img
                    src="../../../../public/img/ryujin.jpg"
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex flex-col">
                    <span>{profile.username || "username"} </span>
                    <span>{profile.email || "email"}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarContent>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
