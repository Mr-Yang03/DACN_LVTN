"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

export function SiteHeader() {
  const [dropDownMenu, setDropDownMenu] = useState(false);

  return (
    <div className="bg-black text-white flex flex-col">
      <div className="bg-black text-white p-4 flex flex-row items-center justify-between relative">
        <div>
          <div className="font-bold text-xl">
            <Link href="/">TRAFFIC INTELLIGENT</Link>
          </div>
        </div>

        {/* Menu cho màn hình lớn */}
        <div className="hidden lg:flex flex-row items-center space-x-8 text-base">
          <Link href="/" className="hover:text-gray-300">Trang chủ</Link>
          <Link href="/" className="hover:text-gray-300">Bản đồ</Link>
          <Link href="/" className="hover:text-gray-300">Tin tức</Link>
          <Link href="/" className="hover:text-gray-300">Phản ánh</Link>
          <Link href="/" className="hover:text-gray-300">Thống kê</Link>
        </div>

        <div className="hidden lg:block">
          <Link href="/login">
          <button className="bg-white text-black font-bold py-2 px-4 rounded">
            Đăng nhập
          </button>
          </Link>
          
        </div>

        {/* Nút menu + dropdown cho màn hình nhỏ */}
        <div className="lg:hidden relative">
          <button onClick={() => setDropDownMenu(!dropDownMenu)}>
            <Menu color="white" />
          </button>

          
        </div>
      </div>
      {/* Dropdown menu */}
      {dropDownMenu && (
            <div className="bg-black shadow-lg px-4 pb-4 flex flex-col space-y-2 w-full lg:hidden">
              <Link href="/" className="text-white hover:text-gray-400 py-2 px-4 block">Trang chủ</Link>
              <Link href="/" className="text-white hover:text-gray-400 py-2 px-4 block">Bản đồ</Link>
              <Link href="/" className="text-white hover:text-gray-400 py-2 px-4 block">Tin tức</Link>
              <Link href="/" className="text-white hover:text-gray-400 py-2 px-4 block">Phản ánh</Link>
              <Link href="/" className="text-white hover:text-gray-400 py-2 px-4 block">Thống kê</Link>
              <Link href="/login" className="text-white hover:text-gray-400 py-2 px-4 block">Đăng nhập</Link>
            </div>
          )}
    </div>
  );
}
