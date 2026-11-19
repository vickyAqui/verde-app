import { useState, type FormEvent } from "react";
import { ArrowLeft, BookOpen, Droplets, Leaf, LoaderCircle, Play, Plus, Sun, Wind, X } from "lucide-react";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { useFetch } from "../../lib/use-fetch";
import { Card, DataError, EmptyState, Eyebrow, Loading } from "./ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Article = {
  idConteudo: number;
  categoria: string | null;
  titulo: string | null;
  tempoLeitura: number | null;
  descricao: string | null;
};

type Video = {
  idConteudo: number;
  link: string | null;
  youtube: {
    title: string;
    thumbnailUrl: string | null;
    duration: string;
  } | null;
};

type ContentType = {
  idTipo_Conteudo: number;
  tipo: string;
};

type NewArticle = {
  categoria: string;
  titulo: string;
  tempoLeitura: string;
  descricao: string;
};

type DeleteTarget = {
  idConteudo: number;
  tipo: "artigo" | "video";
  titulo: string;
};

function articleStyle(category: string | null) {
  switch (category) {
    case "Benefícios":
      return { Icon: Wind, color: "text-primary", background: "bg-primary/10" };
    case "Preservação":
      return { Icon: Leaf, color: "text-success", background: "bg-success/10" };
    case "Dicas":
      return { Icon: Sun, color: "text-warning", background: "bg-warning/15" };
    case "Dados":
      return { Icon: Droplets, color: "text-info", background: "bg-info/10" };
    default:
      return { Icon: Leaf, color: "text-primary", background: "bg-primary/10" };
  }
}

function isYoutubeLink(value: string) {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    const segments = url.pathname.split("/").filter(Boolean);
    let videoId: string | null = null;

    if (hostname === "youtu.be") {
      videoId = segments[0] ?? null;
    } else if (["youtube.com", "m.youtube.com", "music.youtube.com"].includes(hostname)) {
      if (url.pathname === "/watch") videoId = url.searchParams.get("v");
      else if (["embed", "shorts", "live"].includes(segments[0])) videoId = segments[1] ?? null;
    }

    return !!videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId);
  } catch {
    return false;
  }
}

const facts = [
  { value: "7×", desc: "mais chuvas absorvidas em áreas arborizadas" },
  { value: "30%", desc: "menos energia consumida com sombreamento" },
  { value: "8°C", desc: "temperatura menor em ruas com árvores" },
];

const ARTICLE_CATEGORIES = ["Benefícios", "Preservação", "Dicas", "Dados"] as const;

