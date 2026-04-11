import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { employeeKeys } from "../query-key/employees.query-key";
import {
  createEmployee,
  getListEmployee,
  updateEmployee,
} from "../services";
import { GetListEmployeeParams } from "../types";

export const useEmployees = (params: GetListEmployeeParams) => {
  return useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: () => getListEmployee(params),
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEmployee,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(data.id) });
    },
  });
};
