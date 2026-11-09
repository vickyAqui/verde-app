import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Clock3,
  MapPin,
  Plus,
  Sprout,
  TriangleAlert,
  UserRound,
  X,
} from "lucide-react";
import {
  ApiError,
  api,
  type Denuncia,
  type OngDashboard,
} from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { useFetch } from "../../lib/use-fetch";
import {
  Card,
  DataError,
  EmptyState,
  initials,
  Loading,
  num,
  StatusBadge,
} from "./ui";

const ONG_STATUS = {
  pendente: { label: "Em análise", join: "badge-warning" },
  aprovada: { label: "Aprovada", join: "badge-success" },
  rejeitada: { label: "Rejeitada", join: "badge-error" },
};

const DEN_STATUS = {
  aberta: { label: "Aberta", join: "badge-error" },
  "em tratamento": { label: "Em tratamento", join: "badge-warning" },
  resolvido: { label: "Resolvida", join: "badge-success" },
  resolvida: { label: "Resolvida", join: "badge-success" },
};

type Tab = "projetos" | "seguidores" | "denuncias";

const TABS: Array<{ key: Tab; label: string }> = [
  { key: "projetos", label: "Projetos" },
  { key: "seguidores", label: "Seguidores" },
  { key: "denuncias", label: "Denúncias" },
];

