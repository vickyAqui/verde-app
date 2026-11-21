import { useState } from "react";
import { ArrowLeft, BookOpen, Droplets, Leaf, Play, Sun, Wind } from "lucide-react";
import { api } from "../../lib/api";
import { useFetch } from "../../lib/use-fetch";
import { Card, DataError, EmptyState, Eyebrow, Loading } from "./ui";

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

const facts = [
  { value: "7×", desc: "mais chuvas absorvidas em áreas arborizadas" },
  { value: "30%", desc: "menos energia consumida com sombreamento" },
  { value: "8°C", desc: "temperatura menor em ruas com árvores" },
];

export function EducationScreen() {
  const [tab, setTab] = useState<"artigos" | "videos" | "dados">("artigos");
  const [reading, setReading] = useState<Article | null>(null);
  const articles = useFetch<Article[]>(() =>
    api.get<{ conteudos: Article[] }>("/conteudos", { tipo: "artigo" }).then((r) => r.conteudos),
  );
  const videos = useFetch<Video[]>(() =>
    api.get<{ conteudos: Video[] }>("/conteudos", { tipo: "video" }).then((r) => r.conteudos),
  );

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

    </div>
  );
}