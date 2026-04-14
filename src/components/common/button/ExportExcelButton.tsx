"use client";

import { Button } from "@/components/ui/button";
import { ExcelColumn } from "@/types/common";
import ExcelJS from "exceljs";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ExportExcelButtonProps<T> {
  data: T[];
  columns: ExcelColumn<T>[];
  fileName?: string;
  sheetName?: string;
  disabled?: boolean;
}

export function ExportExcelButton<T>({
  data,
  columns,
  fileName = "export.xlsx",
  sheetName = "Sheet 1",
  disabled = false,
}: ExportExcelButtonProps<T>) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);

      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Mini HRM";
      workbook.created = new Date();

      const worksheet = workbook.addWorksheet(sheetName);

      worksheet.columns = columns.map((col) => ({
        header: col.header,
        key: col.key,
        width: col.width || 20,
      }));

      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF3B82F6" },
      };
      headerRow.alignment = { vertical: "middle", horizontal: "center" };
      headerRow.height = 25;

      headerRow.eachCell((cell) => {
        cell.border = {
          top: { style: "thin", color: { argb: "FFE2E8F0" } },
          left: { style: "thin", color: { argb: "FFE2E8F0" } },
          bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
          right: { style: "thin", color: { argb: "FFE2E8F0" } },
        };
      });

      data.forEach((row, index) => {
        const rowData: Record<string, any> = {};
        columns.forEach((col) => {
          rowData[col.key] = col.render
            ? col.render(row)
            : (row as any)[col.key];
        });
        const addedRow = worksheet.addRow(rowData);

        if (index % 2 === 1) {
          addedRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF8FAFC" },
          };
        }

        addedRow.eachCell((cell) => {
          cell.border = {
            top: { style: "thin", color: { argb: "FFE2E8F0" } },
            left: { style: "thin", color: { argb: "FFE2E8F0" } },
            bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
            right: { style: "thin", color: { argb: "FFE2E8F0" } },
          };
          cell.alignment = { vertical: "middle", wrapText: true };
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName.endsWith(".xlsx")
        ? fileName
        : `${fileName}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Xuất dữ liệu thành công");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Có lỗi xảy ra khi xuất dữ liệu");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      className="h-9 gap-2 text-xs border-dashed border-black/40 hover:bg-slate-50 transition-colors shadow-sm"
      onClick={handleExport}
      disabled={disabled || isExporting || data.length === 0}
    >
      {isExporting ? (
        <Loader2 size={14} className="animate-spin text-primary" />
      ) : (
        <Download size={14} className="text-primary" />
      )}
      Xuất Excel
    </Button>
  );
}
