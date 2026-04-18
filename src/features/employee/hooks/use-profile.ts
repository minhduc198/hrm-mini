import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { handleError } from "@/utils/error-handler";
import { employeeKeys } from "../query-key/employees.query-key";
import { changePassword, getEmployeeById, updateProfile } from "../services";

export function useProfile(userId?: string | number) {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: employeeKeys.detail(userId!),
    queryFn: () => getEmployeeById(userId as number | string),
    enabled: !!userId,
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Cập nhật hồ sơ thành công");
      if (userId) {
        queryClient.invalidateQueries({ queryKey: employeeKeys.detail(userId) });
      }
    },
    onError: (err) => {
      handleError(err, "Không thể cập nhật hồ sơ");
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Thay đổi mật khẩu thành công");
    },
    onError: (err) => {
      handleError(err, "Không thể thay đổi mật khẩu");
    },
  });

  return {
    profileQuery,
    updateProfile: updateProfileMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
  };
}
