"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { toast } from "sonner";
import { handleError } from "@/utils/error-handler";
import { AttendanceExportDialog } from "./attendance-export-dialog";
import { AttendanceExportFormValues } from "../../schemas/export";
import { exportAttendanceData } from "../../api/export-attendance";
import { format } from "date-fns";

export function AttendanceExportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = async (values: AttendanceExportFormValues) => {
    try {
      setIsLoading(true);
      toast.info("Đang xử lý xuất dữ liệu...", {
        description: "Hệ thống đang tải dữ liệu và khởi tạo file Excel."
      });
      
      // Receive the blob from backend
      const blob = await exportAttendanceData(values);
      
      if (!blob || blob.size === 0) {
        toast.error("Không có dữ liệu để xuất");
        return;
      }
      
      // Download file directly
      const timestamp = format(new Date(), "yyyyMMdd_HHmm");
      const url = window.URL.createObjectURL(blob);
      const link = document.body.appendChild(document.createElement("a"));
      link.href = url;
      link.download = `bao_cao_cham_cong_${timestamp}.xlsx`;
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success(`Xuất dữ liệu thành công!`);
      setIsOpen(false);
    } catch (error) {
      handleError(error, "Có lỗi xảy ra khi xuất dữ liệu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        className="h-9 gap-2.5 px-5 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-xl active:scale-95 bg-primary text-white hover:bg-primary/90"
        onClick={() => setIsOpen(true)}
      >
        <FileDown size={16} />
        Xuất Excel
      </Button>

      <AttendanceExportDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        onSubmit={handleExport}
        isLoading={isLoading}
      />
    </>
  );
}
