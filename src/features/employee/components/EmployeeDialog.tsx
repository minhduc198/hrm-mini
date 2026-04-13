"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, UserPlus } from "lucide-react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { TextFieldInput } from "@/components/common/form/TextFieldInput";
import { TextFieldNumber } from "@/components/common/form/TextFieldNumber";

import {
  addEmployeeSchema,
  editEmployeeSchema,
  type AddEmployeeValues,
  type EditEmployeeValues,
} from "../schemas";

import type { Employee } from "../types";

const AVATAR_COLORS = [
  "bg-violet-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-teal-500",
  "bg-indigo-500",
  "bg-pink-500",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

type DialogMode = "add" | "edit";

interface EmployeeDialogProps {
  mode: DialogMode;
  employee?: Employee | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (values: any) => void;
}

export function EmployeeDialog({
  mode,
  employee,
  open,
  onOpenChange,
  onSubmit,
}: EmployeeDialogProps) {
  const isAdd = mode === "add";

  const form = useForm<AddEmployeeValues | EditEmployeeValues>({
    resolver: zodResolver(
      (isAdd ? addEmployeeSchema : editEmployeeSchema) as any,
    ) as any,
    defaultValues: isAdd
      ? {
          name: "",
          email: "",
          phone: "",
          address: "",
          password: "",
          password_confirmation: "",
        }
      : {
          name: "",
          email: "",
          phone: "",
          address: "",
          is_active: true,
        },
  });

  useEffect(() => {
    if (open) {
      if (isAdd) {
        form.reset({
          name: "",
          email: "",
          phone: "",
          address: "",
          password: "",
          password_confirmation: "",
        } as AddEmployeeValues);
      } else if (employee) {
        form.reset({
          name: employee.name || "",
          email: employee.email || "",
          phone: employee.phone || "",
          address: employee.address || "",
          is_active: employee.is_active,
        } as EditEmployeeValues);
      }
    }
  }, [open, employee, isAdd, form]);

  const handleSubmit = (values: any) => {
    onSubmit(values);
    if (isAdd) {
      form.reset();
    }
    onOpenChange(false);
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            {isAdd ? (
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <UserPlus size={15} className="text-primary" />
              </div>
            ) : employee ? (
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-semibold shrink-0",
                  AVATAR_COLORS[employee.id % AVATAR_COLORS.length],
                )}
              >
                {getInitials(employee.name)}
              </div>
            ) : null}
            <div>
              <DialogTitle asChild>
                <Typography variant="h4" className="text-[15px]">
                  {isAdd ? "Thêm nhân viên mới" : "Chỉnh sửa nhân viên"}
                </Typography>
              </DialogTitle>
              <Typography
                variant="small"
                className="text-xs mt-0.5 leading-none"
              >
                {isAdd ? (
                  "Tạo tài khoản và cung cấp thông tin đăng nhập"
                ) : (
                  <span className="font-mono">{employee?.empCode}</span>
                )}
              </Typography>
            </div>
          </div>
          <Typography variant="small" className="sr-only">
            {isAdd
              ? "Biểu mẫu để thêm một nhân viên mới vào hệ thống."
              : "Biểu mẫu để chỉnh sửa thông tin nhân viên hiện có."}
          </Typography>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 pt-1"
          >
            <TextFieldInput
              name="name"
              label="Họ và tên"
              required
              placeholder="Nguyễn Văn A"
            />

            <div className="grid grid-cols-2 gap-3">
              <TextFieldInput
                name="email"
                label="Email"
                required
                placeholder="email@hrm.vn"
              />
              <TextFieldNumber
                name="phone"
                label="Số điện thoại"
                placeholder="0901234567"
                maxLength={10}
              />
            </div>

            <TextFieldInput
              name="address"
              label="Địa chỉ"
              placeholder="123 Đường ABC, Quận 1, TP.HCM"
            />

            {isAdd && (
              <>
                <TextFieldInput
                  name="password"
                  label="Mật khẩu"
                  type="password"
                  required
                  placeholder="Tối thiểu 6 ký tự"
                />
                <TextFieldInput
                  name="password_confirmation"
                  label="Xác nhận mật khẩu"
                  type="password"
                  required
                  placeholder="Nhập lại mật khẩu"
                />
              </>
            )}

            <DialogFooter className="gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                Hủy
              </Button>
              <Button type="submit" size="sm" className="gap-1.5">
                {isAdd ? (
                  <>
                    <UserPlus size={13} />
                    Tạo tài khoản
                  </>
                ) : (
                  <>
                    <Pencil size={13} />
                    Lưu thay đổi
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
