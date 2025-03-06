"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

export function SiteHeader() {
  const [dropDownMenu, setDropDownMenu] = useState(false);

  return (
    <div className="flex flex-col sticky top-0 left-0 w-full z-50">
      <div className="bg-white text-black p-4 flex flex-row items-center justify-between relative shadow">
        <div>
          <div className="font-bold text-xl">
            <Link href="/">TRAFFIC INTELLIGENT</Link>
          </div>
        </div>

        {/* Menu cho màn hình lớn */}
        <div className="hidden lg:flex flex-row items-center space-x-8 text-base">
          <Link href="/" className="hover:text-gray-600">
            Trang chủ
          </Link>
          <Link href="/map" className="hover:text-gray-600">
            Bản đồ
          </Link>
          <Link href="/" className="hover:text-gray-600">
            Tin tức
          </Link>
          <Link href="/" className="hover:text-gray-600">
            Phản ánh
          </Link>
          <Link href="/" className="hover:text-gray-600">
            Thống kê
          </Link>
        </div>

        <div className="hidden lg:block">
          <Link href="/login">
            <button className="bg-[#4285F4] text-white py-2 px-4 rounded-full hover:bg-blue-700 transition">
              Đăng nhập
            </button>
          </Link>
        </div>

        {/* Nút menu + dropdown cho màn hình nhỏ */}
        <div className="lg:hidden relative">
          <button onClick={() => setDropDownMenu(!dropDownMenu)}>
            <Menu color="black" />
          </button>
        </div>
      </div>
      {/* Dropdown menu */}
      {dropDownMenu && (
        <div className="bg-black shadow-lg px-4 pb-4 flex flex-col space-y-2 w-full lg:hidden">
          <Link
            href="/"
            className="text-white hover:text-gray-400 py-2 px-4 block"
          >
            Trang chủ
          </Link>
          <Link
            href="/"
            className="text-white hover:text-gray-400 py-2 px-4 block"
          >
            Bản đồ
          </Link>
          <Link
            href="/"
            className="text-white hover:text-gray-400 py-2 px-4 block"
          >
            Tin tức
          </Link>
          <Link
            href="/"
            className="text-white hover:text-gray-400 py-2 px-4 block"
          >
            Phản ánh
          </Link>
          <Link
            href="/"
            className="text-white hover:text-gray-400 py-2 px-4 block"
          >
            Thống kê
          </Link>
          <Link
            href="/login"
            className="text-white hover:text-gray-400 py-2 px-4 block"
          >
            Đăng nhập
          </Link>
        </div>
      )}
    </div>
  );
}
