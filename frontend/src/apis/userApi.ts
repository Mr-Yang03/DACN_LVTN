import { api } from "./axiosInstance";

export const login = async (email: string, password: string) => {
  const response = await api.post("/users/login", { email, password });
  return response.data;
};

export const register = async (
  fullname: string,
  email: string,
  password: string
) => {
  const response = await api.post("/users/register", {
    fullname,
    email,
    password,
  });
  return response.data;
};
