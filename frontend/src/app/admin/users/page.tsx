"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Trash } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  post: string;
  role: string;
  bDate: string;
}

const dummyUsers: User[] = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: `Người dùng ${i + 1}`,
  email: `user${i + 1}@example.com`,
  post: `${Math.floor(Math.random() * 100)}`,
  role: i % 3 === 0 ? "Admin" : "User",
  bDate: `199${i % 10}-0${(i % 9) + 1}-15`
}));

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    setTimeout(() => {
      setUsers(dummyUsers);
    }, 500);
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDelete = (id: number) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa tài khoản này?");
    if (confirmed) {
      setUsers(prev => prev.filter(user => user.id !== id));
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle>Danh sách tài khoản người dùng</CardTitle>
          <Input
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
            }}
            className="max-w-sm"
          />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Bài đăng</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Ngày sinh</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.post}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.bDate}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Thông tin chi tiết người dùng</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2 text-sm">
                              <p><strong>Họ tên:</strong> {user.name}</p>
                              <p><strong>Email:</strong> {user.email}</p>
                              <p><strong>Bài đăng:</strong> {user.post}</p>
                              <p><strong>Vai trò:</strong> {user.role}</p>
                              <p><strong>Ngày sinh:</strong> {user.bDate}</p>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(user.id)}>
                          <Trash className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-sm text-muted">
                      Không tìm thấy người dùng phù hợp.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 space-x-4">
              <Button variant="outline" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                Trước
              </Button>
              <span className="text-sm text-muted-foreground">
                Trang {currentPage} / {totalPages}
              </span>
              <Button variant="outline" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Tiếp
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
