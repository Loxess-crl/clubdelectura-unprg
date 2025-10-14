"use client";

import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Loader2, Plus, Trash2, Upload, ExternalLink } from "lucide-react";
import type { Book } from "@/interfaces/book.interface";
import { uploadBookResource } from "@/services/book.service";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/shadcn/select";
import { Label } from "@/components/ui/shadcn/label";

interface DownloadsFormProps {
  book: Book;
  onSave: (downloads: Book["downloads"]) => void;
  onCancel: () => void;
  isLoading: boolean;
}

interface DownloadItem {
  id: string;
  type: string;
  url: string;
  customType?: string;
  file?: File;
}

const DEFAULT_TYPES = ["pdf", "epub", "mobi", "audiobook"];

export const DownloadsForm = ({
  book,
  onSave,
  onCancel,
  isLoading,
}: DownloadsFormProps) => {
  const { toast } = useToast();
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set());

  // Initialize downloads from book data
  useEffect(() => {
    if (book.downloads && book.downloads.length > 0) {
      setDownloads(
        book.downloads.map((d, idx) => ({
          id: `${idx}-${Date.now()}`,
          type: DEFAULT_TYPES.includes(d.type) ? d.type : "custom",
          url: d.url,
          customType: DEFAULT_TYPES.includes(d.type) ? undefined : d.type,
        }))
      );
    } else {
      // Start with one empty download
      addNewDownload();
    }
  }, []);

  const addNewDownload = () => {
    setDownloads([
      ...downloads,
      {
        id: `new-${Date.now()}`,
        type: "pdf",
        url: "",
      },
    ]);
  };

  const removeDownload = (id: string) => {
    setDownloads(downloads.filter((d) => d.id !== id));
  };

  const updateDownload = (
    id: string,
    field: keyof DownloadItem,
    value: string
  ) => {
    setDownloads(
      downloads.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const handleFileSelect = async (id: string, file: File | null) => {
    if (!file) return;

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast({
        title: "Error",
        description: "El archivo no debe superar los 50MB",
        variant: "destructive",
      });
      return;
    }

    // Store file temporarily
    setDownloads(
      downloads.map((d) => (d.id === id ? { ...d, file, url: "" } : d))
    );
  };

  const uploadFile = async (id: string) => {
    const download = downloads.find((d) => d.id === id);
    if (!download?.file) return;

    setUploadingFiles((prev) => new Set(prev).add(id));

    try {
      const downloadURL = await uploadBookResource(download.file, book.slug);

      // Update the URL
      setDownloads(
        downloads.map((d) =>
          d.id === id ? { ...d, url: downloadURL, file: undefined } : d
        )
      );

      toast({
        title: "Archivo subido",
        description: "El archivo se ha subido correctamente",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description: "No se pudo subir el archivo. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setUploadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleSave = async () => {
    // Validate that all downloads have URLs
    const invalidDownloads = downloads.filter((d) => !d.url && !d.file);
    if (invalidDownloads.length > 0) {
      toast({
        title: "Error",
        description:
          "Todos los recursos deben tener una URL o un archivo seleccionado",
        variant: "destructive",
      });
      return;
    }

    // Upload pending files
    const pendingUploads = downloads.filter((d) => d.file && !d.url);
    if (pendingUploads.length > 0) {
      toast({
        title: "Advertencia",
        description: "Hay archivos sin subir. Súbelos primero.",
        variant: "destructive",
      });
      return;
    }

    // Prepare final downloads data
    const finalDownloads = downloads
      .filter((d) => d.url) // Only include downloads with URLs
      .map((d) => ({
        type: d.type === "custom" ? d.customType || "other" : d.type,
        url: d.url,
      }));

    onSave(finalDownloads);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {downloads.map((download, index) => (
          <div
            key={download.id}
            className="border rounded-lg p-4 space-y-3 bg-slate-50 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Recurso {index + 1}</span>
              {downloads.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDownload(download.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor={`type-${download.id}`}>Tipo de Recurso</Label>
                <Select
                  value={download.type}
                  onValueChange={(value) =>
                    updateDownload(download.id, "type", value)
                  }
                >
                  <SelectTrigger id={`type-${download.id}`}>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.toUpperCase()}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {download.type === "custom" && (
                <div className="space-y-2">
                  <Label htmlFor={`customType-${download.id}`}>
                    Tipo Personalizado
                  </Label>
                  <Input
                    id={`customType-${download.id}`}
                    placeholder="Ej: docx, txt, etc."
                    value={download.customType || ""}
                    onChange={(e) =>
                      updateDownload(download.id, "customType", e.target.value)
                    }
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`url-${download.id}`}>URL del Recurso</Label>
              <div className="flex gap-2">
                <Input
                  id={`url-${download.id}`}
                  placeholder="https://..."
                  value={download.url}
                  onChange={(e) =>
                    updateDownload(download.id, "url", e.target.value)
                  }
                  disabled={!!download.file}
                />
                {download.url && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(download.url, "_blank")}
                    className="shrink-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>O sube un archivo</Label>
              <div className="flex gap-2 items-center">
                <input
                  type="file"
                  accept="*/*"
                  disabled={uploadingFiles.has(download.id) || !!download.url}
                  className="block w-full text-sm file:mr-2 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-800 dark:file:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  onChange={(e) =>
                    handleFileSelect(download.id, e.target.files?.[0] || null)
                  }
                />
                {download.file && !download.url && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => uploadFile(download.id)}
                    disabled={uploadingFiles.has(download.id)}
                    className="shrink-0"
                  >
                    {uploadingFiles.has(download.id) ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Subiendo...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Subir
                      </>
                    )}
                  </Button>
                )}
              </div>
              {download.file && (
                <p className="text-xs text-muted-foreground">
                  Archivo seleccionado: {download.file.name} (
                  {(download.file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addNewDownload}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Agregar Recurso
      </Button>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isLoading ? "Guardando..." : "Guardar Recursos"}
        </Button>
      </div>
    </div>
  );
};
