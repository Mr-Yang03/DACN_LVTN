"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  Newspaper,
  MessageSquare,
  Activity,
  Video,
  Bot,
  User,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, setToken } = useAuth();
  const pathname = usePathname();
  // Hàm toggle sidebar
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/admin/dashboard" },
    { icon: <Users size={20} />, label: "Người dùng", href: "/admin/users" },
    { icon: <Newspaper size={20} />, label: "Tin tức", href: "/admin/news" },
    {
      icon: <MessageSquare size={20} />,
      label: "Phản ánh",
      href: "/admin/feedback",
    },
    { icon: <Activity size={20} />, label: "Giám sát", href: "/admin/monitor" },
    { icon: <Video size={20} />, label: "Camera", href: "/admin/cameras" },
    { icon: <Bot size={20} />, label: "Chatbot", href: "/admin/chatbot" },
    { icon: <User size={20} />, label: "Hồ sơ", href: "/admin/profile" },
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };
  return (
    <>
      {/* Desktop Sidebar */}{" "}
      <div
        className={`hidden lg:flex z-30 flex-col h-screen bg-white border-r shadow ${
          isCollapsed ? "w-20" : "w-72"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {!isCollapsed && (
            <Link href="/admin" className="text-xl font-bold">
              ADMIN DASHBOARD
            </Link>
          )}
          <button
            onClick={toggleSidebar}
            className={`p-1 ml-2 rounded-md hover:bg-gray-200 ${
              isCollapsed ? "mx-auto" : ""
            }`}
            aria-label={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-3 rounded-md transition-colors ${
                  isActive(item.href)
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>

        {/* User Profile Section */}
        <div
          className={`p-4 border-t ${
            isCollapsed ? "items-center justify-center" : ""
          }`}
        >
          {isAuthenticated ? (
            <div
              className={`flex ${
                isCollapsed ? "justify-center" : "items-center space-x-2"
              }`}
            >
              <Image
                src="/image/default_avatar.png"
                alt="Avatar"
                width={36}
                height={36}
                className="rounded-full"
              />
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {(() => {
                      try {
                        const userData = JSON.parse(
                          localStorage.getItem("user_data") || "{}"
                        );
                        return userData.fullname || "Admin";
                      } catch (e) {
                        return "Admin";
                      }
                    })()}
                  </span>
                  <button
                    onClick={() => setToken("")}
                    className="text-xs text-red-500 hover:text-red-600 text-left"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={`${isCollapsed ? "flex justify-center" : ""}`}>
              <Link href="/auth">
                <button className="w-full bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition text-sm">
                  {isCollapsed ? "Login" : "Đăng nhập"}
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>      {/* Mobile Sidebar */}
      <div className="lg:hidden relative">
        <div className="sticky top-0 left-0 p-4 flex items-center justify-between border-b bg-white z-10">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md hover:bg-gray-200"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          <Link href="/admin" className="text-xl font-bold mx-auto">
            ADMIN
          </Link>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        {/* Mobile Menu Content */}
        <div
          className={`fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/admin" className="text-xl font-bold">
              ADMIN
            </Link>
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <div className="overflow-y-auto py-4">
            <nav className="space-y-1 px-3">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-3 rounded-md transition-colors ${
                    isActive(item.href)
                      ? "bg-blue-100 text-blue-600"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* User Profile Section */}
          <div className="p-4 border-t mt-auto">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Image
                  src="/image/default_avatar.png"
                  alt="Avatar"
                  width={36}
                  height={36}
                  className="rounded-full"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {(() => {
                      try {
                        const userData = JSON.parse(
                          localStorage.getItem("user_data") || "{}"
                        );
                        return userData.fullname || "Admin";
                      } catch (e) {
                        return "Admin";
                      }
                    })()}
                  </span>
                  <button
                    onClick={() => setToken("")}
                    className="text-xs text-red-500 hover:text-red-600 text-left"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/auth">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full">
                  Đăng nhập
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

