# INKPAGE

Ferramenta rápida e limpa para criar links de WhatsApp e encurtar URLs.

## 🚀 Visão

Ser a ferramenta mais rápida e limpa para criar links de WhatsApp e encurtar URLs, crescendo organicamente até 10k acessos/mês.

## 📋 Funcionalidades

### Fase 01 - Fundações Locais (✅ Concluída)
- **Gerador de Links WhatsApp**: Crie links instantaneamente com validação de telefone brasileiro e formatação automática
- **Navegação SPA**: Experiência fluida sem reloads com Vue Router e menu responsivo
- **Interface Responsiva**: Design mobile-first com Tailwind CSS e componentes acessíveis
- **Estado Local Persistente**: Histórico de links gerados, preferências e recuperação automática via localStorage
- **Validações Client-side**: Tempo real para telefone, mensagem e feedback visual de erros
- **Histórico de Links**: Últimos 5 links gerados com opção de copiar rapidamente
- **Testes Automatizados**: 100% de cobertura das funcionalidades core com testes contínuos

### Fase 02 - Backend Local API com Vue.js (✅ Concluída)
- **Mock Server Node.js**: Servidor Express local com APIs REST funcionais
- **API de Criação de Links**: POST `/api/links` com validação, geração de slug e hash SHA256
- **Sistema de Pastas SHA256**: Gestão de pastas com hash único para agrupar links
- **API de Gestão Completa**: GET `/api/folder/:hash`, DELETE `/api/links/:id`
- **Armazenamento JSON Persistente**: Arquivos JSON simulando banco de dados
- **Integração Frontend-Backend**: Axios + serviços Vue.js consumindo APIs mock
- **Validações Backend**: Validação de slug único, formato URL, sanitização de inputs
- **Error Handling**: Tratamento padronizado de erros com feedback visual
- **Contadores de Cliques**: Analytics básico de cliques por link
- **Sistema de Hash Persistente**: localStorage + backend mantendo última pasta usada