export function OngDashboardScreen() {
  const navigate = useNavigate();
  const { tipo } = useAuth();

  const dashboard = useFetch<OngDashboard>(() => api.get("/ongs/me/dashboard"));

  const [tab, setTab] = useState<Tab>("projetos");
  const [createOpen, setCreateOpen] = useState(false);
  const [objetivo, setObjetivo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const ong = dashboard.data?.ong;
  const stats = dashboard.data?.stats;
  const approved = ong?.statusOng === "aprovada";
  const notFound = dashboard.error instanceof ApiError && dashboard.error.status === 404;

  async function createProjeto(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateError(null);

    if (!objetivo.trim() || !descricao.trim()) {
      setCreateError("Preencha o objetivo e a descrição do projeto.");
      return;
    }

    setCreating(true);

    try {
      await api.post("/projetos", {
        objetivo: objetivo.trim(),
        descricao: descricao.trim(),
      });

      setObjetivo("");
      setDescricao("");
      setCreateOpen(false);
      dashboard.reload();
    } catch (error) {
      setCreateError(
        error instanceof Error
          ? error.message
          : "Não foi possível criar o projeto.",
      );
    } finally {
      setCreating(false);
    }
  }

  if (dashboard.loading) {
    return (
      <div className="flex h-full items-center justify-center bg-[var(--background)]">
        <Loading label="Carregando painel da ONG…" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex h-full flex-col bg-[var(--background)]">
        <div className="border-b border-black/[0.06] px-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={14} />
            Voltar
          </button>

          <p className="mb-1 font-display text-[13px] italic text-muted-foreground">
            Área da organização
          </p>

          <h1 className="text-[1.35rem] text-foreground">Painel da ONG</h1>
        </div>

        <div className="px-5 py-6">
          <Card>
            <EmptyState
              title="Você ainda não cadastrou uma ONG"
              hint="Cadastre sua organização para acompanhar projetos, seguidores e denúncias em um painel próprio."
              action={
                tipo === "comum" ? (
                  <button
                    onClick={() => navigate("/ongs/create")}
                    className="btn btn-primary text-sm font-semibold"
                  >
                    Cadastrar minha ONG
                  </button>
                ) : undefined
              }
            />
          </Card>
        </div>
      </div>
    );
  }

  if (dashboard.error || !dashboard.data) {
    return (
      <div className="flex h-full flex-col bg-[var(--background)]">
        <div className="border-b border-black/[0.06] px-4 pt-4 pb-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={14} />
            Voltar
          </button>
        </div>
        <DataError error={dashboard.error} onRetry={dashboard.reload} />
      </div>
    );
  }

  const { projetos, membros, denuncias } = dashboard.data;
  const counts: Record<Tab, number> = {
    projetos: projetos.length,
    seguidores: membros.length,
    denuncias: denuncias.length,
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[var(--background)]">
      {/* Capa */}
      <div className="bg-gradient-to-br from-secondary via-[#0E4C33] to-primary px-5 pb-16 pt-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/75 hover:text-white"
          >
            <ArrowLeft size={15} /> Voltar
          </button>

          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">
            +Verde · Painel da ONG
          </p>
        </div>

        <div className="mt-9 flex items-end justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-16 items-center justify-center rounded-3xl border-2 border-white/30 bg-[#1A6B44] font-display text-xl font-semibold text-white">
              {initials(ong?.nome ?? "?")}
            </div>

            <div className="min-w-0">
              <p className="truncate font-display text-lg font-semibold text-white">
                {ong?.nome}
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/70">
                <MapPin size={11} /> {ong?.regiao || "Cidade Tiradentes"}
              </p>
            </div>
          </div>

          <StatusBadge status={ong?.statusOng} map={ONG_STATUS} />
        </div>
      </div>

      {/* Estatísticas */}
      <div className="-mt-7 px-5">
        <div className="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-[0_4px_16px_rgba(12,51,34,0.08)]">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Projetos", value: num(stats?.totalProjetos) },
              { label: "Seguidores", value: num(stats?.totalMembros) },
              { label: "Denúncias", value: num(stats?.totalDenuncias) },
              { label: "Em aberto", value: num(stats?.denunciasAbertas) },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl bg-base-200/60 px-3 py-3 text-center"
              >
                <p className="font-display text-xl font-semibold text-foreground">
                  {s.value}
                </p>
                <p className="text-[10px] font-medium leading-tight text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {projetos.length > 0 && (
            <div className="mt-3 rounded-xl bg-primary/[0.07] px-3 py-2.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-primary">
                <span>Progresso médio dos projetos</span>
                <span>{stats?.percentualMedio ?? 0}%</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-primary/15">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${Math.min(100, stats?.percentualMedio ?? 0)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Aviso de análise */}
      {ong?.statusOng === "pendente" && (
        <div className="px-5 pt-4">
          <div className="flex items-start gap-2.5 rounded-xl border border-warning/25 bg-warning/10 px-3.5 py-3 text-[13px] text-warning">
            <Clock3 size={16} className="mt-0.5 shrink-0" />
            <p className="leading-relaxed">
              Sua ONG está em análise. Você já pode acompanhar este painel; a
              criação de projetos e o destaque na lista de ONGs são liberados
              após a aprovação.
            </p>
          </div>
        </div>
      )}

      {/* Abas */}
      <div className="mt-4 flex border-b border-black/[0.06] px-5">
        {TABS.map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`flex-1 border-b-2 pb-3 text-sm transition-colors ${
              tab === item.key
                ? "border-primary font-semibold text-foreground"
                : "border-transparent font-medium text-muted-foreground"
            }`}
          >
            {item.label}
            <span className="ml-1 text-[11px] text-muted-foreground">
              {counts[item.key]}
            </span>
          </button>
        ))}
      </div>

      <div className="px-5 py-4">
        {tab === "projetos" && (
          <div className="flex flex-col gap-2.5">
            {approved ? (
              <button
                type="button"
                onClick={() => {
                  setCreateError(null);
                  setCreateOpen(true);
                }}
                className="btn btn-primary btn-sm w-full text-xs font-semibold"
              >
                <Plus size={15} />
                Criar projeto
              </button>
            ) : (
              <p className="rounded-xl bg-base-200/70 px-3.5 py-3 text-[12px] leading-relaxed text-muted-foreground">
                A criação de projetos será liberada após a aprovação da ONG.
              </p>
            )}

            {projetos.length === 0 ? (
              <Card>
                <EmptyState
                  title="Nenhum projeto ainda"
                  hint={
                    approved
                      ? "Crie o primeiro projeto da sua ONG e acompanhe o progresso por aqui."
                      : "Assim que sua ONG for aprovada, você poderá criar projetos."
                  }
                />
              </Card>
            ) : (
              projetos.map((projeto) => {
                const pct = Math.round(projeto.percentualConclusao ?? 0);

                return (
                  <Card key={projeto.idProjeto} className="px-4 py-4">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Sprout size={18} strokeWidth={1.9} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {projeto.objetivo}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {ong?.nome}
                          </p>
                        </div>
                      </div>

                      <span className="font-display text-lg font-semibold text-primary">
                        {pct}%
                      </span>
                    </div>

                    {projeto.descricao && (
                      <p className="mb-3 text-[13px] leading-relaxed text-muted-foreground">
                        {projeto.descricao}
                      </p>
                    )}

                    <div className="h-1.5 overflow-hidden rounded-full bg-base-200">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {tab === "seguidores" && (
          <div className="flex flex-col gap-2.5">
            {membros.length === 0 ? (
              <Card>
                <EmptyState
                  title="Nenhum seguidor ainda"
                  hint="Quando alguém seguir sua ONG, a pessoa aparece aqui."
                />
              </Card>
            ) : (
              membros.map((membro) => {
                const nome = membro.usuario?.nome ?? "Seguidor";

                return (
                  <Card
                    key={membro.idOng_Usuario}
                    className="flex items-center gap-3 px-4 py-3.5"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-xs font-bold text-secondary-content">
                      {initials(nome)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {nome}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {membro.usuario?.email ?? "—"}
                      </p>
                    </div>

                    <UserRound size={16} className="shrink-0 text-primary" />
                  </Card>
                );
              })
            )}
          </div>
        )}

        {tab === "denuncias" && (
          <div className="flex flex-col gap-2.5">
            {denuncias.length === 0 ? (
              <Card>
                <EmptyState
                  title="Nenhuma denúncia registrada"
                  hint="Denúncias feitas pela conta da ONG aparecem aqui."
                />
              </Card>
            ) : (
              denuncias.map((denuncia: Denuncia) => (
                <Card
                  key={denuncia.idDenuncia}
                  className="flex items-center justify-between gap-3 px-4 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {denuncia.titulo}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                      <MapPin size={11} className="shrink-0 text-primary" />
                      {denuncia.area?.rua ||
                        denuncia.area?.bairro ||
                        "Cidade Tiradentes"}{" "}
                      · {denuncia.dataDenuncia}
                    </p>
                  </div>
                  <StatusBadge status={denuncia.statusDenuncia} map={DEN_STATUS} />
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal criar projeto */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 md:items-center">
          <form
            onSubmit={createProjeto}
            className="w-full max-w-md rounded-2xl bg-[var(--background)] p-5 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Novo projeto
              </h2>

              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                disabled={creating}
                aria-label="Fechar"
                className="rounded-lg p-2 text-muted-foreground hover:bg-base-200"
              >
                <X size={18} />
              </button>
            </div>

            <label className="mb-3 block">
              <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Objetivo
              </span>

              <input
                required
                maxLength={50}
                value={objetivo}
                onChange={(event) => setObjetivo(event.target.value)}
                placeholder="Ex.: Plantar 50 árvores na região"
                className="w-full rounded-xl border border-black/[0.08] bg-white px-3.5 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-primary"
              />
            </label>

            <label className="mb-4 block">
              <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Descrição
              </span>

              <textarea
                required
                rows={3}
                maxLength={100}
                value={descricao}
                onChange={(event) => setDescricao(event.target.value)}
                placeholder="Descreva os detalhes do projeto..."
                className="w-full resize-none rounded-xl border border-black/[0.08] bg-white px-3.5 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-primary"
              />
            </label>

            {createError && (
              <div className="mb-3 flex items-start gap-2 rounded-xl border border-error/25 bg-error/10 px-3.5 py-3 text-[13px] text-error">
                <TriangleAlert size={15} className="mt-0.5 shrink-0" />
                {createError}
              </div>
            )}

            <button
              type="submit"
              disabled={creating || !objetivo.trim() || !descricao.trim()}
              className="btn btn-primary w-full text-sm font-semibold disabled:opacity-60"
            >
              {creating ? "Criando…" : "Criar projeto"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
