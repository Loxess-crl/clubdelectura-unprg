import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { IMeta } from "@/types/generic";

interface PaginationComponentProps {
  meta: IMeta;
  onPageChange: (page: number) => void;
}

export function Paginator({ meta, onPageChange }: PaginationComponentProps) {
  const { totalCount, pageNumber, pageSize, hasNextPage, hasPreviousPage } = meta;
  
  // Calcular valores derivados
  const lastPage = Math.ceil(totalCount / pageSize);
  const from = (pageNumber - 1) * pageSize + 1;
  const to = Math.min(pageNumber * pageSize, totalCount);

  const getPageNumbers = () => {
    const delta = 2; // Número de páginas a mostrar antes y después de la página actual
    const range: (number | null)[] = [];

    for (let i = 1; i <= lastPage; i++) {
      if (
        i === 1 ||
        i === lastPage ||
        (i >= pageNumber - delta && i <= pageNumber + delta) // Páginas cercanas a la actual
      ) {
        range.push(i);
      } else if (range[range.length - 1] !== null) {
        range.push(null);
      }
    }

    return range;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 justify-between py-2">
      <div className="text-sm text-muted-foreground order-2 sm:order-1">
        <p className="flex gap-1">
          <span className="font-medium text-foreground">
            {from.toLocaleString()}-{to.toLocaleString()}
          </span>
          <span>de</span>
          <span className="font-medium text-foreground">
            {totalCount.toLocaleString()}
          </span>
          <span>resultados</span>
        </p>
      </div>

      <Pagination className="order-1 sm:order-2">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(pageNumber - 1)}
              className={
                !hasPreviousPage ? "pointer-events-none opacity-50" : ""
              }
              aria-disabled={!hasPreviousPage}
            />
          </PaginationItem>

          {getPageNumbers().map((pageNum, idx) => {
            if (pageNum === null) {
              return <PaginationEllipsis key={`ellipsis-${idx}`} />;
            }

            return (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  onClick={() => onPageChange(pageNum)}
                  isActive={pageNumber === pageNum}
                  className="min-w-[2.5rem] justify-center"
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(pageNumber + 1)}
              className={
                !hasNextPage ? "pointer-events-none opacity-50" : ""
              }
              aria-disabled={!hasNextPage}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}