### Fase 04 - Painel Administrativo Local (✅ Concluída)
- **🔐 Sistema de Autenticação Mock**: Login admin (admin/admin123) com token JWT simulado
- **📊 Dashboard Administrativo**: Métricas em tempo real com cards interativos e polling automático
- **📈 Gráficos Interativos**: Chart.js integrado com gráficos de barras e linhas para analytics
- **🔗 Gestão de Links**: Busca, filtros, paginação e ações de reset/exclusão em massa
- **📁 Gestão de Pastas**: Busca por hash SHA256, visualização de links associados e banimento
- **📋 Analytics Detalhados**: Tabela completa de eventos com filtros por data, referer e user agent
- **⚙️ Ferramentas Admin**: Reset de contadores, limpeza de analytics, exportação de dados
- **🎨 Layout Desktop-First**: Menu lateral fixo, interface profissional e responsiva
- **🛡️ Proteção de Rotas**: Guards de autenticação e redirecionamento automático
- **🔄 Polling Automático**: Atualização de métricas a cada 10 segundos sem reload
- **� APIs Backend**: Endpoints admin completos (/api/admin/*) com autenticação
- **📋 Cópia de Credenciais**: Botões para copiar usuário, senha ou credenciais completas com feedback visual

### Fase UI/UX - Design System Vibrante & Colorido (✅ Concluída)
- **🎨 Paleta de Cores Vibrantes**: Roxo Elétrico, Azul, Coral, Rosa, Esmeralda, Ciano
- **✨ Glass Effect Moderno**: Headers e footers com backdrop blur e transparência
- **🌈 Gradientes Coloridos**: Hero gradients, text gradients, botões gradientes
- **💫 Animações Vivas**: Pulse glow, float, bounce soft, shimmer effects
- **🎯 Design System Completo**: Tokens CSS atualizados, novas sombras coloridas
- **🔥 Interface Premium**: Cards elevados, badges vibrantes, CTAs coloridos
- **📱 Responsividade Avançada**: Mobile-first otimizado com navegação suave
- **♿ Acessibilidade**: Focus rings coloridos, contrastes otimizados, tema claro vibrante

### Fase UI/UX - Design System Premium (🔄 Anterior)
- ~~Sistema de Design Completo~~ → **Atualizado para Design Vibrante**
- ~~Identidade Visual Única~~ → **Renovado com Cores Vivas**
- ~~Interface Premium~~ → **Agora com Glass Effect e Gradientes**
- ~~Micro-interações~~ → **Animações ainda mais suaves**

## 🛠️ Stack Tecnológica

### Backend (Fase 02)
- **Node.js + Express** - Servidor HTTP e APIs REST
- **CORS** - Configuração para desenvolvimento
- **JSON Storage** - Persistência local em arquivos
- **Crypto** - Geração de hashes SHA256
- **Axios** - Cliente HTTP para frontend

### Frontend
- **Vue.js 3** - Framework reativo moderno
- **Vue Router** - Navegação SPA
- **Tailwind CSS** - Design system utilitário com tema customizado
- **Vite** - Build tool rápido
- **Composition API** - Estado reativo local
- **Design Tokens** - Sistema de design consistente
- **Micro-interactions** - Animações e transições suaves

### Futuro
- **Cloudflare Workers** - Backend serverless em produção
- **Cloudflare KV** - Cache de alta performance
- **Cloudflare D1** - Banco de dados SQL
- **Cloudflare Pages** - Hosting estático

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Clonar repositório
git clone <repository-url>
cd link

# Instalar dependências
npm install

# Iniciar apenas frontend
npm run dev

# Iniciar apenas backend
npm run dev:server

# Iniciar frontend + backend simultaneamente
npm run dev:full
```

### Scripts
```bash
npm run dev         # Frontend apenas (localhost:3000)
npm run dev:server  # Backend apenas (localhost:3001)
npm run dev:full    # Frontend + Backend simultâneos
npm run build       # Build para produção
npm run preview     # Preview do build
npm test            # Testes unitários do WhatsApp
npm run test:api    # Testes das APIs backend
npm run test:all    # Todos os testes
```

## 🧪 Testes

O projeto segue um ciclo de testes contínuo obrigatório com 100% de cobertura:

### Testes Atuais
- ✅ **WhatsApp Generator**: 7 testes unitários (limpeza, validação, geração de links)
- ✅ **Setup do Projeto**: 5 testes de validação (arquivos, estrutura, dependências)
- ✅ **LocalStorage e Estado**: 5 testes (composables, persistência, integração)

### Executar Testes
```bash
# Testes unitários do WhatsApp
npm test

# Todos os testes (recomendado)
npm run test:all

# Teste específico
node test-automation/scripts/test-whatsapp-generator.js
node test-automation/scripts/test-local-storage.js
```

### Relatórios
- Logs completos em `test-automation/TEST_LOG.md`
- Relatóros JSON em `test-automation/reports/latest-report.json`
- 100% de aprovação em todos os testes desde o início

## 📁 Estrutura do Projeto

```
inkpage/
├── backend/                 # Servidor Express (Fase 02)
│   ├── server.js           # Entry point do servidor
│   ├── config/             # Configurações
│   ├── controllers/        # Controllers REST
│   ├── middleware/         # Middlewares (CORS, Logger, Error Handler)
│   ├── routes/             # Rotas da API
│   ├── services/           # Serviços de negócio
│   ├── utils/              # Utilitários
│   ├── validators/         # Validações
│   ├── data/               # Arquivos JSON (links.json, folders.json)
│   └── docs/               # Documentação da API
├── src/
│   ├── components/         # Componentes Vue.js
│   ├── views/              # Páginas da aplicação
│   ├── services/           # Serviços frontend (HttpClient, Link, Folder)
│   ├── composables/        # Hooks reutilizáveis
│   ├── utils/              # Utilitários
│   └── assets/             # Estilos e imagens
├── test-automation/
│   ├── scripts/            # Scripts de teste
│   ├── reports/            # Relatórios de teste
│   └── TEST_LOG.md         # Log de testes contínuos
├── public/                 # Arquivos estáticos
└── dist/                   # Build de produção
```

## 🎯 Fases de Desenvolvimento

### ✅ Fase 02 - Backend Local API com Vue.js (Concluída)
- Setup Vue.js + Tailwind CSS + Vite
- Mock Server Node.js com Express
- APIs REST completas (POST, GET, DELETE)
- Sistema de pastas SHA256 com hash único
- Armazenamento JSON persistente
- Integração Axios frontend-backend
- Validações backend (URL, slug único)
- Error handling padronizado
- Views Vue.js atualizadas (LinkShortener, FolderManager)
- Clean Code, SOLID principles aplicados

### ✅ Fase UI/UX - Design System Premium (Concluída)
- Sistema de Design Completo com tokens CSS
- Identidade Visual: Minimalismo Tecnológico + Toques Orgânicos
- Paleta de cores: Forest (verde) + Gold (dourado) + neutros sofisticados
- Interface Premium com backdrop blur e gradientes
- Micro-interações suaves e animações elegantes
- Hero Section impactante com badges e CTAs premium
- Componentes refinados com ícones e hover effects
- Responsividade avançada mobile-first
- Acessibilidade completa (focus, contrastes, navegação)

### ✅ Fase 03 - Motor de Redirecionamento (Concluída)
- **Middleware de Redirecionamento 301**: Performance < 100ms com cache em memória
- **Sistema de Cotas Básico**: Diário (1000), Semanal (5000), Mensal (15000) com bloqueio 429
- **Analytics Simples**: Registro de cliques com timestamp, referer, user-agent
- **Cache em Memória**: Map para lookup rápido com persistência JSON a cada 30s
- **Dashboard Vue.js**: Visualização em tempo real com polling a cada 5 segundos
- **Detecção de Bots**: Identificação automática (Googlebot, FacebookBot, etc.) sem contar em cotas
- **Reset Automático**: Job periódico para zerar contadores diários/semanais/mensais
- **Tratamento de Erros**: Páginas 404/429 amigáveis e respostas JSON para API

## 🏗️ Arquitetura

O projeto segue rigorosamente:

1. **Clean Code** (Prioridade #1)
   - Funções < 20 linhas
   - Nomes significativos
   - Sem duplicação

2. **SOLID** (Prioridade #2)
   - Single Responsibility
   - Open/Closed Principle
   - Dependency Inversion

3. **Clean Architecture** (Prioridade #3)
   - Camadas independentes
   - Domínio livre de frameworks
   - Testabilidade garantida

## 📊 Métricas

### Objetivos
- **Primária**: ≥ 10.000 redirecionamentos/mês
- **Secundária 1**: Taxa de conversão ≥ 15%
- **Secundária 2**: < 90.000 req/dia (limite gratuito Cloudflare)

### Performance
- Tempo de resposta < 100ms
- Bundle size < 100KB gzipped
- Lighthouse score > 90

## 🤝 Contribuição

1. Siga a ordem obrigatória: Clean Code → SOLID → Clean Architecture
2. Execute testes após CADA alteração
3. Atualize TEST_LOG.md com os resultados
4. Mantenha componentes < 100 linhas
5. Documente código quando necessário

## 📄 Licença

MIT License - veja arquivo LICENSE para detalhes.

---

**Status Atual**: Fases 01, 02, UI/UX, 03 e 04 Concluídas ✅  
**Próxima Fase**: Fase 05 - Migração para Cloudflare Workers  
**Última Atualização**: 03/04/2026  
**Testes**: 100% aprovação - Painel Admin completo com autenticação, dashboard, gráficos  
**Design**: Sistema vibrante completo com painel administrativo profissional
