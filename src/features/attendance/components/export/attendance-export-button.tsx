"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { toast } from "sonner";
import { AttendanceExportDialog } from "./attendance-export-dialog";
import { AttendanceExportFormValues } from "../../schemas/export";
import { exportAttendanceData } from "../../api/export-attendance";
import { generateAttendanceExcel } from "../../utils/attendance-export-excel";
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
      
      // Fetch raw JSON data instead of a Blob
      const data = await exportAttendanceData(values);
      
      if (!data || data.length === 0) {
        toast.error("Không có dữ liệu để xuất");
        return;
      }

      // Generate Excel file on frontend
      const timestamp = format(new Date(), "yyyyMMdd_HHmm");
      await generateAttendanceExcel(data, `bao_cao_cham_cong_${timestamp}`);
      
      toast.success(`Xuất ${data.length} bản ghi thành công!`);
      setIsOpen(false);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Có lỗi xảy ra khi xuất dữ liệu");
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
