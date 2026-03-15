export interface Cidade {
  cidade: string;
  estado: string;
  diocese: string;
  regional: string;
  idhm: number | null;
  idhmRenda: number | null;
  idhmLongevidade: number | null;
  idhmEducacao: number | null;
  populacao: number | null;
  apelido?: string;
}

export type IdhmFaixa =
  | "Muito Alto"
  | "Alto"
  | "Médio"
  | "Baixo"
  | "Muito Baixo";

export interface GroupStats {
  nome: string;
  totalCidades: number;
  populacao: number;
  idhmMedio: number;
  idhmRendaMedio: number;
  idhmLongevidadeMedio: number;
  idhmEducacaoMedio: number;
}

export interface Filtros {
  regional: string;
  estado: string;
  diocese: string;
  busca: string;
}
