import { Typography } from "@/components/ui/typography";
import { Loader2, SearchX } from "lucide-react";
import { TablePagination } from "@/components/common/table/Pagination";
import { AttendanceRecordDetail } from "../../types/attendance";
import { AttendanceDetailRow } from "./attendance-detail-row";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AttendanceDetailTableProps {
  records: AttendanceRecordDetail[];
  isLoading: boolean;
  isSearching: boolean;
  page: number;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export function AttendanceDetailTable({ 
  records, 
  isLoading, 
  isSearching, 
  page, 
  meta, 
  onPageChange,
  onPerPageChange 
}: AttendanceDetailTableProps) {
  const showFullLoader = isLoading && records.length === 0;

  return (
    <div className="px-4 md:px-8 pb-4 md:pb-8 flex flex-col flex-1 min-h-0 min-w-0">
      <div className="border border-line-subtle rounded-[24px] bg-white flex flex-col overflow-hidden flex-1 min-w-0 relative">
        {/* Top Loading Bar for Search/Pagination */}
        {isSearching && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/20 z-[60] overflow-hidden">
            <div className="h-full bg-primary animate-[loading_1.5s_infinite_linear] w-1/3" />
          </div>
        )}

        <div className="flex-1 overflow-auto max-h-[50vh] md:max-h-[55vh] custom-scrollbar min-h-[400px] relative text-[13px] w-full max-w-full">
            <Table className="w-full relative border-separate border-spacing-0 min-w-[850px]">
              <TableHeader className="top-0 sticky z-40 bg-subtle shadow-sm">
                <TableRow className="bg-subtle border-none hover:bg-transparent">
                  <TableHead className="w-[90px] min-w-[90px] h-14 sticky left-0 z-50 bg-subtle border-b border-line-subtle after:absolute after:inset-y-0 after:right-0 after:w-px after:bg-line/50 text-center p-0">
                    <Typography variant="label-xs" className="uppercase font-bold tracking-wider">Mã NV</Typography>
                  </TableHead>
                  <TableHead className="w-[180px] min-w-[180px] bg-subtle border-b border-l border-line-subtle text-left px-4">
                    <Typography variant="label-xs" className="uppercase font-bold tracking-wider text-left">Nhân viên</Typography>
                  </TableHead>
                  <TableHead className="w-[110px] min-w-[110px] border-b border-l border-line-subtle px-4 text-center">
                    <Typography variant="label-xs" className="uppercase font-bold tracking-wider">Giờ vào</Typography>
                  </TableHead>
                  <TableHead className="w-[110px] min-w-[110px] border-b border-l border-line-subtle px-4 text-center">
                    <Typography variant="label-xs" className="uppercase font-bold tracking-wider">Giờ ra</Typography>
                  </TableHead>
                  <TableHead className="w-[90px] min-w-[90px] border-b border-l border-line-subtle px-4 text-center">
                    <Typography variant="label-xs" className="uppercase font-bold tracking-wider">Tổng số</Typography>
                  </TableHead>
                  <TableHead className="w-[170px] min-w-[170px] border-b border-l border-line-subtle px-4 text-center">
                    <Typography variant="label-xs" className="uppercase font-bold tracking-wider">Trạng thái</Typography>
                  </TableHead>
                  <TableHead className="w-[170px] min-w-[170px] border-b border-l border-line-subtle px-4 text-left">
                    <Typography variant="label-xs" className="uppercase font-bold tracking-wider text-left">Ghi chú</Typography>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {showFullLoader ? (
                  <TableRow className="bg-white hover:bg-white">
                    <TableCell colSpan={7} className="h-[400px] bg-white">
                      <div className="flex items-center justify-center h-full">
                        <Loader2 className="size-10 text-primary/30 animate-spin" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : !records || records.length === 0 ? (
                  <TableRow className="bg-white hover:bg-white">
                    <TableCell colSpan={7} className="h-[400px] bg-white">
                      <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in duration-300">
                        <div className="bg-subtle rounded-full p-4">
                          <SearchX className="size-12 text-muted/40" />
                        </div>
                        <div className="text-center">
                          <Typography className="text-tx-base font-bold text-lg">Không tìm thấy nhân viên</Typography>
                          <Typography className="text-muted text-sm px-10">Thử thay đổi bộ lọc hoặc kiểm tra lại ngày được chọn.</Typography>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  records.map((record) => (
                    <AttendanceDetailRow key={record.id} record={record} />
                  ))
                )}
              </TableBody>
            </Table>
        </div>
        
        {records.length > 0 && (
          <div className="px-8 pb-4">
             <TablePagination
              currentPage={page}
              totalPage={meta.last_page}
              totalItems={meta.total}
              perPage={meta.per_page}
              onPageChange={onPageChange}
              onPerPageChange={onPerPageChange}
              className="mt-0 pt-4 border-t border-line-subtle"
            />
          </div>
        )}
      </div>
    </div>
  );
}
