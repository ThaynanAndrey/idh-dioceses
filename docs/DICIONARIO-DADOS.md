# Dicionário de Dados — `cidades-nordeste.json`

## Descrição Geral

Arquivo JSON contendo **1.680 municípios** da região Nordeste do Brasil, organizados com informações sobre a divisão eclesiástica (Igreja Católica), indicadores de desenvolvimento humano e dados populacionais.

Os dados eclesiásticos seguem a estrutura da **CNBB** (Conferência Nacional dos Bispos do Brasil), que divide o Nordeste em **5 Regionais** (NE1 a NE5), cobrindo os **9 estados** da região.

---

## Estrutura de cada registro

```json
{
  "cidade": "Arez",
  "estado": "Rio Grande do Norte",
  "diocese": "Arquidiocese de Natal",
  "regional": "NE2",
  "idhm": 0.606,
  "idhmRenda": 0.587,
  "idhmLongevidade": 0.725,
  "idhmEducacao": 0.523,
  "populacao": 13251,
  "apelido": "Arês"
}
```

---

## Campos

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|:-----------:|-----------|
| `cidade` | `string` | Sim | Nome oficial do município. |
| `estado` | `string` | Sim | Nome completo do estado (ex: `"Ceará"`, `"Bahia"`). |
| `diocese` | `string` | Sim | Diocese ou Arquidiocese católica à qual o município pertence (ex: `"Diocese de Crato"`, `"Arquidiocese de Fortaleza"`). |
| `regional` | `string` | Sim | Sigla do Regional da CNBB: `NE1`, `NE2`, `NE3`, `NE4` ou `NE5`. |
| `idhm` | `number \| null` | Sim | Índice de Desenvolvimento Humano Municipal (IDHM) geral. Varia de 0 a 1. |
| `idhmRenda` | `number \| null` | Sim | Componente **Renda** do IDHM — mede o padrão de vida pela renda domiciliar per capita. |
| `idhmLongevidade` | `number \| null` | Sim | Componente **Longevidade** do IDHM — mede a expectativa de vida ao nascer. |
| `idhmEducacao` | `number \| null` | Sim | Componente **Educação** do IDHM — mede o acesso ao conhecimento (escolaridade da população adulta e fluxo escolar dos jovens). |
| `populacao` | `number \| null` | Sim | População residente segundo o **Censo Demográfico 2022** do IBGE. |
| `apelido` | `string` | Não | Nome alternativo do município. Presente apenas nos 20 municípios que possuem grafias diferentes na base do PNUD/IBGE em relação ao uso diocesano. |

---

## Regionais da CNBB no Nordeste

| Sigla | Nome | Estados |
|-------|------|---------|
| `NE1` | Regional Nordeste 1 | Ceará |
| `NE2` | Regional Nordeste 2 | Alagoas, Paraíba, Pernambuco, Rio Grande do Norte |
| `NE3` | Regional Nordeste 3 | Bahia, Sergipe |
| `NE4` | Regional Nordeste 4 | Piauí |
| `NE5` | Regional Nordeste 5 | Maranhão |

---

## Sobre o IDHM

O **Índice de Desenvolvimento Humano Municipal** é calculado pelo PNUD Brasil, IPEA e Fundação João Pinheiro, com base nos dados do Censo Demográfico do IBGE. Os valores neste arquivo são do **Censo 2010** — a edição mais recente disponível a nível municipal.

### Faixas de classificação

| Faixa | Valor |
|-------|-------|
| Muito alto | 0,800 – 1,000 |
| Alto | 0,700 – 0,799 |
| Médio | 0,600 – 0,699 |
| Baixo | 0,500 – 0,599 |
| Muito baixo | 0,000 – 0,499 |

### Estatísticas do Nordeste neste dataset

| Indicador | Valor |
|-----------|-------|
| Total de municípios | 1.680 |
| Com IDHM | 1.678 |
| Sem IDHM (`null`) | 2 |
| Menor IDHM | 0,452 |
| Maior IDHM | 0,788 |
| IDHM médio | 0,592 |

---

## Sobre a População

Os dados de população são provenientes do **Censo Demográfico 2022** do IBGE, extraídos via API SIDRA (Tabela 4714 — "População Residente, Área territorial e Densidade demográfica").

### Estatísticas populacionais neste dataset

| Indicador | Valor |
|-----------|-------|
| Com população | 1.678 |
| Sem população (`null`) | 2 |
| População total (cidades listadas) | 53.655.022 |
| Município mais populoso | Fortaleza (CE) — 2.428.708 |
| Município menos populoso | Parari (PB) — 1.720 |

---

## Valores `null`

Dois municípios possuem os campos de IDHM e `populacao` com valor `null`:

- **Tabuleiro** (Paraíba) — não consta como município autônomo no Censo 2010 nem no Censo 2022.
- **Várzea Alegre** (Paraíba) — possivelmente um erro no dado diocesano original (o município de Várzea Alegre existe no Ceará, não na Paraíba).

---

## Campo `apelido`

Vinte municípios possuem o campo `apelido`, que indica o nome utilizado na base de dados do PNUD/IBGE (Censo 2010) quando este difere do nome empregado pela diocese. Exemplos:

| `cidade` (nome diocesano) | `apelido` (nome no PNUD/IBGE) | Estado |
|---------------------------|-------------------------------|--------|
| Arez | Arês | Rio Grande do Norte |
| Boa Saúde | Januário Cicco | Rio Grande do Norte |
| Governador Lomanto Júnior | Barro Preto | Bahia |
| Itamaracá | Ilha de Itamaracá | Pernambuco |
| Joca Claudino | Santarém | Paraíba |
| Serra Caiada | Presidente Juscelino | Rio Grande do Norte |

---

## Fontes

- **Dados eclesiásticos**: Wikipedia (pt), sites oficiais das dioceses e da CNBB (cnbb.org.br), documento vaticano AAS 2005.
- **IDHM 2010**: Atlas do Desenvolvimento Humano no Brasil (atlasbrasil.org.br) — PNUD Brasil, IPEA e Fundação João Pinheiro. Página de ranking: [undp.org/pt/brazil/idhm-municipios-2010](https://www.undp.org/pt/brazil/idhm-municipios-2010).
- **População (Censo 2022)**: IBGE — Censo Demográfico 2022, Tabela 4714 (API SIDRA). Endpoint: `https://apisidra.ibge.gov.br/values/t/4714/n6/in%20n2%202/v/93/p/2022`.
