import type { Book } from "@/interfaces/book.interface";
import { fetchAllBooks } from "@/services/book.service";
import { useState, useEffect } from "react";

interface Meta {
  current_page: number;
  last_page: number;
  from: number;
  to: number;
  total: number;
}

interface UseBooksProps {
  itemsPerPage?: number;
}

export const useBooks = (props: UseBooksProps) => {
  const itemsPerPage = props.itemsPerPage || 10;
  const [books, setBooks] = useState<Book[]>([]);
  const [dataPaginated, setDataPaginated] = useState<Book[]>([]);
  const [meta, setMeta] = useState<Meta>({
    current_page: 1,
    last_page: 1,
    from: 1,
    to: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all books una sola vez
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchAllBooks();
        const data = Object.values(result).flat();
        setBooks(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Paginación controlada por current_page
  useEffect(() => {
    const total = books.length;
    const lastPage = Math.max(Math.ceil(total / itemsPerPage), 1);
    const currentPage = Math.min(meta.current_page, lastPage);
    const from = (currentPage - 1) * itemsPerPage;
    const to = from + itemsPerPage;

    setMeta({
      current_page: currentPage,
      last_page: lastPage,
      from: from + 1,
      to: Math.min(to, total),
      total,
    });

    setDataPaginated(books.slice(from, to));
  }, [books, meta.current_page, itemsPerPage]);

  const nextPage = () => {
    if (meta.current_page < meta.last_page) {
      setMeta((prev) => ({ ...prev, current_page: prev.current_page + 1 }));
    }
  };

  const prevPage = () => {
    if (meta.current_page > 1) {
      setMeta((prev) => ({ ...prev, current_page: prev.current_page - 1 }));
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= meta.last_page) {
      setMeta((prev) => ({ ...prev, current_page: page }));
    }
  };

  const refresh = () => {
    setMeta((prev) => ({ ...prev, current_page: 1 }));
    setBooks([]); // Reset books to trigger re-fetch
  };

  return {
    dataPaginated,
    meta,
    loading,
    error,
    nextPage,
    prevPage,
    goToPage,
    refresh,
  };
};
