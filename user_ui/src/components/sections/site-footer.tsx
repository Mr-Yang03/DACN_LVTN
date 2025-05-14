import Link from "next/link"
import Image from "next/image"
import { Github } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="w-full bg-[#FFFFFF] text-black py-8 shadow-lg border-t-2 border-gray-100">
      <div className="mx-4 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column - University info */}
          <div className="space-y-4 col-span-2">
            <div className="flex items-center gap-3">
              <Image
                src="/image/hcmut.png"
                alt="Logo trường Đại học Bách Khoa"
                width={60}
                height={60}
                className=""
              />
              <div>
                <p className="text-sm">ĐẠI HỌC QUỐC GIA THÀNH PHỐ HỒ CHÍ MINH</p>
                <p className="text-xl font-bold">TRƯỜNG ĐẠI HỌC BÁCH KHOA</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="flex items-start">
                <span className="mr-2">▶</span>
                <span>
                  Cơ sở Lý Thường Kiệt: 268 Lý Thường Kiệt, Phường 14, Quận 10, TP. HCM{" "}
                  <Link href="https://maps.app.goo.gl/yurdwNWRZbZZ7DGE8" className="italic hover:underline">
                    (Bản đồ)
                  </Link>
                </span>
              </p>
              <p className="flex items-start">
                <span className="mr-2">▶</span>
                <span>
                  Cơ sở Dĩ An: Khu phố Tân Lập, Phường Đông Hòa, TP. Dĩ An, Tỉnh Bình Dương{" "}
                  <Link href="https://maps.app.goo.gl/YMnAPnoKf8fRGRg4A" className="italic hover:underline">
                    (Bản đồ)
                  </Link>
                </span>
              </p>
            </div>
          </div>

          {/* Middle column - Contact info */}
          {/* <div className="space-y-6">
            <h3 className="text-xl font-semibold">Thông tin liên hệ và hỗ trợ</h3>

            <div className="space-y-2">
              <h4 className="font-medium">Sinh viên</h4>
              <p className="flex items-center">
                <span className="mr-2">▶</span>
                <Link href="#" className="hover:underline">
                  MyBK
                </Link>
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Quý khách</h4>
              <p className="flex items-center">
                <span className="mr-2">▶</span>
                <Link href="#" className="hover:underline">
                  Email
                </Link>
              </p>
              <p className="flex items-center">
                <span className="mr-2">▶</span>
                <Link href="#" className="hover:underline">
                  Biểu mẫu thông tin liên hệ
                </Link>
              </p>
            </div>
          </div> */}

          {/* Right column - Team members, instructors, and links */}
          <div className="grid grid-row-2 gap-6">
            {/* <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Nhóm tác giả</h3>
                <ul className="space-y-1">
                  <li>Trần Bảo Phúc</li>
                  <li>Dương Phúc Thắng</li>
                  <li>Nguyễn Sinh Thành</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Giảng viên hướng dẫn</h3>
                <ul className="space-y-1">
                  <li>PGS.TS. Trần Minh Quang</li>
                  <li>ThS. Bùi Tiến Đức</li>
                </ul>
              </div>
            </div> */}

            <div className="space-y-1">
              <h3 className="text-xl font-semibold mb-4">Thông tin liên hệ</h3>
              <div className="">
                <p className="flex items-center gap-2">
                  Email:
                  <Link href="mailto:contact@example.com" className="hover:underline">
                    duongphucthang2003@gmail.com
                  </Link>
                </p>
              </div>
              <div className="">
                <p className="flex items-center gap-2">
                  GitHub:
                  <Link href="https://github.com/Mr-Yang03/DACN_LVTN" className="hover:underline flex items-center gap-1">
                    <Github size={16} />
                  </Link>
                </p>
              </div>
              <div className="">
                <p className="flex items-center gap-2">
                  Website:
                  <Link href="https://hcmut.edu.vn" className="hover:underline">
                    hcmut.edu.vn
                  </Link>
                </p>
              </div>
            </div>

            {/* <div className="space-y-4">
              <h3 className="text-xl font-semibold">LIÊN KẾT MẠNG XÃ HỘI</h3>
              <div className="flex gap-3">
                <Link href="#" className="bg-white p-2 rounded-md hover:opacity-80">
                  <Facebook className="h-6 w-6 text-[#0a2158]" />
                </Link>
                <Link href="#" className="bg-white p-2 rounded-md hover:opacity-80">
                  <Instagram className="h-6 w-6 text-[#0a2158]" />
                </Link>
                <Link href="#" className="bg-white p-2 rounded-md hover:opacity-80">
                  <Youtube className="h-6 w-6 text-[#0a2158]" />
                </Link>
                <Link href="#" className="bg-white p-2 rounded-md hover:opacity-80">
                  <Linkedin className="h-6 w-6 text-[#0a2158]" />
                </Link>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  )
}

