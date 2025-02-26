"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
// import { useRouter } from 'next/navigation';

export default function Page() {
  const { token, setToken, isAuthenticated } = useAuth();
  // const router = useRouter();

  useEffect(() => {
    setToken("hihi");
  }, [setToken]); // Chạy 1 lần sau khi component mount

  return (
    <div className="flex items-center justify-center min-h-screen">
      {isAuthenticated ? (
        <h1 className="text-2xl font-bold">Chào mừng {token}</h1>
      ) : (
        <h1 className="text-2xl font-bold text-red-500">Bạn chưa đăng nhập!</h1>
      )}
    </div>
  );
}
