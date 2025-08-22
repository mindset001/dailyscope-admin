"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { usePathname } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, Users, Newspaper, Settings, Mail, ChevronDown, Bell, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import NotificationBell from "../components/NotificationBell";
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { admin, logout } = useAuth();
  console.log("Admin:", admin);

   const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="fixed top-4 left-4">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-4">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 border-r bg-white p-4">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b h-16 flex items-center justify-between px-6">
      {/* Left side - Logo/Branding */}
      <div className="flex items-center gap-2">
        <h1 className="font-bold text-xl">TheDailyScope</h1>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      {/* Right side - User controls */}
      <div className="flex items-center gap-4">
          <NotificationBell />
        
        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/adam.jpg" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <span className="font-medium">{admin?.role}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600"  onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarContent() {
      const pathname = usePathname();
    const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Users management", icon: Users, href: "/dashboard/management" },
    { name: "Article management", icon: Newspaper, href: "/dashboard/articles" },
    { name: "Platform settings", icon: Settings, href: "/dashboard/settings" },
    { name: "Notification", icon: Mail, href: "/dashboard/notification" },
  ];

  return (
<nav className="space-y-1 px-2 py-4 flex flex-col gap-2">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link href={item.href} key={item.name}>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 text-[16px] ${
                isActive
                  ? 'bg-[#000] text-[#fff] font-semibold'
                  : 'text-gray-700 hover:bg-[#000] hover:text-[#fff]'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}