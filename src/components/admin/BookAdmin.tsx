"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/shadcn/button";
import {
  Search,
  Plus,
  Edit,
  Trash,
  AlertCircle,
  FolderDown,
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
} from "@/components/ui/shadcn/dialog";
import { TableComponent } from "@/components/ui/table/TableComponent";
import { useToast } from "@/hooks/use-toast";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/shadcn/alert";
import type { Book } from "@/interfaces/book.interface";
import { createBook, deleteBook, updateBook } from "@/services/book.service";
import { PaginationComponent } from "../ui/table/PaginationComponent";
import AdminLayout from "./AdminLayout";
import { BookForm } from "./forms/bookForm";
import { DownloadsForm } from "./forms/downloadsForm";

const BooksScreen = ({ currentPath }: { currentPath: string }) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBook, setBookUser] = useState<Book | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogActionLoading, setIsDialogActionLoading] = useState(false);
  const [errorForm, setErrorForm] = useState<string | null>(null);
  const [deleteBookDialog, setDeleteBookDialog] = useState<{
    open: boolean;
    book?: Book;
  }>({ open: false });
  const [downloadsDialog, setDownloadsDialog] = useState<{
    open: boolean;
    book?: Book;
  }>({ open: false });
  const [isDownloadsActionLoading, setIsDownloadsActionLoading] =
    useState(false);

  const { toast } = useToast();

  const itemsPerPage = 8;

  // Aplicar búsqueda cada vez que cambie searchInput con un pequeño debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 300); // Debounce de 300ms

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  // useBooks ahora maneja tanto la búsqueda como la paginación
  const {
    dataPaginated: books,
    loading,
    error,
    meta,
    nextPage,
    prevPage,
    refresh,
    goToPage,
  } = useBooks({
    itemsPerPage,
    searchTerm,
  });

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
    refresh();
  };

  const handleDownloads = (book: Book) => {
    setDownloadsDialog({ open: true, book });
  };

  const handleSaveDownloads = async (downloads: Book["downloads"]) => {
    if (!downloadsDialog.book) return;

    try {
      setIsDownloadsActionLoading(true);
      await updateBook(downloadsDialog.book.slug, { downloads });
      setDownloadsDialog({ open: false });
      refreshData();
      toast({
        title: "Recursos actualizados",
        description: "Los recursos del libro se han actualizado correctamente.",
      });
    } catch (error: any) {
      console.error("Error actualizando recursos:", error);
      toast({
        title: "Error",
        description: "No se pudieron actualizar los recursos.",
        variant: "destructive",
      });
    } finally {
      setIsDownloadsActionLoading(false);
    }
  };

  const handleSave = async (bookData: Book) => {
    setErrorForm(null);
    try {
      setIsDialogActionLoading(true);
      if (editingBook) {
        await updateBook(editingBook.slug, bookData);
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
        ) : meta.total === 0 && searchTerm ? (
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
              }}
            >
              Limpiar búsqueda
            </Button>
          </div>
        ) : (
          <>
            <TableComponent
              columns={["Título", "Autor", "Categoría", "Fecha de lectura"]}
              data={books || []}
              actions={[
                {
                  label: "Recursos",
                  icon: <FolderDown className="h-4 w-4" />,
                  onClick: handleDownloads,
                },
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
          <DialogContent
            className="sm:max-w-4xl max-w-[95vw]"
            aria-describedby={undefined}
          >
            <DialogHeader>
              <DialogTitle>
                {editingBook ? "Editar Libro" : "Nuevo Libro"}
              </DialogTitle>
            </DialogHeader>
            {errorForm && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorForm}</AlertDescription>
              </Alert>
            )}
            <BookForm
              data={editingBook}
              onSave={handleSave}
              isLoading={isDialogActionLoading}
              onCancel={() => {
                setErrorForm(null);
                setIsDialogOpen(false);
              }}
            />
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

        <Dialog
          open={downloadsDialog.open}
          onOpenChange={(isOpen) => setDownloadsDialog({ open: isOpen })}
        >
          <DialogContent
            className="sm:max-w-3xl max-w-[95vw]"
            aria-describedby={undefined}
          >
            <DialogHeader>
              <DialogTitle>
                Gestionar Recursos de Descarga
                {downloadsDialog.book && (
                  <span className="block text-sm font-normal text-muted-foreground mt-1">
                    {downloadsDialog.book.title}
                  </span>
                )}
              </DialogTitle>
            </DialogHeader>
            {downloadsDialog.book && (
              <DownloadsForm
                book={downloadsDialog.book}
                onSave={handleSaveDownloads}
                onCancel={() => setDownloadsDialog({ open: false })}
                isLoading={isDownloadsActionLoading}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default BooksScreen;
