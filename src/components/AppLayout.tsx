import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Clock, Users, TrendingUp, Plus, Menu } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { QuickAddDialog } from "@/components/QuickAddDialog";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Timeline", icon: Clock, path: "/timeline" },
  { label: "Growth Charts", icon: TrendingUp, path: "/growth" },
];

const KIDS_NAV = [
  { label: "Nirek", initial: "N", path: "/kids/nirek", color: "#E8913A" },
  { label: "Mishka", initial: "M", path: "/kids/mishka", color: "#8B6BAE" },
];

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <button onClick={() => navigate("/")} className="text-left">
            <h3 className="text-lg leading-tight" style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 700 }}>
              Kid Chronicle
            </h3>
            <p className="text-xs text-[#6B5B4F] mt-0.5 uppercase tracking-widest">Growth Tracker</p>
          </button>
          <Separator className="mt-3" />
          {/* Kid avatar switcher */}
          <div className="flex items-center gap-3 mt-3">
            {KIDS_NAV.map(kid => {
              const isActive = location.pathname === kid.path;
              return (
                <button
                  key={kid.label}
                  onClick={() => navigate(kid.path)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-200"
                    style={{
                      backgroundColor: kid.color,
                      fontFamily: "'Fraunces', Georgia, serif",
                      fontWeight: 700,
                      fontSize: "18px",
                      boxShadow: isActive ? `0 0 0 3px #FAF4ED, 0 0 0 6px ${kid.color}` : "none",
                    }}
                  >
                    {kid.initial}
                  </div>
                  <span className="text-xs font-medium text-[#3B2F2F]">{kid.label}</span>
                </button>
              );
            })}
          </div>
        </SidebarHeader>
        <SidebarContent>
          <ScrollArea className="flex-1">
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {NAV_ITEMS.map(item => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        isActive={location.pathname === item.path}
                        onClick={() => navigate(item.path)}
                        tooltip={item.label}
                      >
                        <item.icon className="size-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Kids</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => navigate("/kids/nirek")}
                      isActive={location.pathname === "/kids/nirek"}
                    >
                      <Users className="size-4" />
                      <span>Nirek</span>
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton onClick={() => navigate("/kids/nirek?tab=education")}>
                          Education
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton onClick={() => navigate("/kids/nirek?tab=activities")}>
                          Activities
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton onClick={() => navigate("/kids/nirek?tab=growth")}>
                          Growth
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => navigate("/kids/mishka")}
                      isActive={location.pathname === "/kids/mishka"}
                    >
                      <Users className="size-4" />
                      <span>Mishka</span>
                    </SidebarMenuButton>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton onClick={() => navigate("/kids/mishka?tab=education")}>
                          Education
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton onClick={() => navigate("/kids/mishka?tab=activities")}>
                          Activities
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton onClick={() => navigate("/kids/mishka?tab=growth")}>
                          Growth
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </ScrollArea>
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="bg-[#FAF4ED]">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-6 py-3 border-b border-[#3B2F2F1F]">
          <SidebarTrigger>
            <Menu className="size-4" />
          </SidebarTrigger>
        </header>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>

        {/* Floating quick-add button */}
        <Button
          onClick={() => setQuickAddOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50 bg-[#E8913A] hover:bg-[#d4822e] text-white"
          size="icon"
          aria-label="Quick add"
        >
          <Plus className="size-6" />
        </Button>

        <QuickAddDialog open={quickAddOpen} onOpenChange={setQuickAddOpen} />
      </SidebarInset>
    </SidebarProvider>
  );
}
