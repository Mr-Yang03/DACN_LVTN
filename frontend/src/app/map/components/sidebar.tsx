"use client";

import { X, Cctv, SquareActivity, TriangleAlert, House } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/auth-context";

export default function Sidebar({ onClose }: { onClose: () => void }) {
  const { token, setToken, isAuthenticated } = useAuth();
  return (
    <div className="bg-white w-80 h-full border-r border-gray-200 fixed top-0 left-0 z-10">
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="p-4 flex flex-row items-center justify-between">
            <Link href="/" className="font-bold">
              TRAFFIC INTELLIGENT
            </Link>
            <button onClick={onClose}>
              <X size={22} />
            </button>
          </div>
          <hr className="border-gray-200" />

          <div className="px-4 py-2">
            <div className="flex flex-row items-center justify-between my-3 space-x-4">
              <Link className="flex flex-row items-center space-x-2  hover:text-blue-500" href={"/"}>
                <House size={25} />
                <div>Quay về trang chủ</div>
              </Link>
            </div>
          </div>
          <hr className="border-gray-200" />
          <div className="px-4 py-2">
            <div className="flex flex-row items-center justify-between my-3 space-x-4">
              <div className="flex flex-row items-center space-x-2">
                <SquareActivity size={25} />
                <div className="text-gray-600">Xem tình trạng giao thông</div>
              </div>
              <Switch className="data-[state=checked]:bg-blue-500" />
            </div>
            <div className="flex flex-row items-center justify-between my-3 space-x-4">
              <div className="flex flex-row items-center space-x-2">
                <Cctv size={25} />
                <div className="text-gray-600">Xem camera giao thông</div>
              </div>
              <Switch className="data-[state=checked]:bg-blue-500" />
            </div>
          </div>
          <hr className="border-gray-200" />
          <div className="px-4 py-2">
            <div className="flex flex-row items-center justify-between my-3 space-x-4">
              <button className="flex flex-row items-center space-x-2 hover:text-blue-500">
                <TriangleAlert size={25} />
                <div>
                  Cảnh báo tình trạng giao thông
                </div>
              </button>
            </div>
          </div>
          <hr className="border-gray-200" />
        </div>
        <div>
          <hr className="border-gray-200" />
          <div className="p-4">
            <div className="flex items-center justify-between">
              {isAuthenticated ? (
                <>
                  <Link href='/' className="flex flex-row items-center">
                    <Image
                      src={"/default-avatar.png"}
                      alt="User Avatar"
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full"
                    />
                    <span className="ml-2 text-gray-600">{token}</span>
                  </Link>
                  <button className="text-gray-600 hover:text-blue-500" onClick={() => {setToken("");}}>
                    Đăng xuất
                  </button>
                </>
              ) : (
                <Link href={"/login"} className="text-gray-600 hover:text-blue-500 mx-auto">
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
