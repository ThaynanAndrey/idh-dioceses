import type { Cidade, IdhmFaixa, GroupStats } from "../types";
export type { IdhmFaixa } from "../types";

export const FAIXAS_IDHM: IdhmFaixa[] = [
  "Muito Alto",
  "Alto",
  "Médio",
  "Baixo",
  "Muito Baixo",
];

export const CORES_IDHM: Record<IdhmFaixa, string> = {
  "Muito Alto": "#059669",
  Alto: "#10b981",
  Médio: "#eab308",
  Baixo: "#f97316",
  "Muito Baixo": "#ef4444",
};

export const CORES_COMPONENTES = {
  renda: "#3b82f6",
  longevidade: "#10b981",
  educacao: "#f59e0b",
};

export const REGIONAIS_INFO: Record<string, { nome: string; cor: string }> = {
  NE1: { nome: "NE1 — Ceará", cor: "#3b82f6" },
  NE2: { nome: "NE2 — AL, PB, PE, RN", cor: "#8b5cf6" },
  NE3: { nome: "NE3 — BA, SE", cor: "#ec4899" },
  NE4: { nome: "NE4 — Piauí", cor: "#f97316" },
  NE5: { nome: "NE5 — Maranhão", cor: "#14b8a6" },
};

export function classificarIdhm(valor: number | null): IdhmFaixa | null {
  if (valor === null) return null;
  if (valor >= 0.8) return "Muito Alto";
  if (valor >= 0.7) return "Alto";
  if (valor >= 0.6) return "Médio";
  if (valor >= 0.5) return "Baixo";
  return "Muito Baixo";
}

function mediaPonderada(
  cidades: Cidade[],
  valor: (c: Cidade) => number | null
): number {
  let somaValorPop = 0;
  let somaPop = 0;
  for (const c of cidades) {
    const v = valor(c);
    if (v === null || c.populacao === null || c.populacao === 0) continue;
    somaValorPop += v * c.populacao;
    somaPop += c.populacao;
  }
  return somaPop > 0 ? somaValorPop / somaPop : 0;
}

export function calcularStats(
  cidades: Cidade[],
  chave: (c: Cidade) => string
): GroupStats[] {
  const grupos = new Map<string, Cidade[]>();
  for (const c of cidades) {
    const k = chave(c);
    if (!grupos.has(k)) grupos.set(k, []);
    grupos.get(k)!.push(c);
  }

  return Array.from(grupos.entries())
    .map(([nome, list]) => ({
      nome,
      totalCidades: list.length,
      populacao: list.reduce((s, c) => s + (c.populacao ?? 0), 0),
      idhmMedio: +mediaPonderada(list, (c) => c.idhm).toFixed(3),
      idhmRendaMedio: +mediaPonderada(list, (c) => c.idhmRenda).toFixed(3),
      idhmLongevidadeMedio: +mediaPonderada(
        list,
        (c) => c.idhmLongevidade
      ).toFixed(3),
      idhmEducacaoMedio: +mediaPonderada(
        list,
        (c) => c.idhmEducacao
      ).toFixed(3),
    }))
    .sort((a, b) => b.idhmMedio - a.idhmMedio);
}

export function contarFaixas(
  cidades: Cidade[]
): { faixa: IdhmFaixa; quantidade: number; cor: string }[] {
  const contagem: Record<IdhmFaixa, number> = {
    "Muito Alto": 0,
    Alto: 0,
    Médio: 0,
    Baixo: 0,
    "Muito Baixo": 0,
  };
  for (const c of cidades) {
    const f = classificarIdhm(c.idhm);
    if (f) contagem[f]++;
  }
  return FAIXAS_IDHM.map((faixa) => ({
    faixa,
    quantidade: contagem[faixa],
    cor: CORES_IDHM[faixa],
  }));
}

export function formatarPopulacao(n: number): string {
  if (n >= 1_000_000)
    return (n / 1_000_000).toFixed(1).replace(".", ",") + "M";
  if (n >= 1_000) return Math.round(n / 1_000).toLocaleString("pt-BR") + " mil";
  return n.toLocaleString("pt-BR");
}

export function formatarNumero(n: number): string {
  return n.toLocaleString("pt-BR");
}
