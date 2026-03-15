# IDH Dioceses — Panorama Social do Nordeste

Dashboard interativo para visualização dos indicadores de desenvolvimento humano (IDHM) dos **1.680 municípios do Nordeste brasileiro**, organizados por **dioceses católicas** e **regionais da CNBB**.

> *Dados para reflexão e ação pastoral nas comunidades.*

## Sobre o Projeto

O IDH Dioceses reúne dados públicos de desenvolvimento humano e os cruza com a estrutura eclesiástica da Igreja Católica no Nordeste, permitindo que agentes pastorais, pesquisadores e gestores identifiquem onde a ação social pode ter maior impacto.

### Funcionalidades

- **Filtros em cascata** — Regional → Estado → Diocese
- **Indicadores (KPIs)** — Total de municípios, população, IDHM médio, dioceses e estados
- **Distribuição do IDHM** — Gráfico de rosca por faixa (Muito Baixo a Muito Alto)
- **IDHM por estado e diocese** — Gráficos de barras horizontais
- **Componentes do IDHM** — Renda, Longevidade e Educação comparados
- **População** — Gráfico por estado ou diocese
- **Rankings** — Top 10 municípios mais vulneráveis e mais desenvolvidos
- **Ranking de dioceses** — IDHM médio por diocese
- **Tabela de municípios** — Busca, ordenação e paginação
- **Modo escuro** — Automático via preferência do sistema
- **Responsivo** — Layout adaptável para mobile e desktop

## Dados

| Fonte | Descrição |
|-------|-----------|
| **PNUD / IPEA / Fundação João Pinheiro** | IDHM e componentes (Atlas Brasil, Censo 2010) |
| **IBGE** | População (Censo 2022, API SIDRA, Tabela 4714) |
| **CNBB / Fontes diocesanas** | Estrutura eclesiástica (dioceses e regionais) |

### Regionais do Nordeste (CNBB)

| Regional | Estados |
|----------|---------|
| NE1 | Ceará |
| NE2 | Alagoas, Paraíba, Pernambuco, Rio Grande do Norte |
| NE3 | Bahia, Sergipe |
| NE4 | Piauí |
| NE5 | Maranhão |

## Tecnologias

- **React 19** + **TypeScript**
- **Vite** — build e dev server
- **Recharts** — gráficos interativos
- **CSS puro** — sem frameworks de estilo

## Como Executar

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Gerar build de produção
npm run build
```

## Estrutura do Projeto

```
idh-dioceses/
├── docs/
│   └── DICIONARIO-DADOS.md        # Dicionário de dados
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx           # Layout principal e lógica
│   │   ├── Filters.tsx             # Filtros (Regional/Estado/Diocese)
│   │   ├── KpiCards.tsx            # Cards de indicadores
│   │   ├── Charts.tsx              # Gráficos (Recharts)
│   │   └── CityTable.tsx           # Tabela de municípios
│   ├── data/
│   │   ├── cidades-nordeste.json   # Dataset principal (1.680 municípios)
│   │   └── dioceses-nordeste.json  # Estrutura hierárquica das dioceses
│   ├── utils/
│   │   └── dashboard.ts            # Classificação IDHM, estatísticas
│   ├── types.ts                    # Tipos TypeScript
│   ├── App.tsx                     # Componente raiz
│   ├── App.css                     # Estilos do dashboard
│   └── index.css                   # Estilos globais e variáveis CSS
└── index.html
```

## Licença

Este projeto é de uso livre para fins pastorais, acadêmicos e sociais.
