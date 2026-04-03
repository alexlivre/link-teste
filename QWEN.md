# INKPAGE — QWEN.md

> Ferramenta rápida e limpa para criar links de WhatsApp e encurtar URLs.

---

## Visão Geral

O **INKPAGE** é uma aplicação web full-stack (SPA Vue.js + Backend Express) que oferece:

1. **Gerador de Links WhatsApp** — criação instantânea de URLs `wa.me` com validação de telefone brasileiro e formatação automática.
2. **Encurtador de Links** — geração de slugs customizáveis com sistema de pastas via hash SHA256.
3. **Motor de Redirecionamento 301** — com sistema de cotas (diária/semanal/mensal), detecção de bots e analytics.
4. **Painel Administrativo** — dashboard com métricas em tempo real, gráficos Chart.js, gestão de links/pastas, autenticação mock e ferramentas de controle.

O projeto é desenvolvido localmente e planejado para migração para **Cloudflare Workers/Pages/D1/KV** (Fases 05 e 06 ainda não implementadas).

### Status das Fases

| Fase | Descrição | Status |
|------|-----------|--------|
| 01 | Fundações Vue.js (SPA, Tailwind, localStorage) | ✅ Concluída |
| 02 | Backend Local API (Express, JSON Storage) | ✅ Concluída |
| 03 | Motor de Redirecionamento (Cotas, Analytics) | ✅ Concluída |
| 04 | Painel Administrativo (Dashboard, Chart.js, Auth) | ✅ Concluída |
| 05 | Migração Cloudflare Workers/Pages/D1/KV | 🔄 Pendente |
| 06 | Produção (SEO, Cloudflare Access, Monitoring) | 🔄 Pendente |

---

## Stack Tecnológica

### Frontend
- **Vue.js 3** — Composition API, lazy-loaded views
- **Vue Router 4** — SPA com navegação sem reload
- **Tailwind CSS** — Design system com paleta vibrante (purple, blue, pink, coral, emerald, cyan) + Forest/Gold
- **Vite 5** — Build tool com code splitting (vendor, router)
- **Axios** — Cliente HTTP para APIs backend
- **Chart.js + vue-chartjs** — Gráficos interativos no dashboard

### Backend
- **Node.js + Express** — Servidor REST local
- **CORS** — Configuração para `localhost:3000`
- **JSON Storage** — Persistência em arquivos (`backend/data/`)
- **Crypto** — Hashes SHA256 para pastas
- **node-cron** (simulado) — Reset automático de contadores

### Futuro (Fases 05-06)
- Cloudflare Workers, Pages, D1, KV, Access (Zero Trust)

---

## Estrutura do Projeto

```
link/
├── backend/
│   ├── server.js                 # Entry point (Express)
│   ├── config/database.js        # Configuração JSON storage
│   ├── controllers/              # Controllers REST (links, folders, analytics, admin)
│   ├── middleware/               # CORS, Logger, ErrorHandler, RedirectHandler
│   ├── routes/                   # Rotas: links, folders, analytics, admin
│   ├── services/                 # Lógica de negócio (LinkService, FolderService, ResetService)
│   ├── validators/               # Validações de input
│   ├── utils/                    # Utilitários
│   ├── data/                     # Arquivos JSON (links.json, folders.json, analytics.json)
│   └── docs/                     # Documentação da API
├── src/
│   ├── App.vue                   # Componente raiz
│   ├── main.js                   # Entry point Vue (createApp + router)
│   ├── views/
│   │   ├── Home.vue
│   │   ├── WhatsApp.vue
│   │   ├── LinkShortener.vue
│   │   ├── FolderManager.vue
│   │   ├── AnalyticsDashboard.vue
│   │   └── admin/
│   │       └── AdminLogin.vue (+ rotas admin dinâmicas)
│   ├── components/               # Componentes reutilizáveis
│   ├── composables/              # Hooks reutilizáveis (estado, polling)
│   ├── services/                 # HttpClient (Axios), LinkService, FolderService
│   ├── composables/              # Hooks reutilizáveis
│   ├── router/                   # Vue Router config + adminRoutes.js
│   ├── utils/                    # Utilitários (WhatsApp generator, formatters)
│   ├── validators/               # Validações client-side
│   ├── interfaces/               # Interfaces/conceitos
│   └── assets/
│       └── styles.css            # CSS global + tokens
├── test-automation/
│   ├── scripts/                  # Scripts de teste
│   ├── reports/                  # Relatórios JSON
│   └── TEST_LOG.md               # Log contínuo de testes
├── spec.md                       # Especificação completa do produto (PRD + SRS)
├── spec-fase-0[1-6].md           # Specs individuais por fase
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── eslint.config.js
```

