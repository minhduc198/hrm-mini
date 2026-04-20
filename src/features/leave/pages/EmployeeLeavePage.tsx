"use client";

import React, { useState } from "react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Info, History, CalendarDays } from "lucide-react";
import { LeaveHistoryTable } from "../components/LeaveHistoryTable";
import { LeaveDetailDialog } from "../components/LeaveDetailDialog";
import { useLeaveHistory } from "../hooks/use-leave";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect } from "react";
import { LeaveRequest } from "../types";
import { PageHeader } from "@/components/common/layout/page-header";
import { EmployeeActions } from "@/features/attendance/components/employee-actions";

export default function EmployeeLeavePage() {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [lastCreatedRequest, setLastCreatedRequest] =
    useState<LeaveRequest | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null,
  );

  useEffect(() => {
    const saved = localStorage.getItem("lastCreatedLeaveRequest");
    if (saved) {
      try {
        setLastCreatedRequest(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse lastCreatedLeaveRequest", e);
      }
    }
  }, []);

  const handleCreateSuccess = (newRequest: LeaveRequest) => {
    setLastCreatedRequest(newRequest);
    localStorage.setItem("lastCreatedLeaveRequest", JSON.stringify(newRequest));
  };

  const { data, isLoading } = useLeaveHistory({
    page: currentPage,
    per_page: perPage,
  });

  const handleViewDetail = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setIsDetailOpen(true);
  };

  const latestPendingRequest = data?.data?.find(
    (r: LeaveRequest) => r.status === "pending",
  );
  const requestToShow =
    latestPendingRequest ||
    (lastCreatedRequest?.status === "pending" ? lastCreatedRequest : null);
  const showRecentButton = !!requestToShow;

  return (
    <div className="flex flex-col gap-6 h-full overflow-hidden animate-in fade-in duration-500">
      <PageHeader
        icon={CalendarDays}
        title="Lịch sử xin nghỉ"
        description="Theo dõi trạng thái và lịch sử các yêu cầu nghỉ phép cá nhân"
        actions={<EmployeeActions onLeaveRequestSuccess={handleCreateSuccess} />}
      />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div className="flex items-center gap-3">
          {showRecentButton && (
            <Button
              variant="outline"
              className="border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary animate-in slide-in-from-right-4"
              onClick={() => handleViewDetail(requestToShow)}
            >
              <Info size={16} className="mr-2" />
              Xem đơn vừa tạo
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none bg-blue-50 shadow-none">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">
                Trạng thái gần nhất
              </p>
              <Typography variant="h4" className="text-lg font-bold">
                {data?.data?.[0]?.status === "pending"
                  ? "Đang chờ duyệt"
                  : data?.data?.[0]?.status === "approved"
                    ? "Đã chấp thuận"
                    : "Đã cập nhật"}
              </Typography>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
              <History size={20} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Typography variant="h3" className="text-lg font-bold">
          Lịch sử nghỉ phép
        </Typography>

        {isLoading ? (
          <div className="h-[400px] w-full bg-slate-50/50 border border-black/10 rounded-xl animate-pulse" />
        ) : (
          <LeaveHistoryTable
            data={data?.data || []}
            pagination={{
              currentPage: data?.current_page || 1,
              totalPage: data?.last_page || 1,
              totalItems: data?.total || 0,
              perPage: perPage,
            }}
            onPageChange={setCurrentPage}
            onPerPageChange={setPerPage}
          />
        )}
      </div>

      <LeaveDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        request={selectedRequest}
        onCancelSuccess={() => {
          if (lastCreatedRequest?.id === selectedRequest?.id) {
            setLastCreatedRequest(null);
            localStorage.removeItem("lastCreatedLeaveRequest");
          }
        }}
      />
    </div>
  );
}
