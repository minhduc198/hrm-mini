"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPage,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPage <= 1) return null;

  const getPages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPage <= maxVisible) {
      for (let i = 1; i <= totalPage; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPage - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      
      if (currentPage < totalPage - 2) pages.push("...");
      if (!pages.includes(totalPage)) pages.push(totalPage);
    }
    return pages;
  };

  return (
    <div className={cn("flex items-center justify-between gap-4 py-2", className)}>
      <div className="text-xs text-muted font-medium">
        Trang <span className="text-base font-semibold">{currentPage}</span> / {totalPage}
      </div>
      
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg border-line-subtle bg-surface hover:bg-page transition-all"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={14} className="text-muted" />
        </Button>

        <div className="flex items-center gap-1">
          {getPages().map((page, idx) => (
            <div key={idx}>
              {page === "..." ? (
                <div className="w-8 h-8 flex items-center justify-center text-muted">
                  <MoreHorizontal size={14} />
                </div>
              ) : (
                <Button
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-8 min-w-[32px] rounded-lg text-xs font-medium transition-all",
                    currentPage === page 
                      ? "bg-primary text-white shadow-sm ring-1 ring-primary/20" 
                      : "text-muted hover:bg-page hover:text-base"
                  )}
                  onClick={() => onPageChange(page as number)}
                >
                  {page}
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-lg border-line-subtle bg-surface hover:bg-page transition-all"
          disabled={currentPage === totalPage}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight size={14} className="text-muted" />
        </Button>
      </div>
    </div>
  );
}
