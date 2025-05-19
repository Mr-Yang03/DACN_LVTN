
import { api } from "./axiosInstance";

const PREFIX = "/userboard/ub";

export const getUsers = () => api.get(PREFIX);

export const getUser = (id: string) => api.get(`${PREFIX}/${id}`);

export const createUser = (user: {
  full_name: string;
  date_of_birth: string;
  phone_number: string;
  license_number: string;
  account_id?: string;
}) => api.post(PREFIX, user);

export const updateUser = (id: string, user: {
  full_name: string;
  date_of_birth: string;
  phone_number: string;
  license_number: string;
  account_id?: string;
}) => api.put(`${PREFIX}/${id}`, user);

export const deleteUser = (id: string) => api.delete(`${PREFIX}/${id}`);

export const resetPassword = (accountId: string, new_password: string) =>
  api.put(`/userboard/ub/reset-password/${accountId}`, {
    new_password,
  });
