import api from "@/lib/axios";
import {
  CreateEmployeePayload,
  Employee,
  GetListEmployeeParams,
  UpdateEmployeePayload,
} from "../types";
import { PaginatedResponse } from "@/types/common";

export const getListEmployee = async (
  params: GetListEmployeeParams,
): Promise<PaginatedResponse<Employee>> => {
  const res = await api.get("/employees", {
    params,
  });
  return res.data;
};

export const createEmployee = async (
  data: CreateEmployeePayload,
): Promise<Employee> => {
  const res = await api.post("/employees", data);
  return res.data;
};

export const updateEmployee = async (
  data: UpdateEmployeePayload,
): Promise<Employee> => {
  const { id, ...rest } = data;

  const res = await api.put(`/employees/${id}`, rest);
  return res.data;
};
export const updateEmployeeStatus = async (id: number): Promise<Employee> => {
  const res = await api.patch(`/employees/${id}/status`);
  return res.data;
};