---

## Comandos Principais

### Desenvolvimento

```bash
# Apenas frontend (localhost:3000)
npm run dev

# Apenas backend (localhost:3001)
npm run dev:server

# Frontend + Backend simultâneos
npm run dev:full

# Build para produção
npm run build

# Preview do build
npm run preview
```

### Testes

```bash
# Testes unitários do WhatsApp
npm test

# Todos os testes
npm run test:all

# Testes da API backend
npm run test:api
```

### Linting

```bash
# Verificar lint
npm run lint

# Corrigir automaticamente
npm run lint:fix
```

---

## Arquitetura e Princípios

O projeto segue rigorosamente três prioridades:

1. **Clean Code** (#1) — Funções < 20 linhas, nomes significativos, sem duplicação.
2. **SOLID** (#2) — Single Responsibility, Open/Closed, Dependency Inversion.
3. **Clean Architecture** (#3) — Camadas independentes, domínio livre de frameworks.

### Padrões Observados

- **Funções pequenas** — Toda função visa ter < 20 linhas com responsabilidade única.
- **Componentes Vue** — Views com lazy loading (`() => import(...)`), composables para lógica compartilhada.
- **API RESTful** — Endpoints padrão: `POST /api/links`, `GET /api/folder/:hash`, `DELETE /api/links/:id`, `GET /api/admin/*`.
- **JSON Storage** — `backend/data/links.json`, `folders.json`, `analytics.json` simulam banco de dados.
- **Redirecionamento** — Middleware `/:slug` busca no cache JSON, verifica cotas, retorna 301 ou 429.
- **Admin Auth** — Mock com usuário `admin` / senha `admin123`, token JWT simulado em localStorage.
- **Polling** — Dashboard admin atualiza métricas a cada 10 segundos automaticamente.

---

## APIs Backend (Resumo)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/health` | Health check do servidor |
| `GET` | `/:slug` | Redirecionamento 301 (ou 429 se cota esgotada) |
| `POST` | `/api/links` | Criar link encurtado |
| `GET` | `/api/links` | Listar todos os links (com paginação) |
| `DELETE` | `/api/links/:id` | Excluir link |
| `GET` | `/api/folder/:hash` | Listar links de uma pasta |
| `GET` | `/api/analytics/dashboard` | Métricas para dashboard |
| `POST` | `/api/admin/login` | Login admin (mock) |
| `GET` | `/api/admin/stats` | Estatísticas admin |
| `POST` | `/api/admin/ban-folder` | Banir pasta por hash |
| `POST` | `/api/admin/reset-counters` | Resetar contadores |

---

## Configuração Tailwind

O design system usa uma paleta vibrante com extensões customizadas:

- **Forest** — `#7fa88f` (toques orgânicos)
- **Gold** — `#d4a574` (Golden Hour)
- **Purple** — `#9333ea` (elétrico)
- **Blue** — `#3b82f6`
- **Pink** — `#ec4899`
- **Coral** — `#f97316`
- **Emerald** — `#10b981`
- **Cyan** — `#06b6d4`
- **Fontes** — Inter (sans), JetBrains Mono (mono)
- **Animações** — fade-in, slide-in, scale-in
- **Shadows coloridas** — `shadow-purple`, `shadow-blue`, `shadow-pink`, etc.

---

## Métricas do Projeto

### Objetivos de Negócio
- **Primária:** ≥ 10.000 redirecionamentos/mês
- **Secundária 1:** Taxa de conversão ≥ 15%
- **Secundária 2:** < 90.000 req/dia (limite gratuito Cloudflare)

### Performance
- Redirecionamento < 100ms
- Bundle < 100KB gzipped
- Lighthouse score > 90

### Testes
- 100% de aprovação em todos os scripts de teste
- Cobertura: WhatsApp Generator (7 testes), Setup (5), LocalStorage (5)

---

## Regras Globais de Desenvolvimento

### [RULE-001] Idioma de Codificação vs. Comunicação
- **Código-fonte, comentários e commits**: sempre em **Inglês**.
- **Interações no chat**: sempre em **Português (Brasil)**.
- Nunca responda em Inglês no chat — mesmo se a pergunta for em Inglês.

### [RULE-002] Sequência de Desenvolvimento
**Ordem obrigatória**:
1. **Clean Code** — Nomes significativos, funções pequenas (< 20 linhas), sem duplicação, legibilidade.
2. **SOLID** — Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion.
3. **Clean Architecture** — Camadas independentes, dependências invertidas, testabilidade.

> Considere usar a skill `clean-code-solid-clean-architecture` quando aplicável.

### [RULE-003] Atualização de Documentação
**Gatilhos**: novos recursos, mudanças arquiteturais, correções críticas, atualizações de dependências, conclusão de fases.

**Validação** (só é "concluído" quando):
1. Código funcional e testado.
2. Documentação no `README.md` atualizada.
3. Roadmap reflete estado atual.
4. Sem regressões.

**Status**: ✅ Concluído | 🔄 Em Progresso | 📋 Planejado | ⚠️ Pendente | 🚫 Cancelado

> Sempre confirmar: *"✅ Recurso finalizado e documentado no README.md."*

### [RULE-004] Testes Automatizados Obrigatórios
**Estrutura**:
```
test-automation/
├── scripts/
├── reports/
└── TEST_LOG.md
```

**Processo com correção**:
1. Executar todos os testes.
2. Se houver erros → corrigir → executar novamente → repetir até passar.
3. Tipos obrigatórios: unitários, integração, regressão.

**Relatório (`TEST_LOG.md`)**:
- Data, total de testes, passaram/falharam, cobertura.
- Lista de resultados (✅/❌).
- Ciclo de correção com horários e ações.
- Status final (APROVADO/REPROVADO).

**Critérios de aprovação**:
- Todos os testes passam (0 falhas).
- Cobertura mínima: 70%.
- Nenhuma regressão.
- Ciclo de correção completo.

> Não entregar código com testes falhando. Só prosseguir quando TODOS os testes passarem.

### [RULE-005] ESLint Obrigatório
- Sempre usar **ESLint** em qualquer código JavaScript/Vue.js do projeto.
- Antes de criar uma configuração nova, **verificar se já existe alguma regra ou configuração de ESLint** no repositório.
- Se já existir configuração, **respeitar e seguir as regras existentes**.
- Se **não existir**, criar a configuração seguindo as **melhores práticas** do projeto.
- Sempre **testar se está funcionando** após criar ou alterar a configuração.
- Sempre **corrigir quaisquer erros** encontrados pelo ESLint antes de considerar a tarefa concluída.
- Se houver conflito entre regras, priorizar a configuração existente, ajustando apenas o necessário.

### [RULE-006] Sequência de Desenvolvimento (Detalhada)
**Ordem obrigatória para TODO desenvolvimento**:

1. **CLEAN CODE** (Primeiro)
   - Nomes significativos que explicam o propósito
   - Funções pequenas — cada função faz UMA coisa (máx. 20 linhas)
   - Sem duplicação — DRY
   - Simplicidade — KISS
   - Legibilidade — código fácil de ler e entender

2. **SOLID** (Depois do Clean Code)
   - **S**ingle Responsibility — uma classe = uma responsabilidade
   - **O**pen/Closed — aberto para extensão, fechado para modificação
   - **L**iskov Substitution — subtipos substituíveis
   - **I**nterface Segregation — interfaces pequenas e específicas
   - **D**ependency Inversion — depender de abstrações, não implementações

3. **CLEAN ARCHITECTURE** (Por último)
   - Camadas independentes: Domínio → Aplicação → Infraestrutura
   - Dependências invertidas: camadas internas NÃO conhecem externas
   - Testabilidade: tudo deve ser facilmente testável
   - Independência: domínio livre de frameworks e detalhes

> Esta regra complementa a RULE-002 com mais detalhamento. Considere a skill `clean-code-solid-clean-architecture`.

### [RULE-007] Ciclo de Teste Contínuo
**Protocolo de Execução**:
- Realizar testes obrigatoriamente a **cada alteração** no código-fonte.
- Antes de testar, ler o arquivo de relatório de testes para compreender procedimentos e formato esperado.
- Nenhuma tarefa deve ser considerada "concluída" sem que os testes tenham sido executados com sucesso.

**Relatório de Alteração**:
- Após cada ciclo de teste, atualizar o log de resultados conforme padronizado.
- Se um teste falhar, priorizar a **correção imediata** antes de prosseguir.

**Validação**:
- Validar se o ambiente de teste está pronto antes da primeira bateria do dia.
- Comunicar o status do teste (Pass/Fail) em **Português** no chat após a execução.

### [RULE-008] Atualização de README e Roadmap
**Sincronização do README**:
- Sempre que houver **adição de novos recursos** ou conclusão de uma **fase**, o `README.md` deve ser atualizado obrigatoriamente.
- **Conteúdo da atualização**:
  - Listar o novo recurso na seção de funcionalidades.
  - Atualizar o status da "Fase" correspondente.
  - Refletir alterações em requisitos ou instruções de instalação.

**Validação de Entrega**:
- Uma tarefa só é considerada finalizada se o código estiver funcional **e** o `README.md` refletir o estado atual.

> Informar ao usuário após a atualização: *"Recurso/Fase finalizado e documentado no README.md."*

---

## Convenções de Desenvolvimento

1. **Ordem obrigatória de prioridades:** Clean Code → SOLID → Clean Architecture (ver RULE-002, RULE-006).
2. **Testes após CADA alteração** — executar e registrar resultados em `test-automation/TEST_LOG.md` (ver RULE-004, RULE-007).
3. **Componentes < 100 linhas** — dividir quando exceder.
4. **Sem segredos hardcoded** — usar environment variables.
5. **Sanitização de inputs** — prevenir XSS e injeção tanto no frontend quanto no backend.
6. **Documentar código quando necessário** — JSDoc para funções não óbvias.
7. **Código em Inglês, chat em Português** (ver RULE-001).
8. **Atualizar documentação após mudanças** — README.md incluso (ver RULE-003, RULE-008).
9. **ESLint sempre passing** — corrigir erros antes de concluir (ver RULE-005).

---

## Próximos Passos (Fase 05)

A Fase 05 prevê a migração para Cloudflare:

- Adaptar backend Express para **Cloudflare Workers** API
- Migrar JSON storage para **D1** (SQL) e **KV** (cache/contadores)
- Deploy do frontend Vue.js em **Cloudflare Pages**
- Configurar domínio `inkpage.com.br` com SSL
- Usar **Wrangler CLI** para desenvolvimento e deploy local

> **Nota:** A Fase 05 ainda não foi iniciada. Os arquivos de spec (`spec-fase-05.md`, `spec-fase-06.md`) contêm a especificação completa para quando a migração começar.

---

## Links Úteis

- **Spec principal:** `spec.md` (PRD + SRS completo)
- **Specs por fase:** `spec-fase-01.md` até `spec-fase-06.md`
- **Log de testes:** `test-automation/TEST_LOG.md`
- **README completo:** `README.md`
