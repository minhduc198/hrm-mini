import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { toast } from "sonner";
import { permissionKeys } from "../queryKeys/permission";
import { savePermissions } from "@/features/permission-management/api/save-permissions";
import { PermissionAssignPayload } from "@/features/permission-management/types/permission";

export function useSavePermissions() {

  return useMutation({
    mutationFn: (payload: PermissionAssignPayload[]) => savePermissions(payload),
    onSuccess: () => {
      toast.success("Đã lưu phân quyền thành công");
      queryClient.invalidateQueries({ queryKey: permissionKeys.lists() });
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message ?? "Có lỗi xảy ra khi lưu phân quyền");
    },
  });
}
