
"use client";

import React, { useState, useEffect } from "react";
import {
  Card, CardHeader, CardTitle, CardContent
} from "@/components/ui/card";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ArrowUpDown } from "lucide-react";
import { getUsers, deleteUser } from "@/apis/userboardApi";
import { User } from "@/types/userboard";
import EditUserForm from "./EditUserForm";

interface Props {
  onEditUser: (user: User) => void;
}

const UserTable: React.FC<Props> = ({ onEditUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [sortField, setSortField] = useState<"full_name" | "phone_number" | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const pageSize = 5;

  const fetchData = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchName, searchPhone]);

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc muốn xoá người dùng này?")) {
      await deleteUser(id);
      fetchData();
    }
  };

  const toggleSort = (field: "full_name" | "phone_number") => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredSortedUsers = users
    .filter((user) =>
      (user.full_name?.toLowerCase() || "").includes(searchName.toLowerCase()) &&
      (user.phone_number?.toLowerCase() || "").includes(searchPhone.toLowerCase())
    )
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
                <TableHead className="text-center py-2 px-4 border-b text-center cursor-pointer" style={{ width: "20%" }} onClick={() => toggleSort("full_name")}>Họ tên <ArrowUpDown className="inline w-4 h-4 ml-1" /></TableHead>
                <TableHead className="text-center py-2 px-4 border-b text-center" style={{ width: "20%" }}>Ngày sinh</TableHead>
                <TableHead className="text-center py-2 px-4 border-b text-center cursor-pointer" style={{ width: "20%" }} onClick={() => toggleSort("phone_number")}>SĐT <ArrowUpDown className="inline w-4 h-4 ml-1" /></TableHead>
                <TableHead className="text-center py-2 px-4 border-b text-center" style={{ width: "20%" }}>Số GPLX</TableHead>
                <TableHead className="text-center py-2 px-4 border-b text-center" style={{ width: "20%" }}> </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="text-center py-2 px-4 border-b text-center" style={{ width: "20%" }}>{user.full_name}</TableCell>
                  <TableCell className="text-center py-2 px-4 border-b text-center" style={{ width: "20%" }}>{user.date_of_birth
                    ? new Date(user.date_of_birth).toLocaleDateString("vi-VN")
                    : ""}</TableCell>
                  <TableCell className="text-center py-2 px-4 border-b text-center" style={{ width: "20%" }}>{user.phone_number || ""}</TableCell>
                  <TableCell className="text-center py-2 px-4 border-b text-center" style={{ width: "20%" }}>{user.license_number || ""}</TableCell>
                  <TableCell className="text-center py-2 px-4 border-b text-center" style={{ width: "20%" }}>
                    <Button variant="outline" onClick={() => setEditingUser(user)}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="outline" className="text-red-600" onClick={() => handleDelete(user._id)}>
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {loading && <p className="mt-4 text-center text-muted">Đang tải...</p>}
          {!loading && paginatedUsers.length === 0 && (
            <p className="mt-4 text-center text-muted">Không có người dùng phù hợp.</p>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 space-x-4">
              <Button variant="outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                Trước
              </Button>
              <span className="text-sm text-muted-foreground">
                Trang {currentPage} / {totalPages}
              </span>
              <Button variant="outline" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
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
