export interface User {
  _id: string;
  full_name: string;
  date_of_birth?: string;  // ISO format
  phone_number?: string;
  license_number?: string;
  // email?: string;
  // role?: string;
}
