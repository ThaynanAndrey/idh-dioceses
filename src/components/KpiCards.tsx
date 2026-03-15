import { classificarIdhm, formatarPopulacao, CORES_IDHM } from "../utils/dashboard";

interface Props {
  totalCidades: number;
  totalPopulacao: number;
  idhmMedio: number;
  numDioceses: number;
  numEstados: number;
  contexto: string;
}

export function KpiCards({
  totalCidades,
  totalPopulacao,
  idhmMedio,
  numDioceses,
  numEstados,
  contexto,
}: Props) {
  const faixa = classificarIdhm(idhmMedio);
  const cor = faixa ? CORES_IDHM[faixa] : "#718096";

  return (
    <div className="kpi-grid">
      <div className="kpi-card">
        <span className="kpi-icon">🏘️</span>
        <div className="kpi-info">
          <span className="kpi-valor">{totalCidades.toLocaleString("pt-BR")}</span>
          <span className="kpi-label">Municípios</span>
        </div>
      </div>

      <div className="kpi-card">
        <span className="kpi-icon">👥</span>
        <div className="kpi-info">
          <span className="kpi-valor">{formatarPopulacao(totalPopulacao)}</span>
          <span className="kpi-label">População (Censo 2022)</span>
        </div>
      </div>

      <div className="kpi-card">
        <span className="kpi-icon">📊</span>
        <div className="kpi-info">
          <span className="kpi-valor" style={{ color: cor }}>
            {idhmMedio.toFixed(3).replace(".", ",")}
          </span>
          <span className="kpi-label">
            IDHM Médio — <strong style={{ color: cor }}>{faixa}</strong>
          </span>
        </div>
      </div>

      <div className="kpi-card">
        <span className="kpi-icon">⛪</span>
        <div className="kpi-info">
          <span className="kpi-valor">{numDioceses}</span>
          <span className="kpi-label">Dioceses</span>
        </div>
      </div>

      {numEstados > 1 && (
        <div className="kpi-card">
          <span className="kpi-icon">🗺️</span>
          <div className="kpi-info">
            <span className="kpi-valor">{numEstados}</span>
            <span className="kpi-label">Estados</span>
          </div>
        </div>
      )}

      {contexto !== "Nordeste" && (
        <div className="kpi-card kpi-card--destaque">
          <span className="kpi-icon">📍</span>
          <div className="kpi-info">
            <span className="kpi-valor kpi-contexto">{contexto}</span>
            <span className="kpi-label">Filtro ativo</span>
          </div>
        </div>
      )}
    </div>
  );
}
