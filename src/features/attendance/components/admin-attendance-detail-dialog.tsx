import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AttendanceDayData } from "../types/attendance";
import { useGetAttendanceRecords } from "../hooks/use-get-attendance-records";
import { useDebounce } from "@/hooks/use-debounce";
import { useNumberParam, useParam } from "@/hooks/use-param";
import { AttendanceDetailHeader } from "./admin/attendance-detail-header";
import { AttendanceDetailTable } from "./admin/attendance-detail-table";

interface Props {
  day: AttendanceDayData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminAttendanceDetailDialog({ day, open, onOpenChange }: Props) {
  const [search, setSearch] = useParam("search", "");
  const [page, setPage] = useNumberParam("page", 1);
  const [perPage, setPerPage] = useNumberParam("per_page", 10);
  
  const [statusStr, setStatus] = useParam("status", "");
  const status = statusStr === "" ? undefined : statusStr;
  
  const [isEditedStr, setIsEditedStr] = useParam("isEdited", "");
  const isEdited = isEditedStr === "" ? undefined : isEditedStr === "true";
  const setIsEdited = (val: boolean | undefined) => setIsEditedStr(val === undefined ? "" : String(val));
  
  const [isCompletedStr, setIsCompletedStr] = useParam("isCompleted", "");
  const setIsCompleted = (val: boolean | undefined) => setIsCompletedStr(val === undefined ? "" : String(val));
  const isCompleted = isCompletedStr === "" ? undefined : isCompletedStr === "true";
  
  const debouncedSearch = useDebounce(search, 300);

  const { data: response, isLoading, isFetching } = useGetAttendanceRecords(
    open && day?.id ? Number(day.id) : undefined,
    page,
    debouncedSearch,
    perPage,
    status,
    isEdited,
    isCompleted
  );

  const records = response?.data || [];
  const meta = response?.meta || {
    current_page: 1,
    last_page: 1,
    per_page: perPage,
    total: 0
  };

  // Reset page khi search, perPage hoặc các bộ lọc khác thay đổi
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, perPage, status, isEdited, isCompleted]);

  if (!day) return null;

  const isSearching = isFetching && !isLoading;

  const handlePerPageChange = (newPerPage: number) => {
    setPerPage(newPerPage);
    setPage(1);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-6xl max-h-[90vh] p-0 gap-0 overflow-hidden rounded-[10px] border-none shadow-2xl bg-surface transition-all duration-300 flex flex-col focus:outline-none focus:ring-0">
          <AttendanceDetailHeader 
            day={day}
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={(val) => setStatus(val ?? null)}
            isEdited={isEdited}
            onIsEditedChange={setIsEdited}
            isCompleted={isCompleted}
            onIsCompletedChange={setIsCompleted}
            isLoading={isLoading || isSearching}
          />

          <AttendanceDetailTable 
            records={records}
            isLoading={isLoading}
            isSearching={isSearching}
            meta={meta}
            page={page}
            onPageChange={setPage}
            onPerPageChange={handlePerPageChange}
          />
      </DialogContent>
    </Dialog>
  );
}
