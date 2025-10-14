import type { Book } from "@/interfaces/book.interface";
import { fetchAllBooks } from "@/services/book.service";
import { useState, useEffect, useMemo } from "react";

interface Meta {
  current_page: number;
  last_page: number;
  from: number;
  to: number;
  total: number;
}

interface UseBooksProps {
  itemsPerPage?: number;
  searchTerm?: string;
}

export const useBooks = (props: UseBooksProps) => {
  const { itemsPerPage = 10, searchTerm = "" } = props;
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch all books
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
  }, [refreshTrigger]);

  // Filtrar libros basándose en el término de búsqueda
  const filteredBooks = useMemo(() => {
    if (!searchTerm.trim()) return books;

    const searchLower = searchTerm.toLowerCase();
    return books.filter((book) => {
      return (
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        book.category.toLowerCase().includes(searchLower) ||
        book.week.toLowerCase().includes(searchLower)
      );
    });
  }, [books, searchTerm]);

  // Resetear a página 1 cuando cambia el término de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Calcular paginación y meta data basándose en los libros filtrados
  const { dataPaginated, meta } = useMemo(() => {
    const total = filteredBooks.length;
    const lastPage = Math.max(Math.ceil(total / itemsPerPage), 1);
    const validCurrentPage = Math.min(Math.max(currentPage, 1), lastPage);
    const from = (validCurrentPage - 1) * itemsPerPage;
    const to = Math.min(from + itemsPerPage, total);

    const metaData: Meta = {
      current_page: validCurrentPage,
      last_page: lastPage,
      from: total === 0 ? 0 : from + 1,
      to: total === 0 ? 0 : to,
      total,
    };

    const paginatedData = filteredBooks.slice(from, to);

    return { dataPaginated: paginatedData, meta: metaData };
  }, [filteredBooks, currentPage, itemsPerPage]);

  const nextPage = () => {
    if (currentPage < meta.last_page) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= meta.last_page) {
      setCurrentPage(page);
    }
  };

  const refresh = () => {
    setCurrentPage(1);
    setRefreshTrigger((prev) => prev + 1);
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
    allBooks: books, // Exponer todos los libros por si se necesitan
  };
};
