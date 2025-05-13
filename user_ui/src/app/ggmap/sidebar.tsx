"use client";

import { X, Cctv, SquareActivity, TriangleAlert, House } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/auth-context";

export default function Sidebar({ onClose, showCamera, setShowCamera, showTraffic, setShowTraffic }: { onClose: () => void; showCamera: boolean; setShowCamera: (value: boolean) => void; showTraffic: boolean; setShowTraffic: (value: boolean) => void }) {
  const {setToken, isAuthenticated } = useAuth();
  return (
    <div className="bg-white w-80 h-full border-r border-gray-200 z-10">
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="p-4 flex flex-row items-center justify-between">
            <Link href="/" className="font-bold">
              TRAFFIC INTELLIGENT
            </Link>
            <button onClick={onClose}>
              <X className="text-blue-700" size={22}/>
            </button>
          </div>
          <hr className="border-gray-200" />

          <div className="px-4 py-2">
            <div className="flex flex-row items-center justify-between my-3 space-x-4">
              <Link
                className="flex flex-row items-center space-x-2  hover:text-blue-500"
                href={"/"}
              >
                <House className="text-blue-700" size={25} />
                <div>Quay về trang chủ</div>
              </Link>
            </div>
          </div>
          <hr className="border-gray-200" />
          <div className="px-4 py-2">
            <div className="flex flex-row items-center justify-between my-3 space-x-4">
              <div className="flex flex-row items-center space-x-2">
                <SquareActivity className="text-blue-700" size={25} />
                <div>Xem tình trạng giao thông</div>
              </div>
              <Switch className="data-[state=checked]:bg-blue-500" onClick={() => setShowTraffic(!showTraffic)} checked={showTraffic} />
            </div>
            <div className="flex flex-row items-center justify-between my-3 space-x-4">
              <div className="flex flex-row items-center space-x-2">
                <Cctv className="text-blue-700" size={25} />
                <div>Xem camera giao thông</div>
              </div>
              <Switch className="data-[state=checked]:bg-blue-500" onClick={() => setShowCamera(!showCamera)} checked={showCamera}/>
            </div>
          </div>
          <hr className="border-gray-200" />
          <div className="px-4 py-2">
            <div className="flex flex-row items-center justify-between my-3 space-x-4">
              <button className="flex flex-row items-center space-x-2 hover:text-blue-500">
                <TriangleAlert className="text-blue-700" size={25} />
                <Link href={"/feedback"}>Cảnh báo tình trạng giao thông</Link>

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
                (() => {
                  const userData = JSON.parse(
                    localStorage.getItem("user_data") || "{}"
                  );
                  return (
                    <div className="flex flex-row items-center justify-between w-full">
                      <Link href="/" className="flex flex-row items-center">
                        <Image
                          src={"/image/default_avatar.png"}
                          alt="User Avatar"
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full"
                        />
                        <span className="ml-2">{userData.fullname}</span>
                      </Link>

                      <button
                        className="text-gray-600 hover:text-blue-500"
                        onClick={() => {
                          setToken("");
                        }}
                      >
                        Đăng xuất
                      </button>
                    </div>
                  );
                })()
              ) : (
                <Link
                  href={"/auth"}
                  className="text-gray-600 hover:text-blue-500 mx-auto"
                >
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
