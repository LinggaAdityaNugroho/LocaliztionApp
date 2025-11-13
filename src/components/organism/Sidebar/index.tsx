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

// import {
//   Item,
//   ItemMedia,
//   ItemTitle,
//   ItemContent,
//   ItemDescription,
// } from "../../ui/item";

import { Home, FolderCog, History, UserRound } from "lucide-react";

const items = [
  {
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

export function MySidebar() {
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarContent>
            <SidebarMenuButton size={"lg"}>
              <img
                src="../../../../public/img/ryujin.jpg"
                alt=""
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex flex-col">
                <span>Lingga Aditya</span>
                <span>m@example.com</span>
              </div>
            </SidebarMenuButton>
          </SidebarContent>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
