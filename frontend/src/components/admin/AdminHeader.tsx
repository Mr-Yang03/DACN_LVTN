// // components/admin/AdminHeader.tsx
// export function AdminHeader() {
//     return (
//       <header className="bg-white border-b p-4 flex items-center justify-between">
//         <h1 className="text-lg font-semibold">Trang quản trị</h1>
//         {/* Optional: notifications, user info */}
//         <div className="text-sm text-gray-500">Admin | Online</div>
//       </header>
//     );
//   }
  
//@@//

"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/auth-context";

export function AdminHeader() {
  const [dropDownMenu, setDropDownMenu] = useState(false);
  const { isAuthenticated, setToken } = useAuth();

  return (
    <header className="bg-white border-b shadow z-40 sticky top-0">
      <div className="flex flex-row items-center justify-between px-4 py-3">
        <div className="text-xl font-bold">
          <Link href="/admin">ADMIN DASHBOARD</Link>
        </div>

        {/* Menu links - large screen */}
        <nav className="hidden lg:flex space-x-6 text-sm font-medium">
          <Link href="/admin" className="hover:text-gray-600">
            Dashboard
          </Link>
          <Link href="/admin/users" className="hover:text-gray-600">
            Người dùng
          </Link>
          <Link href="/admin/reports" className="hover:text-gray-600">
            Tin tức
          </Link>
          <Link href="/admin/alerts" className="hover:text-gray-600">
            Cảnh báo
          </Link>
          <Link href="/admin/profile" className="hover:text-gray-600">
            Hồ sơ
          </Link>
        </nav>

        <div className="hidden lg:block">
          {isAuthenticated ? (
            (() => {
              const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
              return (
                <div className="flex items-center space-x-2">
                  <Image
                    src="/image/default_avatar.png"
                    alt="Avatar"
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                  <span className="text-sm">{userData.fullname || "Admin"}</span>
                </div>
              );
            })()
          ) : (
            <Link href="/auth">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">
                Đăng nhập
              </button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="lg:hidden">
          <button onClick={() => setDropDownMenu(!dropDownMenu)}>
            <Menu color="black" />
          </button>
        </div>
      </div>

      {/* Dropdown menu - mobile */}
      {dropDownMenu && (
        <div className="bg-black text-white lg:hidden px-4 pb-4 space-y-2">
          <Link href="/admin" className="block py-2 hover:text-gray-400">
            Dashboard
          </Link>
          <Link href="/admin/users" className="block py-2 hover:text-gray-400">
            Người dùng
          </Link>
          <Link href="/admin/reports" className="block py-2 hover:text-gray-400">
            Báo cáo
          </Link>
          <Link href="/admin/alerts" className="block py-2 hover:text-gray-400">
            Cảnh báo
          </Link>
          <Link href="/admin/profile" className="block py-2 hover:text-gray-400">
            Hồ sơ
          </Link>
          {isAuthenticated ? (
            <button
              onClick={() => setToken(null)}
              className="block w-full text-left py-2 hover:text-red-400"
            >
              Đăng xuất
            </button>
          ) : (
            <Link href="/auth" className="block py-2 hover:text-gray-400">
              Đăng nhập
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

//@@//

// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { Menu } from "lucide-react";
// import Image from "next/image";
// import { useAuth } from "@/context/auth-context";
// import { AnimatePresence, motion } from "framer-motion";

// export function AdminHeader() {
//   const [dropDownMenu, setDropDownMenu] = useState(false);
//   const { isAuthenticated, setToken } = useAuth();

//   return (
//     <header className="bg-white border-b shadow z-40 sticky top-0">
//       <div className="flex flex-row items-center justify-between px-4 py-3">
//         <div className="text-xl font-bold">
//           <Link href="/admin">ADMIN DASHBOARD</Link>
//         </div>

//         {/* Menu links - large screen */}
//         <nav className="hidden lg:flex space-x-6 text-sm font-medium">
//           <Link href="/admin" className="hover:text-gray-600">
//             Dashboard
//           </Link>
//           <Link href="/admin/users" className="hover:text-gray-600">
//             Người dùng
//           </Link>
//           <Link href="/admin/reports" className="hover:text-gray-600">
//             Báo cáo
//           </Link>
//           <Link href="/admin/alerts" className="hover:text-gray-600">
//             Cảnh báo
//           </Link>
//           <Link href="/admin/profile" className="hover:text-gray-600">
//             Hồ sơ
//           </Link>
//         </nav>

//         <div className="hidden lg:block">
//           {isAuthenticated ? (
//             (() => {
//               const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
//               return (
//                 <div className="flex items-center space-x-2">
//                   <Image
//                     src="/image/default_avatar.png"
//                     alt="Avatar"
//                     width={36}
//                     height={36}
//                     className="rounded-full"
//                   />
//                   <span className="text-sm">{userData.fullname || "Admin"}</span>
//                 </div>
//               );
//             })()
//           ) : (
//             <Link href="/auth">
//               <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition">
//                 Đăng nhập
//               </button>
//             </Link>
//           )}
//         </div>

//         {/* Mobile toggle */}
//         <div className="lg:hidden">
//           <button onClick={() => setDropDownMenu(!dropDownMenu)}>
//             <Menu color="black" />
//           </button>
//         </div>
//       </div>

//       {/* Dropdown menu - mobile with animation */}
//       <AnimatePresence>
//         {dropDownMenu && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             transition={{ duration: 0.3 }}
//             className="bg-black text-white lg:hidden px-4 pb-4 space-y-2 overflow-hidden"
//           >
//             <Link href="/admin" className="block py-2 hover:text-gray-400">
//               Dashboard
//             </Link>
//             <Link href="/admin/users" className="block py-2 hover:text-gray-400">
//               Người dùng
//             </Link>
//             <Link href="/admin/reports" className="block py-2 hover:text-gray-400">
//               Báo cáo
//             </Link>
//             <Link href="/admin/alerts" className="block py-2 hover:text-gray-400">
//               Cảnh báo
//             </Link>
//             <Link href="/admin/profile" className="block py-2 hover:text-gray-400">
//               Hồ sơ
//             </Link>
//             {isAuthenticated ? (
//               <button
//                 onClick={() => setToken(null)}
//                 className="block w-full text-left py-2 hover:text-red-400"
//               >
//                 Đăng xuất
//               </button>
//             ) : (
//               <Link href="/auth" className="block py-2 hover:text-gray-400">
//                 Đăng nhập
//               </Link>
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </header>
//   );
// }
