import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/shadcn/pagination";

interface PaginationMeta {
  currentPage: number;
  lastPage: number;
  total: number;
  from: number;
  to: number;
}

interface PaginationComponentProps {
  meta: PaginationMeta;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
}

export function PaginationComponent({
  meta,
  nextPage,
  prevPage,
  goToPage,
}: PaginationComponentProps) {
  const { currentPage, lastPage, total, from, to } = meta;

  const getPageNumbers = () => {
    const delta = 2;
    const range: (number | null)[] = [];

    for (let i = 1; i <= lastPage; i++) {
      if (
        i === 1 ||
        i === lastPage ||
        (i >= currentPage - delta && i <= currentPage + delta)
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
            {total.toLocaleString()}
          </span>
          <span>resultados</span>
        </p>
      </div>
      <Pagination className="order-1 sm:order-2">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={prevPage}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : ""
              }
              aria-disabled={currentPage === 1}
            />
          </PaginationItem>

          {getPageNumbers().map((pageNumber, idx) =>
            pageNumber === null ? (
              <PaginationEllipsis key={`ellipsis-${idx}`} />
            ) : (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  onClick={() => goToPage(pageNumber)}
                  isActive={currentPage === pageNumber}
                  className="min-w-[2.5rem] justify-center"
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              onClick={nextPage}
              className={
                currentPage === lastPage ? "pointer-events-none opacity-50" : ""
              }
              aria-disabled={currentPage === lastPage}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
