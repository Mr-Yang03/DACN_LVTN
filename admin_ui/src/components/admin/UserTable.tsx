"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound, Trash2, ArrowUpDown } from "lucide-react";
import { getUsers, deleteUser } from "@/apis/userboardApi";
import { countFeedbackByUsers } from "@/apis/feedbackApi";
import { User } from "@/types/userboard";
import EditUserForm from "./EditUserForm";

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchUsername, setSearchUsername] = useState("");
  const [sortField, setSortField] = useState<
    "username" | "full_name" | "phone_number" | null
  >(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [feedbackCounts, setFeedbackCounts] = useState<Record<string, number>>(
    {}
  );
  const pageSize = 5;

  const fetchData = async () => {
    try {
      const res = await getUsers();
      const usersData: User[] = Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      // 🟩 Gán vào bảng
      setUsers(usersData);

      // 🟦 Tạo danh sách riêng chỉ phục vụ cho API feedback
      const accountPairs = usersData
        .filter((u) => u.username && u.account_id)
        .map((u) => ({
          account_id: u.account_id,
          username: u.username as string,
        }));

      if (accountPairs.length === 0) {
        console.warn("Không có account hợp lệ để gửi count.");
        return;
      }

      // 🔁 Gọi API đếm
      const countRes = await countFeedbackByUsers(accountPairs);
      if (countRes?.data && typeof countRes.data === "object") {
        setFeedbackCounts(countRes.data);
      } else {
        console.warn("Response feedback không hợp lệ:", countRes);
      }
    } catch (err) {
      console.error("Lỗi khi fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchName, searchPhone, searchUsername]);

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc muốn xoá người dùng này?")) {
      await deleteUser(id);
      fetchData();
    }
  };
  const toggleSort = (field: "username" | "full_name" | "phone_number") => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredSortedUsers = users
    .filter((user) => {
      const name = (user.full_name || "").toLowerCase();
      const phone = (user.phone_number || "").toLowerCase();
      const username = (user.username || "").toLowerCase();
      return (
        name.includes(searchName.toLowerCase()) &&
        phone.includes(searchPhone.toLowerCase()) &&
        username.includes(searchUsername.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      const aVal = a[sortField] || "";
      const bVal = b[sortField] || "";
      return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

  const totalPages = Math.ceil(filteredSortedUsers.length / pageSize);
  const paginatedUsers = filteredSortedUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      <Card className="shadow-md border">
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-2 mb-4">
            <Input
              placeholder="Tìm theo username..."
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              className="max-w-sm"
            />
            <Input
              placeholder="Tìm theo họ tên..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="max-w-sm"
            />
            <Input
              placeholder="Tìm theo số điện thoại..."
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="text-center cursor-pointer"
                  style={{ width: "15%" }}
                  onClick={() => toggleSort("username")}
                >
                  Username <ArrowUpDown className="inline w-4 h-4 ml-1" />
                </TableHead>
                <TableHead
                  className="text-center cursor-pointer"
                  style={{ width: "15%" }}
                  onClick={() => toggleSort("full_name")}
                >
                  Họ tên <ArrowUpDown className="inline w-4 h-4 ml-1" />
                </TableHead>
                <TableHead className="text-center" style={{ width: "15%" }}>
                  Ngày sinh
                </TableHead>
                <TableHead
                  className="text-center cursor-pointer"
                  style={{ width: "15%" }}
                  onClick={() => toggleSort("phone_number")}
                >
                  SĐT <ArrowUpDown className="inline w-4 h-4 ml-1" />
                </TableHead>
                <TableHead className="text-center" style={{ width: "15%" }}>
                  Số GPLX
                </TableHead>
                <TableHead className="text-center" style={{ width: "10%" }}>
                  Phản ánh
                </TableHead>
                <TableHead
                  className="text-center"
                  style={{ width: "15%" }}
                ></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="text-center">
                    {user.username || ""}
                  </TableCell>
                  <TableCell className="text-center">
                    {user.full_name}
                  </TableCell>
                  <TableCell className="text-center">
                    {user.date_of_birth
                      ? new Date(user.date_of_birth).toLocaleDateString("vi-VN")
                      : ""}
                  </TableCell>
                  <TableCell className="text-center">
                    {user.phone_number || ""}
                  </TableCell>
                  <TableCell className="text-center">
                    {user.license_number || ""}
                  </TableCell>
                  <TableCell className="text-center">
                    {" "}
                    {feedbackCounts?.[user.account_id] ?? "Chưa có"}
                  </TableCell>
                  <TableCell className="text-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setEditingUser(user)}
                      title="Đặt lại mật khẩu"
                    >
                      <KeyRound size={16} />
                    </Button>
                    {/* <Button variant="outline" className="text-red-600" onClick={() => handleDelete(user._id)}>
                      <Trash2 size={16} />
                    </Button> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {loading && (
            <p className="mt-4 text-center text-muted">Đang tải...</p>
          )}
          {!loading && paginatedUsers.length === 0 && (
            <p className="mt-4 text-center text-muted">
              Không có người dùng phù hợp.
            </p>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 space-x-4">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Trước
              </Button>
              <span className="text-sm text-muted-foreground">
                Trang {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Tiếp
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <EditUserForm
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onUpdated={fetchData}
      />
    </>
  );
};

export default UserTable;
