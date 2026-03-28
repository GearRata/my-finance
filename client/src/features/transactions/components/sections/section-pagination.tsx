import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface SectionPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function SectionPagination({
  currentPage,
  totalPages,
  onPageChange,
}: SectionPaginationProps) {
  const getPageNumbers = (): (number | "ellipsis-start" | "ellipsis-end")[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis-start" | "ellipsis-end")[] = [1];

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) pages.push("ellipsis-start");

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages - 1) pages.push("ellipsis-end");

    pages.push(totalPages);

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              onPageChange(currentPage - 1);
            }}
            className={
              currentPage <= 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {getPageNumbers().map((pageNum) =>
          pageNum === "ellipsis-start" || pageNum === "ellipsis-end" ? (
            <PaginationItem key={pageNum}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={pageNum}>
              <PaginationLink
                isActive={pageNum === currentPage}
                onClick={() => {
                  onPageChange(pageNum);
                }}
                className="cursor-pointer"
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => {
              onPageChange(currentPage + 1);
            }}
            className={
              currentPage >= totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