export function EducationScreen() {
  const { tipo } = useAuth();
  const isAdmin = tipo === "admin";
  const [tab, setTab] = useState<"artigos" | "videos" | "dados">("artigos");
  const [reading, setReading] = useState<Article | null>(null);
  const [addingContent, setAddingContent] = useState<"artigo" | "video" | null>(null);
  const [articleForm, setArticleForm] = useState<NewArticle>({
    categoria: "",
    titulo: "",
    tempoLeitura: "",
    descricao: "",
  });
  const [otherCategory, setOtherCategory] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const articles = useFetch<Article[]>(() =>
    api.get<{ conteudos: Article[] }>("/conteudos", { tipo: "artigo" }).then((r) => r.conteudos),
  );
  const videos = useFetch<Video[]>(() =>
    api.get<{ conteudos: Video[] }>("/conteudos", { tipo: "video" }).then((r) => r.conteudos),
  );
  const contentTypes = useFetch<ContentType[]>(() =>
    api.get<{ tiposConteudo: ContentType[] }>("/conteudos/tipos").then((r) => r.tiposConteudo),
  );
  const availableVideos = (videos.data ?? []).filter(
    (video): video is Video & { youtube: NonNullable<Video["youtube"]> } =>
      video.youtube !== null,
  );

  function openComposer(contentType: "artigo" | "video") {
    setSubmitError(null);
    setArticleForm({ categoria: "", titulo: "", tempoLeitura: "", descricao: "" });
    setOtherCategory("");
    setVideoLink("");
    setAddingContent(contentType);
  }

  async function submitContent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!addingContent) return;

    const contentType = contentTypes.data?.find(({ tipo: value }) => value === addingContent);
    if (!contentType) {
      setSubmitError("Não foi possível carregar o tipo de conteúdo. Tente novamente.");
      return;
    }

    if (addingContent === "video" && !isYoutubeLink(videoLink.trim())) {
      setSubmitError("Informe um link válido de vídeo do YouTube.");
      return;
    }

    if (addingContent === "artigo" && !articleForm.categoria) {
      setSubmitError("Selecione uma categoria para o artigo.");
      return;
    }

    if (addingContent === "artigo" && articleForm.categoria === "Outro" && !otherCategory.trim()) {
      setSubmitError("Informe a categoria do artigo.");
      return;
    }

    setSaving(true);
    setSubmitError(null);
    try {
      const body = addingContent === "artigo"
        ? {
            idTipo_Conteudo: contentType.idTipo_Conteudo,
            categoria: (articleForm.categoria === "Outro" ? otherCategory : articleForm.categoria).trim(),
            titulo: articleForm.titulo.trim(),
            tempoLeitura: Number(articleForm.tempoLeitura),
            descricao: articleForm.descricao.trim(),
          }
        : {
            idTipo_Conteudo: contentType.idTipo_Conteudo,
            link: videoLink.trim(),
          };

      await api.post("/admin/conteudos", body);
      setAddingContent(null);
      if (addingContent === "artigo") articles.reload();
      else videos.reload();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Não foi possível salvar o conteúdo.");
    } finally {
      setSaving(false);
    }
  }

  async function removeContent() {
    if (!deleteTarget) return;

    setDeleting(true);
    setDeleteError(null);
    try {
      await api.del(`/admin/conteudos/${deleteTarget.idConteudo}`);
      const deletedType = deleteTarget.tipo;
      setDeleteTarget(null);
      if (deletedType === "artigo") articles.reload();
      else videos.reload();
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Não foi possível remover o conteúdo.");
    } finally {
      setDeleting(false);
    }
  }

  if (reading) {
    const style = articleStyle(reading.categoria);
    return (
      <div className="flex h-full flex-col overflow-y-auto bg-[var(--background)]">
        <div className={`px-5 pb-8 pt-4 ${style.background}`}>
          <button
            onClick={() => setReading(null)}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-foreground/70 hover:text-foreground"
          >
            <ArrowLeft size={15} /> Voltar
          </button>
          <div className="mt-8 max-w-[320px]">
            <Eyebrow>
              {reading.categoria ?? "Artigo"} · {reading.tempoLeitura ?? "—"} min de leitura
            </Eyebrow>
            <h1 className="mt-3 font-display text-[1.7rem] font-semibold leading-tight tracking-tight text-foreground">
              {reading.titulo ?? "Conteúdo sem título"}
            </h1>
          </div>
        </div>
        <div className="px-5 pb-10">
          <p className="mt-5 text-[15px] leading-[1.75] text-foreground/80">
            {reading.descricao ?? "Sem descrição disponível."}
          </p>
          <div className="mt-6 rounded-2xl border border-primary/15 bg-primary/[0.07] p-4">
            <p className="text-sm font-semibold text-primary">Você pode ajudar</p>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/75">
              Acompanhe as áreas cadastradas no aplicativo.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[var(--background)]">
      <div className="border-b border-black/[0.06] px-4 pt-4">
        <p className="mb-1 font-display text-[13px] italic text-muted-foreground">
          Aprender para reflorestar
        </p>
        <div className="flex items-center gap-2.5">
          <BookOpen size={19} className="text-primary" strokeWidth={1.9} />
          <h1 className="text-[1.35rem] text-foreground">Educação Ambiental</h1>
        </div>
        <div className="mt-3 flex">
          {[["artigos", "Artigos"], ["videos", "Vídeos"], ["dados", "Curiosidades"]].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k as typeof tab)}
              className={`flex-1 border-b-2 pb-3 text-sm transition-colors ${
                tab === k
                  ? "border-primary font-semibold text-foreground"
                  : "border-transparent font-medium text-muted-foreground"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {tab === "artigos" && (
          <div className="flex flex-col gap-3">
            {isAdmin && (
              <button
                onClick={() => openComposer("artigo")}
                className="btn btn-primary gap-2 text-sm font-semibold"
              >
                <Plus size={16} /> Adicionar artigo
              </button>
            )}
            {articles.loading ? (
              <Loading label="Carregando artigos…" />
            ) : articles.error ? (
              <DataError error={articles.error} onRetry={articles.reload} />
            ) : articles.data?.length ? (
              <div className="flex flex-col gap-2.5">
                {articles.data.map((article) => {
                  const style = articleStyle(article.categoria);
                  return (
                    <div key={article.idConteudo} className="relative">
                      <button
                        onClick={() => setReading(article)}
                        className="block w-full text-left"
                      >
                        <Card className="flex items-start gap-3.5 px-4 py-4 pr-12">
                          <div className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${style.background}`}>
                            <style.Icon size={19} strokeWidth={1.9} className={style.color} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`text-[11px] font-bold uppercase tracking-[0.1em] ${style.color}`}>
                              {article.categoria ?? "Artigo"}
                            </p>
                            <p className="mt-1 text-sm font-semibold leading-snug text-foreground">
                              {article.titulo ?? "Conteúdo sem título"}
                            </p>
                            <p className="mt-1.5 text-xs text-muted-foreground">
                              {article.tempoLeitura ?? "—"} min de leitura
                            </p>
                          </div>
                        </Card>
                      </button>
                      {isAdmin && (
                        <button
                          type="button"
                          aria-label={`Remover artigo: ${article.titulo ?? "sem título"}`}
                          title="Remover artigo"
                          onClick={() => {
                            setDeleteError(null);
                            setDeleteTarget({
                              idConteudo: article.idConteudo,
                              tipo: "artigo",
                              titulo: article.titulo ?? "este artigo",
                            });
                          }}
                          className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-white text-muted-foreground shadow-sm transition-[color,background-color,transform] duration-150 ease-out hover:bg-error hover:text-white active:scale-95"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState title="Nenhum artigo disponível" />
            )}
          </div>
        )}

        {tab === "videos" && (
          <div className="flex flex-col gap-3">
            {isAdmin && (
              <button
                onClick={() => openComposer("video")}
                className="btn btn-primary gap-2 text-sm font-semibold"
              >
                <Plus size={16} /> Adicionar vídeo
              </button>
            )}
            {videos.loading ? (
              <Loading label="Carregando vídeos…" />
            ) : videos.error ? (
              <DataError error={videos.error} onRetry={videos.reload} />
            ) : videos.data?.length ? (
              <div className="flex flex-col gap-2.5">
                {videos.data.map((video) => {
                  const metadata = video.youtube;
                  return (
                    <div key={video.idConteudo} className="relative">
                      <a
                        href={video.link ?? undefined}
                        target="_blank"
                        rel="noreferrer"
                        className="block"
                      >
                        <Card className="overflow-hidden">
                          <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-secondary via-[#0E4C33] to-primary">
                            {metadata?.thumbnailUrl && (
                              <img
                                src={metadata.thumbnailUrl}
                                alt=""
                                className="absolute inset-0 size-full object-cover"
                              />
                            )}
                            <span className="relative flex size-13 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur">
                              <Play size={20} className="ml-0.5" fill="currentColor" />
                            </span>
                            {metadata && (
                              <span className="absolute bottom-2.5 right-3 rounded-md bg-black/65 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                                {metadata.duration}
                              </span>
                            )}
                          </div>
                          <div className="px-4 py-3">
                            <p className="text-sm font-semibold text-foreground">
                              {metadata?.title ?? "Dados do vídeo indisponíveis"}
                            </p>
                          </div>
                        </Card>
                      </a>
                      {isAdmin && (
                        <button
                          type="button"
                          aria-label={`Remover vídeo: ${metadata?.title ?? "vídeo"}`}
                          title="Remover vídeo"
                          onClick={() => {
                            setDeleteError(null);
                            setDeleteTarget({
                              idConteudo: video.idConteudo,
                              tipo: "video",
                              titulo: metadata?.title ?? "este vídeo",
                            });
                          }}
                          className="absolute right-2 top-2 z-10 flex size-8 items-center justify-center rounded-full bg-white text-muted-foreground shadow-sm transition-[color,background-color,transform] duration-150 ease-out hover:bg-error hover:text-white active:scale-95"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState title="Nenhum vídeo disponível" />
            )}
          </div>
        )}

        {tab === "dados" && (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2.5">
              {facts.map((f) => (
                <Card key={f.value} className="px-4 py-4">
                  <p className="font-display text-[1.7rem] font-semibold leading-none text-primary">
                    {f.value}
                  </p>
                  <p className="mt-2 text-xs leading-snug text-muted-foreground">{f.desc}</p>
                </Card>
              ))}
            </div>
            <Card className="bg-gradient-to-br from-secondary via-[#0E4C33] to-primary p-4 text-white">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/60">
                Dica da semana
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/90">
                Ao podar uma árvore, nunca remova mais de 30% da copa. Podas severas estressam a
                planta e a deixam vulnerável a pragas.
              </p>
            </Card>
          </div>
        )}
      </div>

      <Dialog
        open={addingContent !== null}
        onOpenChange={(open) => {
          if (!open) setAddingContent(null);
        }}
      >
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto border-0 bg-white text-foreground">
          <DialogHeader>
            <DialogTitle>
              {addingContent === "artigo" ? "Adicionar artigo" : "Adicionar vídeo"}
            </DialogTitle>
            <DialogDescription>
              {addingContent === "artigo"
                ? "Preencha os dados do artigo ambiental."
                : "Informe um link do YouTube para adicionar o vídeo."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submitContent} className="flex flex-col gap-3">
            {addingContent === "artigo" ? (
              <>
                <label className="form-control gap-1">
                  <span className="text-xs font-semibold text-muted-foreground">Categoria</span>
                  <Select
                    value={articleForm.categoria}
                    onValueChange={(categoria) => {
                      setArticleForm({ ...articleForm, categoria });
                      setOtherCategory("");
                    }}
                  >
                    <SelectTrigger className="w-full border-black/20 bg-base-200 text-sm text-foreground focus:border-primary">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent className="z-[1202] border-black/20 bg-white">
                      {ARTICLE_CATEGORIES.map((category) => (
                        <SelectItem
                          key={category}
                          value={category}
                          className="mb-1 rounded-md bg-white px-3 py-2 last:mb-0 focus:bg-base-200"
                        >
                          {category}
                        </SelectItem>
                      ))}
                      <SelectItem
                        value="Outro"
                        className="rounded-md bg-white px-3 py-2 focus:bg-base-200"
                      >
                        Outro
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </label>
                {articleForm.categoria === "Outro" && (
                  <label className="form-control gap-1">
                    <span className="text-xs font-semibold text-muted-foreground">Outra categoria</span>
                    <input
                      required
                      maxLength={50}
                      value={otherCategory}
                      onChange={(event) => setOtherCategory(event.target.value)}
                      className="input w-full border-black/15 bg-base-200 text-sm text-foreground focus:border-primary"
                    />
                  </label>
                )}
                <label className="form-control gap-1">
                  <span className="text-xs font-semibold text-muted-foreground">Título</span>
                  <input
                    required
                    maxLength={100}
                    value={articleForm.titulo}
                    onChange={(event) => setArticleForm({ ...articleForm, titulo: event.target.value })}
                    className="input w-full border-black/15 bg-base-200 text-sm text-foreground focus:border-primary"
                  />
                </label>
                <label className="form-control gap-1">
                  <span className="text-xs font-semibold text-muted-foreground">Tempo de leitura (minutos)</span>
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={articleForm.tempoLeitura}
                    onChange={(event) => setArticleForm({ ...articleForm, tempoLeitura: event.target.value })}
                    className="input w-full border-black/15 bg-base-200 text-sm text-foreground focus:border-primary"
                  />
                </label>
                <label className="form-control gap-1">
                  <span className="text-xs font-semibold text-muted-foreground">Descrição</span>
                  <textarea
                    required
                    maxLength={255}
                    value={articleForm.descricao}
                    onChange={(event) => setArticleForm({ ...articleForm, descricao: event.target.value })}
                    className="textarea min-h-24 w-full border-black/15 bg-base-200 text-sm text-foreground focus:border-primary"
                  />
                </label>
              </>
            ) : (
              <label className="form-control gap-1">
                <span className="text-xs font-semibold text-muted-foreground">Link do YouTube</span>
                <input
                  required
                  type="url"
                  value={videoLink}
                  onChange={(event) => setVideoLink(event.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="input w-full border-black/15 bg-base-200 text-sm text-foreground focus:border-primary"
                />
              </label>
            )}

            {submitError && (
              <p role="alert" className="rounded-xl border border-error/25 bg-error/10 px-3 py-2 text-[13px] text-error">
                {submitError}
              </p>
            )}

            <DialogFooter>
              <button
                type="button"
                onClick={() => setAddingContent(null)}
                disabled={saving}
                className="btn btn-ghost"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving || contentTypes.loading}
                className="btn btn-primary gap-2"
              >
                {saving && <LoaderCircle size={16} className="animate-spin" />}
                {saving ? "Salvando…" : "Salvar"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) {
            setDeleteTarget(null);
            setDeleteError(null);
          }
        }}
      >
        <AlertDialogContent className="border-0 bg-white text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>Remover conteúdo?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget && (
                <>
                  {`Tem certeza de que deseja remover "${deleteTarget.titulo}"? `}
                  Esta ação não pode ser desfeita.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && (
            <p role="alert" className="rounded-xl border border-error/25 bg-error/10 px-3 py-2 text-[13px] text-error">
              {deleteError}
            </p>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel
              className="btn h-9 rounded-lg border border-black/10 bg-white px-3 py-1.5 text-black hover:bg-gray-50 hover:text-black"
              disabled={deleting}
            >
              Cancelar
            </AlertDialogCancel>
            <button
              type="button"
              onClick={() => void removeContent()}
              disabled={deleting}
              className="btn btn-error h-9 rounded-lg px-3 py-1.5 text-white"
            >
              {deleting && <LoaderCircle size={16} className="animate-spin" />}
              {deleting ? "Removendo…" : "Remover"}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}