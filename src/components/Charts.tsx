import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import type { GroupStats, IdhmFaixa } from "../types";
import {
  CORES_IDHM,
  CORES_COMPONENTES,
  classificarIdhm,
} from "../utils/dashboard";

/* ──────── Donut: Distribuição por Faixa ──────── */

interface DistProps {
  dados: { faixa: string; quantidade: number; cor: string }[];
  total: number;
}

const RADIAN = Math.PI / 180;

function renderLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  faixa,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) {
  if (percent < 0.03) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 1.45;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="var(--text-primary)"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {faixa} ({(percent * 100).toFixed(0)}%)
    </text>
  );
}

export function DistribuicaoDonut({ dados, total }: DistProps) {
  const ativos = dados.filter((d) => d.quantidade > 0);
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={ativos}
            dataKey="quantidade"
            nameKey="faixa"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={110}
            paddingAngle={2}
            label={renderLabel}
          >
            {ativos.map((d) => (
              <Cell key={d.faixa} fill={d.cor} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: unknown, name: unknown) => [
              `${value} cidades (${((Number(value) / total) * 100).toFixed(1)}%)`,
              String(name),
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ──────── Barra: IDHM por grupo ──────── */

interface BarGroupProps {
  dados: GroupStats[];
  layout?: "horizontal" | "vertical";
  height?: number;
}

function barColor(valor: number): string {
  const f = classificarIdhm(valor);
  return f ? CORES_IDHM[f as IdhmFaixa] : "#94a3b8";
}

function calcDomain(dados: GroupStats[]): [number, number] {
  if (!dados.length) return [0, 1];
  const values = dados.map((d) => d.idhmMedio);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = (max - min) * 0.3 || 0.02;
  return [
    Math.max(0, +(min - padding).toFixed(2)),
    Math.min(1, +(max + padding).toFixed(2)),
  ];
}

export function IdhmBarChart({
  dados,
  layout = "horizontal",
  height = 350,
}: BarGroupProps) {
  const sorted = [...dados].sort((a, b) => a.idhmMedio - b.idhmMedio);
  const domain = calcDomain(sorted);

  if (layout === "horizontal") {
    return (
      <div className="chart-container">
        <ResponsiveContainer
          width="100%"
          height={Math.max(height, sorted.length * 36)}
        >
          <BarChart
            data={sorted}
            layout="vertical"
            margin={{ left: 20, right: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              type="number"
              domain={domain}
              tickFormatter={(v) => v.toFixed(3).replace(".", ",")}
              stroke="var(--text-muted)"
              fontSize={11}
            />
            <YAxis
              type="category"
              dataKey="nome"
              width={160}
              stroke="var(--text-muted)"
              fontSize={11}
              tick={{ fill: "var(--text-secondary)" }}
            />
            <Tooltip
              formatter={(value: unknown) => [
                Number(value).toFixed(3).replace(".", ","),
                "IDHM Médio",
              ]}
              contentStyle={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 13,
              }}
            />
            <Bar dataKey="idhmMedio" radius={[0, 4, 4, 0]}>
              {sorted.map((d) => (
                <Cell key={d.nome} fill={barColor(d.idhmMedio)} />
              ))}
              <LabelList
                dataKey="idhmMedio"
                position="right"
                formatter={(v: number) => v.toFixed(3).replace(".", ",")}
                style={{
                  fill: "var(--text-secondary)",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={sorted} margin={{ bottom: 60, top: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="nome"
            stroke="var(--text-muted)"
            fontSize={11}
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fill: "var(--text-secondary)" }}
          />
          <YAxis
            domain={domain}
            tickFormatter={(v) => v.toFixed(3).replace(".", ",")}
            stroke="var(--text-muted)"
            fontSize={11}
          />
          <Tooltip
            formatter={(value: unknown) => [
              Number(value).toFixed(3).replace(".", ","),
              "IDHM Médio",
            ]}
            contentStyle={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 13,
            }}
          />
          <Bar dataKey="idhmMedio" radius={[4, 4, 0, 0]}>
            {sorted.map((d) => (
              <Cell key={d.nome} fill={barColor(d.idhmMedio)} />
            ))}
            <LabelList
              dataKey="idhmMedio"
              position="top"
              formatter={(v: number) => v.toFixed(3).replace(".", ",")}
              style={{
                fill: "var(--text-secondary)",
                fontSize: 10,
                fontWeight: 700,
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ──────── Barra Agrupada: Componentes do IDHM ──────── */

interface CompProps {
  dados: GroupStats[];
}

export function ComponentesChart({ dados }: CompProps) {
  const sorted = [...dados].sort((a, b) =>
    a.nome.localeCompare(b.nome, "pt-BR")
  );

  const allValues = sorted.flatMap((d) => [
    d.idhmRendaMedio,
    d.idhmLongevidadeMedio,
    d.idhmEducacaoMedio,
  ]);
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const padding = (max - min) * 0.2 || 0.02;
  const domain: [number, number] = [
    Math.max(0, +(min - padding).toFixed(2)),
    Math.min(1, +(max + padding).toFixed(2)),
  ];

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={380}>
        <BarChart data={sorted} margin={{ bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="nome"
            stroke="var(--text-muted)"
            fontSize={11}
            angle={-35}
            textAnchor="end"
            height={80}
            tick={{ fill: "var(--text-secondary)" }}
          />
          <YAxis
            domain={domain}
            tickFormatter={(v) => v.toFixed(3).replace(".", ",")}
            stroke="var(--text-muted)"
            fontSize={11}
          />
          <Tooltip
            formatter={(value: unknown, name: unknown) => [
              Number(value).toFixed(3).replace(".", ","),
              String(name),
            ]}
            contentStyle={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 13,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 13, paddingTop: 8 }} />
          <Bar
            dataKey="idhmRendaMedio"
            name="Renda"
            fill={CORES_COMPONENTES.renda}
            radius={[3, 3, 0, 0]}
          />
          <Bar
            dataKey="idhmLongevidadeMedio"
            name="Longevidade"
            fill={CORES_COMPONENTES.longevidade}
            radius={[3, 3, 0, 0]}
          />
          <Bar
            dataKey="idhmEducacaoMedio"
            name="Educação"
            fill={CORES_COMPONENTES.educacao}
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ──────── Barra: População por grupo ──────── */

interface PopProps {
  dados: GroupStats[];
}

export function PopulacaoChart({ dados }: PopProps) {
  const sorted = [...dados].sort((a, b) => b.populacao - a.populacao);

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={sorted} margin={{ bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="nome"
            stroke="var(--text-muted)"
            fontSize={11}
            angle={-35}
            textAnchor="end"
            height={80}
            tick={{ fill: "var(--text-secondary)" }}
          />
          <YAxis
            stroke="var(--text-muted)"
            fontSize={12}
            tickFormatter={(v) =>
              v >= 1_000_000
                ? (v / 1_000_000).toFixed(0) + "M"
                : v >= 1_000
                  ? (v / 1_000).toFixed(0) + "K"
                  : v
            }
          />
          <Tooltip
            formatter={(value: unknown) => [
              Number(value).toLocaleString("pt-BR") + " hab.",
              "População",
            ]}
            contentStyle={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 13,
            }}
          />
          <Bar dataKey="populacao" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
