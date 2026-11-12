import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "./ui/dialog";

type ReportImage = {
  fotos: string[];
  titulo: string;
};

export function DenunciaImageDialog({
  report,
  onClose,
}: {
  report: ReportImage | null;
  onClose: () => void;
}) {
  const [imageError, setImageError] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setImageError(false);
    setCurrentIndex(0);
  }, [report]);

  return (
    <Dialog
      open={!!report}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="w-[calc(100%-2rem)] max-w-3xl border-0 bg-white p-3 text-foreground sm:max-w-3xl">
        <DialogTitle className="pr-8 font-display text-base text-foreground">
          {report?.titulo || "Imagem da denúncia"}
        </DialogTitle>
        {report && !imageError ? (
          <img
            src={report.fotos[currentIndex]}
            alt={`Imagem ${currentIndex + 1} da denúncia: ${report.titulo}`}
            onError={() => setImageError(true)}
            className="max-h-[75dvh] w-full rounded-md object-contain"
          />
        ) : (
          <p className="py-12 text-center text-sm text-foreground">
            {report
              ? "Não foi possível carregar esta imagem."
              : "Esta denúncia não possui imagem."}
          </p>
        )}
        {report && report.fotos.length > 1 && (
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                setCurrentIndex((index) => (index - 1 + report.fotos.length) % report.fotos.length);
                setImageError(false);
              }}
              aria-label="Imagem anterior"
              className="rounded-full p-2 text-foreground hover:bg-black/5"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} / {report.fotos.length}
            </span>
            <button
              type="button"
              onClick={() => {
                setCurrentIndex((index) => (index + 1) % report.fotos.length);
                setImageError(false);
              }}
              aria-label="Próxima imagem"
              className="rounded-full p-2 text-foreground hover:bg-black/5"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
