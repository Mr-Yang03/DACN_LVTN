"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import axios from "axios";
import { useState } from "react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alert, setAlert] = useState('')

    const login = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8000/login",
                { email, password },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
        
            if (response.data.success) {
                setAlert("Login successful");
            } else {
                setAlert("Login failed");
            }
        } catch (error) {
            console.log("Login Failed:", error);
        }
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Đăng nhập</h2>
        <form onSubmit={login} method="POST" className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-black"
            >
              <i className="fas fa-envelope mr-2"></i>Email
            </label>
            <Input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Email Address"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-black"
            >
              <i className="fas fa-lock mr-2"></i>Password
            </label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Password"
              required
            />
          </div>

          <div className="flex justify-between">
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <div className="text-right">
              <a href="#" className="text-sm text-blue-500 hover:underline">
                Quên mật khẩu?
              </a>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-2 text-white bg-black rounded-lg hover:bg-black focus:outline-none"
          >
            Đăng nhập
          </Button>
        </form>

        <div className="text-center">
          <span className="text-sm text-gray-700">or login with</span>
        </div>

        <div className="flex justify-center space-x-4">
          <button className="px-4 py-2 text-white bg-blue-800 rounded-lg">
            Facebook
          </button>
          <button className="px-4 py-2 text-white bg-red-500 rounded-lg">
            Google
          </button>
        </div>

        <div className="text-center">
          <span className="text-sm text-gray-700">
            Bạn chưa có tài khoản?{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Đăng ký
            </a>
          </span>
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm my-n">
                {alert}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;