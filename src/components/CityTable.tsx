import { useState, useMemo } from "react";
import type { Cidade } from "../types";
import type { IdhmFaixa } from "../types";
import { classificarIdhm, CORES_IDHM } from "../utils/dashboard";

interface Props {
  cidades: Cidade[];
  busca: string;
  onBuscaChange: (v: string) => void;
}

type SortKey = "cidade" | "estado" | "diocese" | "idhm" | "populacao";
type SortDir = "asc" | "desc";

const POR_PAGINA = 25;

export function CityTable({ cidades, busca, onBuscaChange }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("cidade");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [pagina, setPagina] = useState(0);

  const filtradas = useMemo(() => {
    if (!busca.trim()) return cidades;
    const termo = busca
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return cidades.filter((c) => {
      const nome = c.cidade
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return nome.includes(termo);
    });
  }, [cidades, busca]);

  const ordenadas = useMemo(() => {
    const mul = sortDir === "asc" ? 1 : -1;
    return [...filtradas].sort((a, b) => {
      if (sortKey === "idhm") {
        return mul * ((a.idhm ?? -1) - (b.idhm ?? -1));
      }
      if (sortKey === "populacao") {
        return mul * ((a.populacao ?? -1) - (b.populacao ?? -1));
      }
      return (
        mul *
        (a[sortKey] as string).localeCompare(b[sortKey] as string, "pt-BR")
      );
    });
  }, [filtradas, sortKey, sortDir]);

  const totalPaginas = Math.ceil(ordenadas.length / POR_PAGINA);
  const paginadas = ordenadas.slice(
    pagina * POR_PAGINA,
    (pagina + 1) * POR_PAGINA
  );

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "idhm" || key === "populacao" ? "desc" : "asc");
    }
    setPagina(0);
  };

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return " ↕";
    return sortDir === "asc" ? " ↑" : " ↓";
  };

  return (
    <div className="city-table-wrapper">
      <div className="table-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar município..."
            value={busca}
            onChange={(e) => {
              onBuscaChange(e.target.value);
              setPagina(0);
            }}
          />
        </div>
        <span className="table-count">
          {ordenadas.length.toLocaleString("pt-BR")} município
          {ordenadas.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="table-scroll">
        <table className="city-table">
          <thead>
            <tr>
              <th onClick={() => toggleSort("cidade")}>
                Município{sortIcon("cidade")}
              </th>
              <th onClick={() => toggleSort("estado")}>
                Estado{sortIcon("estado")}
              </th>
              <th onClick={() => toggleSort("diocese")}>
                Diocese{sortIcon("diocese")}
              </th>
              <th className="th-num" onClick={() => toggleSort("idhm")}>
                IDHM{sortIcon("idhm")}
              </th>
              <th className="th-num">Faixa</th>
              <th className="th-num" onClick={() => toggleSort("populacao")}>
                População{sortIcon("populacao")}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginadas.map((c) => {
              const faixa = classificarIdhm(c.idhm);
              const cor = faixa ? CORES_IDHM[faixa as IdhmFaixa] : undefined;
              return (
                <tr key={c.cidade + c.estado}>
                  <td className="td-cidade">
                    {c.cidade}
                    {c.apelido && (
                      <span className="apelido" title={`Nome IBGE: ${c.apelido}`}>
                        *
                      </span>
                    )}
                  </td>
                  <td>{c.estado}</td>
                  <td>{c.diocese}</td>
                  <td className="td-num">
                    {c.idhm !== null ? c.idhm.toFixed(3).replace(".", ",") : "—"}
                  </td>
                  <td className="td-num">
                    {faixa && (
                      <span className="faixa-badge" style={{ background: cor }}>
                        {faixa}
                      </span>
                    )}
                  </td>
                  <td className="td-num">
                    {c.populacao !== null
                      ? c.populacao.toLocaleString("pt-BR")
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPaginas > 1 && (
        <div className="pagination">
          <button
            disabled={pagina === 0}
            onClick={() => setPagina((p) => p - 1)}
          >
            ← Anterior
          </button>
          <span>
            Página {pagina + 1} de {totalPaginas}
          </span>
          <button
            disabled={pagina >= totalPaginas - 1}
            onClick={() => setPagina((p) => p + 1)}
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  );
}
