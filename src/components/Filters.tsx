import type { Filtros } from "../types";

interface Props {
  filtros: Filtros;
  onChange: (f: Filtros) => void;
  regionais: string[];
  estados: string[];
  dioceses: string[];
}

export function Filters({ filtros, onChange, regionais, estados, dioceses }: Props) {
  const atualizar = (campo: keyof Filtros, valor: string) => {
    const novo = { ...filtros, [campo]: valor };
    if (campo === "regional") {
      novo.estado = "";
      novo.diocese = "";
    }
    if (campo === "estado") {
      novo.diocese = "";
    }
    onChange(novo);
  };

  const limpar = () => onChange({ regional: "", estado: "", diocese: "", busca: "" });
  const temFiltro = filtros.regional || filtros.estado || filtros.diocese;

  return (
    <div className="filters">
      <div className="filters-selects">
        <div className="filter-group">
          <label htmlFor="f-regional">Regional</label>
          <select
            id="f-regional"
            value={filtros.regional}
            onChange={(e) => atualizar("regional", e.target.value)}
          >
            <option value="">Todas as Regionais</option>
            {regionais.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="f-estado">Estado</label>
          <select
            id="f-estado"
            value={filtros.estado}
            onChange={(e) => atualizar("estado", e.target.value)}
          >
            <option value="">Todos os Estados</option>
            {estados.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="f-diocese">Diocese</label>
          <select
            id="f-diocese"
            value={filtros.diocese}
            onChange={(e) => atualizar("diocese", e.target.value)}
          >
            <option value="">Todas as Dioceses</option>
            {dioceses.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {temFiltro && (
          <button className="btn-limpar" onClick={limpar}>
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  );
}
