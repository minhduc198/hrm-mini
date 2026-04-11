import { Role } from "@/features/auth/types/auth";

export interface Employee {
  id: number;
  empCode: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: Role;
  is_active: boolean;
  avatar_url: string | null;
  created_by: {
    id: number;
    name: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
  links: {
    url: string | null;
    label: string;
    active: boolean;
    page: number | null;
  }[];
  path: string;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export type GetListEmployeeParams = {
  page?: number;
  per_page?: number;
  email?: string;
  name?: string;
  role?: Role;
  is_active?: boolean;
};

export type CreateEmployeePayload = {
  empCode: string;
  name: string;
  email: string;
  role: Role;
  address: string;
  phone: string;
  is_active?: boolean;
};

export type UpdateEmployeePayload = {
  id: number;
  empCode?: string;
  name?: string;
  email?: string;
  role?: Role;
  address?: string;
  phone?: string;
  is_active?: boolean;
};
