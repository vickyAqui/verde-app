import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "./ui/dialog";

type ReportImage = {
  foto: string;
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

  useEffect(() => {
    setImageError(false);
  }, [report?.foto]);

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
            src={report.foto}
            alt={`Imagem da denúncia: ${report.titulo}`}
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
      </DialogContent>
    </Dialog>
  );
}
