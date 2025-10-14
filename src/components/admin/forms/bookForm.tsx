"use client";

import { Button } from "@/components/ui/shadcn/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/shadcn/form";
import { Input } from "@/components/ui/input";
import type { DataFormProps } from "@/types/generic";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { z } from "zod";
import type { Book } from "@/interfaces/book.interface";
import { getSlugFromName } from "@/utils/functions";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { uploadBookCover } from "@/services/book.service";
import { useToast } from "@/hooks/use-toast";

const bookSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  author: z.string().min(1, "El nombre es requerido"),
  category: z.string().min(1, "La categoría es requerida"),
  description: z.string().min(1, "La descripción es requerida"),
  pubyear: z.string().min(1, "El año de publicación es requerido"),
  week: z.string().min(1, "La Fecha de lectura es requerida"),
  bookImage: z.string().min(1, "La URL de la imagen es requerida"),
});

type BookFormData = z.infer<typeof bookSchema>;

export const BookForm = ({
  data: book,
  onSave,
  onCancel,
  isLoading,
}: DataFormProps<Book>) => {
  const form = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      author: book?.author,
      title: book?.title,
      category: book?.category,
      description: book?.description,
      week: book?.week,
      pubyear: book?.pubyear,
      bookImage: book?.bookImage,
    },
  });

  const [localPreview, setLocalPreview] = useState<string | null>(
    book?.bookImage ?? null
  );
  const [uploadingImage, setUploadingImage] = useState(false);
  const { toast } = useToast();

  // keep localPreview in sync when book prop changes
  useEffect(() => {
    setLocalPreview(book?.bookImage ?? null);
  }, [book?.bookImage]);

  const onSubmit = (data: BookFormData) => {
    const requestData: Book = {
      ...data,
      slug: book?.slug ?? getSlugFromName(data.title),
      createdAt: book?.createdAt ?? Date.now(),
    };

    Object.keys(requestData).forEach(
      (key) =>
        requestData[key as keyof Book] === "" &&
        delete requestData[key as keyof Book]
    );

    onSave(requestData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          {/* Main form fields - left column */}
          <div className="space-y-4">
            <div className="space-y-1">
              <FormLabel>Título</FormLabel>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <FormLabel>Autor</FormLabel>
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-1">
                <FormLabel>Categoría</FormLabel>
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <FormLabel>Año de Publicación</FormLabel>
                <FormField
                  control={form.control}
                  name="pubyear"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-1">
                <FormLabel>Fecha de Lectura</FormLabel>
                <FormField
                  control={form.control}
                  name="week"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-1">
              <FormLabel>Descripción</FormLabel>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea {...field} rows={6} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-3 lg:order-last order-first">
            <FormLabel>Imagen de Portada</FormLabel>
            <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-900 space-y-3">
              <div className="aspect-[2/3] w-full max-w-[220px] mx-auto rounded-md overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 flex items-center justify-center">
                {localPreview ? (
                  <img
                    src={localPreview}
                    alt="Vista previa del libro"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="text-xs text-muted-foreground px-4 text-center">
                    Sin imagen
                  </div>
                )}
              </div>

              {/* URL Input */}
              <FormField
                control={form.control}
                name="bookImage"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="URL de la imagen"
                        className="text-sm"
                        onChange={(e) => {
                          field.onChange(e);
                          const val = e.target.value;
                          setLocalPreview(val || null);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* File picker */}
              <div className="space-y-1.5">
                <div className="text-xs text-center text-slate-500 dark:text-slate-400">
                  o sube desde tu equipo
                </div>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  className="block w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-800 dark:file:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    // Validate file size (max 5MB)
                    const maxSize = 5 * 1024 * 1024; // 5MB
                    if (file.size > maxSize) {
                      toast({
                        title: "Error",
                        description: "La imagen no debe superar los 5MB",
                        variant: "destructive",
                      });
                      return;
                    }

                    // Show preview immediately
                    const reader = new FileReader();
                    reader.onload = () => {
                      setLocalPreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);

                    // Upload to Firebase Storage
                    setUploadingImage(true);
                    try {
                      // Generate a temporary slug from the title or use a default
                      const currentTitle = form.getValues("title") || "libro";
                      const tempSlug = getSlugFromName(currentTitle);

                      const downloadURL = await uploadBookCover(file, tempSlug);

                      // Set the download URL in the form
                      form.setValue("bookImage", downloadURL);

                      toast({
                        title: "Imagen subida",
                        description: "La imagen se ha subido correctamente",
                      });
                    } catch (error) {
                      console.error("Error uploading image:", error);
                      toast({
                        title: "Error",
                        description:
                          "No se pudo subir la imagen. Intenta de nuevo.",
                        variant: "destructive",
                      });
                      // Reset preview on error
                      setLocalPreview(book?.bookImage ?? null);
                    } finally {
                      setUploadingImage(false);
                      // Clear the input so the same file can be selected again
                      e.target.value = "";
                    }
                  }}
                />
                {uploadingImage && (
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Subiendo imagen...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isLoading
              ? "Cargando..."
              : book
                ? "Guardar Cambios"
                : "Crear Libro"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
