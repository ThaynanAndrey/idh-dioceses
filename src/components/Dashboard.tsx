import { useState, useMemo } from "react";
import cidadesData from "../data/cidades-nordeste.json";
import type { Cidade, Filtros } from "../types";
import { calcularStats, contarFaixas } from "../utils/dashboard";
import { Filters } from "./Filters";
import { KpiCards } from "./KpiCards";
import {
  DistribuicaoDonut,
  IdhmBarChart,
  ComponentesChart,
  PopulacaoChart,
} from "./Charts";
import { CityTable } from "./CityTable";

const allCidades = cidadesData as Cidade[];

export function Dashboard() {
  const [filtros, setFiltros] = useState<Filtros>({
    regional: "",
    estado: "",
    diocese: "",
    busca: "",
  });

  const opcoesFiltro = useMemo(() => {
    const regionais = [...new Set(allCidades.map((c) => c.regional))].sort();

    let baseEstados = allCidades;
    if (filtros.regional)
      baseEstados = baseEstados.filter((c) => c.regional === filtros.regional);
    const estados = [...new Set(baseEstados.map((c) => c.estado))].sort();

    let baseDioceses = baseEstados;
    if (filtros.estado)
      baseDioceses = baseDioceses.filter((c) => c.estado === filtros.estado);
    const dioceses = [...new Set(baseDioceses.map((c) => c.diocese))].sort();

    return { regionais, estados, dioceses };
  }, [filtros.regional, filtros.estado]);

  const cidadesFiltradas = useMemo(() => {
    let result = allCidades;
    if (filtros.regional)
      result = result.filter((c) => c.regional === filtros.regional);
    if (filtros.estado)
      result = result.filter((c) => c.estado === filtros.estado);
    if (filtros.diocese)
      result = result.filter((c) => c.diocese === filtros.diocese);
    return result;
  }, [filtros.regional, filtros.estado, filtros.diocese]);

  const contexto = useMemo(() => {
    if (filtros.diocese) return filtros.diocese;
    if (filtros.estado) return filtros.estado;
    if (filtros.regional) return filtros.regional;
    return "Nordeste";
  }, [filtros]);

  const kpis = useMemo(() => {
    let somaIdhmPop = 0;
    let somaPop = 0;
    let totalPop = 0;
    for (const c of cidadesFiltradas) {
      totalPop += c.populacao ?? 0;
      if (c.idhm !== null && c.populacao !== null && c.populacao > 0) {
        somaIdhmPop += c.idhm * c.populacao;
        somaPop += c.populacao;
      }
    }
    return {
      totalCidades: cidadesFiltradas.length,
      totalPopulacao: totalPop,
      idhmMedio: somaPop > 0 ? somaIdhmPop / somaPop : 0,
      numDioceses: new Set(cidadesFiltradas.map((c) => c.diocese)).size,
      numEstados: new Set(cidadesFiltradas.map((c) => c.estado)).size,
    };
  }, [cidadesFiltradas]);

  const distribuicao = useMemo(
    () => contarFaixas(cidadesFiltradas),
    [cidadesFiltradas]
  );

  const statsPorEstado = useMemo(
    () => calcularStats(cidadesFiltradas, (c) => c.estado),
    [cidadesFiltradas]
  );

  const statsPorDiocese = useMemo(
    () => calcularStats(cidadesFiltradas, (c) => c.diocese),
    [cidadesFiltradas]
  );

  const dadosComponentes = useMemo(() => {
    if (filtros.diocese || (statsPorEstado.length <= 1 && !filtros.regional)) {
      return statsPorDiocese;
    }
    if (filtros.estado || statsPorEstado.length <= 3) {
      return statsPorDiocese.slice(0, 15);
    }
    return statsPorEstado;
  }, [filtros, statsPorEstado, statsPorDiocese]);

  const cidadesMaisVulneraveis = useMemo(() => {
    return [...cidadesFiltradas]
      .filter((c) => c.idhm !== null)
      .sort((a, b) => a.idhm! - b.idhm!)
      .slice(0, 10);
  }, [cidadesFiltradas]);

  const cidadesMaisDesenvolvidas = useMemo(() => {
    return [...cidadesFiltradas]
      .filter((c) => c.idhm !== null)
      .sort((a, b) => b.idhm! - a.idhm!)
      .slice(0, 10);
  }, [cidadesFiltradas]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Panorama Social do Nordeste</h1>
          <p className="subtitle">
            Dados para reflexão e ação pastoral nas comunidades
          </p>
        </div>
      </header>

      <main className="dashboard-main">
        <Filters
          filtros={filtros}
          onChange={setFiltros}
          regionais={opcoesFiltro.regionais}
          estados={opcoesFiltro.estados}
          dioceses={opcoesFiltro.dioceses}
        />

        <KpiCards
          {...kpis}
          contexto={contexto}
        />

        {/* Seção: Classificação do IDH */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Classificação do Desenvolvimento Humano</h2>
            <p>
              O IDHM classifica os municípios em cinco faixas, de "Muito Baixo"
              a "Muito Alto". Essa visão revela onde a ação pastoral pode fazer
              mais diferença.
            </p>
          </div>
          <div className="chart-grid-2">
            <div className="card">
              <h3>Distribuição por Faixa</h3>
              <DistribuicaoDonut
                dados={distribuicao}
                total={cidadesFiltradas.filter((c) => c.idhm !== null).length}
              />
            </div>
            <div className="card">
              <h3>IDHM Médio por Estado</h3>
              {statsPorEstado.length > 1 ? (
                <IdhmBarChart
                  dados={statsPorEstado}
                  height={statsPorEstado.length * 40 + 40}
                />
              ) : (
                <IdhmBarChart
                  dados={statsPorDiocese.slice(0, 12)}
                  height={Math.max(350, statsPorDiocese.slice(0, 12).length * 36 + 40)}
                />
              )}
            </div>
          </div>
        </section>

        {/* Seção: Os Três Pilares */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Os Três Pilares do Desenvolvimento</h2>
            <p>
              O IDHM é composto por <strong>Renda</strong> (padrão de vida),{" "}
              <strong>Longevidade</strong> (saúde) e{" "}
              <strong>Educação</strong> (acesso ao conhecimento). Identificar o
              pilar mais fraco ajuda a direcionar esforços pastorais.
            </p>
          </div>
          <div className="card">
            <ComponentesChart dados={dadosComponentes} />
          </div>
        </section>

        {/* Seção: População */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>População por {statsPorEstado.length > 1 ? "Estado" : "Diocese"}</h2>
            <p>
              Compreender a distribuição populacional ajuda a dimensionar o
              alcance e o impacto da atuação pastoral em cada território.
            </p>
          </div>
          <div className="card">
            <PopulacaoChart
              dados={statsPorEstado.length > 1 ? statsPorEstado : statsPorDiocese.slice(0, 15)}
            />
          </div>
        </section>

        {/* Seção: Rankings */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Municípios em Destaque</h2>
            <p>
              Os municípios com os menores índices pedem atenção especial. Os
              mais desenvolvidos podem servir de referência para boas práticas.
            </p>
          </div>
          <div className="chart-grid-2">
            <div className="card card--vulneravel">
              <h3>⚠️ Cidades Mais Vulneráveis</h3>
              <p className="card-desc">
                Menores IDHM — prioridade para ação social
              </p>
              <div className="ranking-list">
                {cidadesMaisVulneraveis.map((c, i) => (
                  <div className="ranking-item" key={c.cidade + c.estado}>
                    <span className="ranking-pos">{i + 1}º</span>
                    <div className="ranking-info">
                      <span className="ranking-nome">{c.cidade}</span>
                      <span className="ranking-detalhe">
                        {c.estado} · {c.diocese}
                      </span>
                    </div>
                    <span className="ranking-valor ranking-valor--baixo">
                      {c.idhm!.toFixed(3).replace(".", ",")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card card--destaque">
              <h3>🌟 Cidades Mais Desenvolvidas</h3>
              <p className="card-desc">
                Maiores IDHM — referências de boas práticas
              </p>
              <div className="ranking-list">
                {cidadesMaisDesenvolvidas.map((c, i) => (
                  <div className="ranking-item" key={c.cidade + c.estado}>
                    <span className="ranking-pos">{i + 1}º</span>
                    <div className="ranking-info">
                      <span className="ranking-nome">{c.cidade}</span>
                      <span className="ranking-detalhe">
                        {c.estado} · {c.diocese}
                      </span>
                    </div>
                    <span className="ranking-valor ranking-valor--alto">
                      {c.idhm!.toFixed(3).replace(".", ",")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Seção: Ranking das Dioceses */}
        {statsPorDiocese.length > 1 && (
          <section className="dashboard-section">
            <div className="section-header">
              <h2>Ranking das Dioceses</h2>
              <p>
                Comparativo do IDHM médio entre as dioceses. Cada barra representa
                a média dos municípios que compõem a diocese.
              </p>
            </div>
            <div className="card">
              <IdhmBarChart
                dados={statsPorDiocese}
                height={statsPorDiocese.length * 32 + 40}
              />
            </div>
          </section>
        )}

        {/* Seção: Tabela de Cidades */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Consulte sua Cidade</h2>
            <p>
              Encontre os dados de qualquer município. Use a busca para
              localizar uma cidade específica. Clique nos cabeçalhos para
              ordenar.
            </p>
          </div>
          <div className="card">
            <CityTable
              cidades={cidadesFiltradas}
              busca={filtros.busca}
              onBuscaChange={(v) => setFiltros((f) => ({ ...f, busca: v }))}
            />
          </div>
        </section>
      </main>

      <footer className="dashboard-footer">
        <p>
          Fontes: IBGE (Censo 2022) · PNUD/IPEA/FJP (IDHM 2010) · CNBB
          (Regionais) · Dioceses
        </p>
      </footer>
    </div>
  );
}
