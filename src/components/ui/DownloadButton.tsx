import { useToast } from "@/hooks/useToast";
import { ToastAction } from "./shadcn/Toast";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";

export function DownloadButton() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  return isLoading ? (
    <Loader2Icon className="w-6 h-6 text-black animate-spin" />
  ) : (
    <button
      onClick={() => {
        toast({
          title: "Se está descargando el archivo PDF...",
          description: "Por favor, espera un momento.",
          action: <ToastAction altText="Aceptar">Aceptar</ToastAction>,
          duration: 5000,
        });
        setIsLoading(true);

        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      }}
      className="px-6 sm:px-8 py-2 sm:py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-sm sm:text-base"
    >
      Descargar
    </button>
  );
}
