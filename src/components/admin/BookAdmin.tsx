"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/shadcn/Button";
import {
  Search,
  Plus,
  Edit,
  Trash,
  AlertCircle,
  Leaf,
  Paperclip,
  Users2,
} from "lucide-react";
import { useBooks } from "@/hooks/useBook";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { Input } from "@/components/ui/input";
import { TableCell } from "@/components/ui/shadcn/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/shadcn/Dialog";
import { TableComponent } from "@/components/ui/table/TableComponent";
import { useToast } from "@/hooks/use-toast";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/shadcn/alert";
import { Label } from "@/components/ui/shadcn/label";
import type { Book } from "@/interfaces/book.interface";
import { createBook, deleteBook, updateBook } from "@/services/book.service";
import { PaginationComponent } from "../ui/table/PaginationComponent";
import AdminLayout from "./AdminLayout";

const BooksScreen = ({ currentPath }: { currentPath: string }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setBookUser] = useState<Book | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogActionLoading, setIsDialogActionLoading] = useState(false);
  const [errorForm, setErrorForm] = useState<string | null>(null);
  const [deleteBookDialog, setDeleteBookDialog] = useState<{
    open: boolean;
    book?: Book;
  }>({ open: false });

  const { toast } = useToast();

  const itemsPerPage = 8;

  // Aplicar búsqueda cada vez que cambie searchInput con un pequeño debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1); // Resetear a la primera página cuando se busca
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const props = useMemo(() => {
    return {
      itemsPerPage,
    };
  }, [itemsPerPage]);

  const {
    dataPaginated: allBooks,
    loading,
    error,
    meta: originalMeta,
    nextPage: originalNextPage,
    prevPage: originalPrevPage,
    refresh,
    goToPage: originalGoToPage,
  } = useBooks(props);

  // Filtrar libros basándose en el término de búsqueda
  const filteredBooks = useMemo(() => {
    if (!searchTerm.trim()) return allBooks;

    return allBooks.filter((book) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        book.category.toLowerCase().includes(searchLower) ||
        book.week.toLowerCase().includes(searchLower)
      );
    });
  }, [allBooks, searchTerm]);

  // Paginación personalizada para libros filtrados
  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredBooks.slice(startIndex, endIndex);
  }, [filteredBooks, currentPage, itemsPerPage]);

  // Meta data personalizada para libros filtrados
  const meta = useMemo(() => {
    const total = filteredBooks.length;
    const lastPage = Math.max(Math.ceil(total / itemsPerPage), 1);
    const from = Math.min((currentPage - 1) * itemsPerPage + 1, total);
    const to = Math.min(currentPage * itemsPerPage, total);

    return {
      current_page: currentPage,
      last_page: lastPage,
      from: total === 0 ? 0 : from,
      to: total === 0 ? 0 : to,
      total,
    };
  }, [filteredBooks.length, currentPage, itemsPerPage]);

  // Funciones de paginación personalizadas
  const nextPage = () => {
    if (currentPage < meta.last_page) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= meta.last_page) {
      setCurrentPage(page);
    }
  };

  // Usar libros paginados en lugar de books
  const books = paginatedBooks;

  const handleEdit = (book: Book) => {
    setErrorForm(null);
    setBookUser(book);
    setIsDialogOpen(true);
  };

  const handleDelete = (book: Book) => {
    setDeleteBookDialog({ open: true, book: book });
  };

  const confirmDeleteUser = async () => {
    if (!deleteBookDialog.book) return;

    try {
      await deleteBook(deleteBookDialog.book.slug);
      setDeleteBookDialog({ open: false });
      refreshData();
      toast({
        title: "Libro eliminado",
        description: "El libro se ha eliminado correctamente.",
      });
    } catch (error) {
      console.error("Error eliminando libro:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el libro.",
        variant: "destructive",
      });
    }
  };

  const refreshData = () => {
    setCurrentPage(1);
    refresh();
  };

  const handleSave = async (bookData: Book) => {
    setErrorForm(null);
    try {
      setIsDialogActionLoading(true);
      if (editingUser) {
        await updateBook(editingUser.slug, bookData);
      } else {
        await createBook(bookData);
      }
      setIsDialogOpen(false);
      setBookUser(undefined);
      refreshData();
      toast({
        title: "Libro guardado",
        description: "El libro se ha guardado correctamente.",
      });
    } catch (error: any) {
      setErrorForm(error.response.data.message);
      console.error("Error guardando libro:", error.response.data.message);
    } finally {
      setIsDialogActionLoading(false);
    }
  };

  return (
    <AdminLayout currentPath={currentPath}>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Libros</h1>
            <p className="text-sm text-muted-foreground">
              Gestiona los Libros del Club de Lectura.
            </p>
          </div>
          <Button
            onClick={() => {
              setBookUser(undefined);
              setIsDialogOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Agregar Libro
          </Button>
        </div>
        <div className="flex gap-4 flex-wrap items-end">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título, autor, categoría..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-8"
            />
          </div>
          {searchTerm && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                Mostrando {meta.total} resultado{meta.total !== 1 ? "s" : ""}{" "}
                para "{searchTerm}"
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchInput("");
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
                className="h-8 px-2 text-xs"
              >
                Limpiar
              </Button>
            </div>
          )}
        </div>

        {loading ? (
          <Skeleton className="h-4 w-full" />
        ) : error ? (
          <p>Error al cargar los datos.</p>
        ) : filteredBooks.length === 0 && searchTerm ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No se encontraron libros que coincidan con "{searchTerm}"
            </p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => {
                setSearchInput("");
                setSearchTerm("");
                setCurrentPage(1);
              }}
            >
              Limpiar búsqueda
            </Button>
          </div>
        ) : (
          <>
            <TableComponent
              columns={["Título", "Autor", "Categoría", "Semana de lectura"]}
              data={books || []}
              actions={[
                {
                  label: "Editar",
                  icon: <Edit className="h-4 w-4" />,
                  onClick: handleEdit,
                },
                {
                  label: "Eliminar",
                  icon: <Trash className="h-4 w-4" />,
                  onClick: handleDelete,
                },
              ]}
              renderRow={(book) => (
                <>
                  <TableCell>{book.title}</TableCell>
                  <TableCell className="font-medium">{book.author}</TableCell>
                  <TableCell>{book.category}</TableCell>
                  <TableCell>{book.week}</TableCell>
                </>
              )}
            />
            <PaginationComponent
              meta={{
                currentPage: meta.current_page,
                lastPage: meta.last_page,
                total: meta.total,
                from: meta.from,
                to: meta.to,
              }}
              nextPage={nextPage}
              prevPage={prevPage}
              goToPage={goToPage}
            />
          </>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-xl" aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Editar Libro" : "Nuevo Libro"}
              </DialogTitle>
            </DialogHeader>
            {errorForm && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorForm}</AlertDescription>
              </Alert>
            )}
            {/* <UserForm
            user={editingUser}
            onSave={handleSave}
            isLoading={isDialogActionLoading}
            onCancel={() => {
              setErrorForm(null);
              setIsDialogOpen(false);
            }}
          /> */}
            <h2>Hola</h2>
          </DialogContent>
        </Dialog>

        <Dialog
          open={deleteBookDialog.open}
          onOpenChange={(isOpen) => setDeleteBookDialog({ open: isOpen })}
        >
          <DialogContent aria-describedby={undefined}>
            <DialogHeader>
              <DialogTitle>Confirmar eliminación</DialogTitle>
            </DialogHeader>
            <p>
              ¿Estás seguro de que deseas eliminar el libro{" "}
              <strong>{deleteBookDialog.book?.title} </strong> -{" "}
              {deleteBookDialog.book?.author}?
            </p>
            <div className="flex justify-end gap-4 mt-4">
              <Button
                variant="secondary"
                onClick={() => setDeleteBookDialog({ open: false })}
              >
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDeleteUser}>
                Eliminar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default BooksScreen;
