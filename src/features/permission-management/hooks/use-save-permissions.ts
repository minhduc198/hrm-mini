import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface SavePermissionsInput {
  employeeIds: string[];
  permissions: string[];
}

export function useSavePermissions() {
  return useMutation({
    mutationFn: async (input: SavePermissionsInput) => {
      // TODO: Replace with actual API call
      // const response = await axios.post("/permissions/assign", input);
      // return response.data;

      // Mock implementation
      await new Promise((resolve) => setTimeout(resolve, 500));
      return input;
    },
    onSuccess: (_, variables) => {
      toast.success(
        `Đã lưu phân quyền cho ${variables.employeeIds.length} nhân viên`
      );
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message ?? "Có lỗi xảy ra khi lưu phân quyền");
    },
  });
}
