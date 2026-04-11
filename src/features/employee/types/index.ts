export interface Employee {
  id: number;
  empCode: string;
  name: string;
  email: string;
  role: "admin" | "employee";
  address: string;
  phone: string;
  is_active: boolean;
  created_by: number;
  created_at: string;
}
