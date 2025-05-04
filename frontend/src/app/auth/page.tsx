"use client";

import { useState, useEffect } from "react";
import LoginForm from "@/app/auth/LoginForm";
import RegisterForm from "@/app/auth/RegisterForm";
import { Car, Building2, Bus, Truck, Bike, Plane } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";

// Component icon
function IconCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-5 bg-white rounded-2xl shadow-md transform hover:scale-105 transition-transform duration-300 group">
      {children}
    </div>
  );
}

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("isAuthenticated", isAuthenticated);
    if (isAuthenticated) {
      router.back();
    }
  }, [isAuthenticated]);

  const icons = [
    <Car
      key="car"
      className="h-14 w-14 text-blue-600 group-hover:text-blue-700 transition-colors duration-300"
    />,
    <Building2
      key="building"
      className="h-14 w-14 text-slate-600 group-hover:text-slate-700 transition-colors duration-300"
    />,
    <Bus
      key="bus"
      className="h-14 w-14 text-red-700 group-hover:text-red-800 transition-colors duration-300"
    />,
    <Truck
      key="truck"
      className="h-14 w-14 text-yellow-700 group-hover:text-yellow-800 transition-colors duration-300"
    />,
    <Bike
      key="bike"
      className="h-14 w-14 text-green-600 group-hover:text-green-700 transition-colors duration-300"
    />,
    <Plane
      key="plane"
      className="h-14 w-14 text-indigo-600 group-hover:text-indigo-700 transition-colors duration-300"
    />,
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-10 place-items-center relative">
        <div className="hidden lg:flex flex-col items-center justify-center space-y-8 p-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Hệ Thống Giao Thông
          </h1>
          <div className="flex flex-wrap justify-center gap-6 w-full p-8 bg-gradient-to-br from-blue-500/5 to-slate-500/5 rounded-3xl backdrop-blur-sm border border-white/20 shadow-lg">
            {icons.map((icon, idx) => (
              <IconCard key={idx}>{icon}</IconCard>
            ))}
          </div>
          <p className="text-slate-600 max-w-xs mx-auto font-light text-center">
            Hãy đăng nhập hoặc đăng ký để truy cập hệ thống giao thông thông
            minh đô thị
          </p>
        </div>
        <div className="w-full md:max-w-[70vw]">
          {activeTab === "login" ? (
            <LoginForm onSwitchTab={() => setActiveTab("register")} />
          ) : (
            <RegisterForm onSwitchTab={() => setActiveTab("login")} />
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}
