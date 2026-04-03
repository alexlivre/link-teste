# INKPAGE_FASE-04_SPEC_v1.0.md

# 0) Metadados
- Projeto: INKPAGE (inkpage.com.br)
- Fase: 04 - Painel Admin com Vue.js
- Versão: 1.0
- Data: 03/04/2026
- Status (draft/review/final): draft
- Público: IA desenvolvedora (vibe coding) + stakeholders (Alex)
- Stack: Vue.js 3 + Chart.js/ou similar + Componentes Admin + APIs Protegidas
- Resumo em 2 linhas: Especificação para criar painel administrativo completo com dashboard reativo, gestão de links/pastas, métricas em tempo real e ferramentas de administração local.

# 1) Visão (PRD)
## 1.1 Objetivo e problema
**Objetivo:** Implementar painel administrativo completo com dashboard de métricas, gestão de links e pastas, visualização de analytics e ferramentas de controle total para o mantenedor.
**Problema:** Administrador precisa de interface centralizada para monitorar uso, gerenciar conteúdo e exercer controle total sobre o sistema local.

## 1.2 Público-alvo (personas)
1. **Administrador (Alex):** Precisa de visão completa do sistema, métricas detalhadas, gestão de conteúdo e ferramentas de controle.
2. **Desenvolvedor:** Precisa de interface para testar funcionalidades admin e validar fluxos de gestão.

## 1.3 Métricas de sucesso (1 primária + 2 secundárias)
- **Primária:** Painel admin funcional 100% com todas as métricas e ferramentas de gestão.
- **Secundária 1:** Dashboard com gráficos reativos atualizados em tempo real.
- **Secundária 2:** Interface intuitiva permitindo gestão completa sem necessidade de acesso direto ao backend.

## 1.4 Não-metas (por que NÃO fazer agora)
- Sistema de autenticação real (simulado localmente).
- Integração com Cloudflare Access.
- Permissões granulares por usuário.
- Exportação de relatórios.

# 2) Escopo
## 2.1 MVP (no escopo)
1. **Dashboard Principal:** Vue.js com cards de métricas principais (total links, cliques hoje, links ativos).
2. **Gráficos Interativos:** Chart.js ou similar para visualização de cliques por dia/hora.
3. **Gestão de Links:** Tabela com todos os links, busca, filtros, ações (editar/excluir).
4. **Gestão de Pastas:** Visualização de pastas por hash, estatísticas agregadas.
5. **Analytics Detalhados:** Tabela com eventos de cliques, filtros por data, referer.
6. **Ferramentas de Admin:** Botões para banir pasta, resetar contadores, limpar analytics.
7. **Busca e Filtros:** Busca por slug, URL, hash; filtros por data, status.
8. **Estado em Tempo Real:** Atualização automática das métricas via polling.
9. **Interface Responsiva:** Layout adaptado para desktop (foco administrativo).
10. **Simulação de Autenticação:** Login simples mock para proteger área admin.

## 2.2 Fora do escopo (agora)
- Sistema de usuários e permissões.
- Autenticação real (OAuth, 2FA).
- Exportação de dados (CSV, PDF).
- Notificações por email.
- API externa para admin.

## 2.3 Assunções (com risco e como mudar depois)
- **ASSUNÇÃO 01 (Risco: Baixo)**
  - Decisão: Chart.js para gráficos.
  - Por que: Simples, leve, bom ecossistema Vue.js.
  - Risco: Limitações em gráficos complexos.
  - Mitigação: Implementar gráficos básicos primeiro.
  - Como mudar depois: Migrar para D3.js ou similar se necessário.

- **ASSUNÇÃO 02 (Risco: Baixo)**
  - Decisão: Simulação de autenticação local.
  - Por que: Simplicidade para desenvolvimento, preparação para Cloudflare Access.
  - Risco: Diferenças com sistema real.
  - Mitigação: Manter interface compatível com headers do Access.
  - Como mudar depois: Integrar com Cloudflare Access.

- **ASSUNÇÃO 03 (Risco: Médio)**
  - Decisão: Layout desktop-first para painel admin.
  - Por que: Foco administrativo em desktop, mais espaço para métricas.
  - Risco: Usabilidade em mobile limitada.
  - Mitigação: Interface responsiva básica.
  - Como mudar depois: Otimizar para mobile se necessário.

## 2.4 Perguntas em aberto (máx. 10; se vazio, escrever "Nenhuma")
1. Qual intervalo de atualização do dashboard (5s, 10s, 30s)?
2. Deve incluir simulação de diferentes níveis de permissão?
3. Qual nível de detalhe nos analytics (IP, user-agent completo)?
4. Deve ter dark mode para o painel admin?

# 3) UX e Fluxos
## 3.1 Jornada principal (passo a passo)
1. **Acesso ao Admin:** Usuário acessa `/admin`, faz login simulado.
2. **Dashboard Overview:** Visualiza métricas principais e gráficos.
3. **Navegação por Seções:** Menu lateral para Links, Pastas, Analytics, Configurações.
4. **Gestão de Links:** Lista todos os links, busca, filtra, exclui.
5. **Visualização de Pasta:** Busca por hash, vê todos os links da pasta.
6. **Analytics Detalhados:** Filtra cliques por período, vê detalhes.
7. **Ações Admin:** Bane pasta, reseta contadores, limpa dados.

## 3.2 Fluxos alternativos e falhas
- **Login Falha:** Mensagem de erro, tentativa novamente.
- **Dados Não Carregam:** Indicador de loading + retry automático.
- **Ação Falha:** Toast de erro com opção de tentar novamente.
- **Conflito de Dados:** Indicador de dados desatualizados, refresh.
- **Bulk Actions:** Seleção múltipla para exclusão em lote.

## 3.3 Estados (carregando/vazio/erro/sucesso)
- **Carregando:** Skeletons para cards e gráficos, spinners em tabelas.
- **Vazio:** Mensagens "Nenhum link criado", "Sem dados no período".
- **Erro:** Alertas específicos "Erro ao carregar métricas", "Falha na ação".
- **Sucesso:** Toast "Link excluído", "Pasta banida", "Contadores resetados".
- **Offline:** Indicador de conexão perdida com retry.

## 3.4 Microcopy crítica (mensagens e rótulos)
- **Título Dashboard:** "Painel Administrativo INKPAGE"
- **Cards Métricas:** "Total de Links", "Cliques Hoje", "Links Ativos", "Pastas Criadas"
- **Menu Navegação:** "Dashboard", "Links", "Pastas", "Analytics", "Configurações"
- **Botões Ação:** "Excluir", "Banir Pasta", "Resetar Contadores", "Limpar Analytics"
- **Confirmar Ação:** "Tem certeza que deseja banir esta pasta? Todos os links serão desativados."
- **Status Links:** "Ativo", "Inativo", "Cota Esgotada", "Banido"
- **Filtros:** "Período:", "Status:", "Buscar por slug..."

# 4) Requisitos (SRS)
## 4.1 Requisitos funcionais
### RF-020
- Heading: Dashboard Principal com Métricas
- Descrição (testável): Componente Vue.js `<AdminDashboard>` com cards mostrando total links, cliques hoje, links ativos, pastas criadas, atualizados via polling.
- Prioridade (Must/Should/Could): Must
- Racional: Visão geral imediata do sistema.
- Dependências: APIs de métricas do backend.
- Método de verificação (um): Demonstração
- Critérios de aceitação (Given/When/Then):
  - Dado que acesso `/admin` após login,
  - Quando o dashboard carrega,
  - Então vejo cards com números atualizados.
  - E os valores atualizam automaticamente a cada 10 segundos.
- Notas: Usar Vue composables para polling automático.

### RF-021
- Heading: Gráficos Interativos de Cliques
- Descrição (testável): Integração com Chart.js para exibir gráfico de barras com cliques por dia nos últimos 7 dias e gráfico de linhas com cliques por hora nas últimas 24h.
- Prioridade (Must/Should/Could): Must
- Racional: Visualização temporal do uso do sistema.
- Dependências: RF-020, analytics backend.
- Método de verificação (um): Demonstração
- Critérios de aceitação (Given/When/Then):
  - Dado que estou no dashboard,
  - Quando visualizo os gráficos,
  - Então vejo barras para cliques diários e linhas para horários.
  - E os gráficos atualizam com novos dados.
- Notas: Usar vue-chartjs para integração Vue.js.

### RF-022
- Heading: Gestão de Links com Tabela
- Descrição (testável): Componente `<LinksTable>` com lista paginada de todos os links, busca por slug/URL, filtros por status, e ações de exclusão individual.
- Prioridade (Must/Should/Could): Must
- Racional: Gestão completa do conteúdo.
- Dependências: APIs de links do backend.
- Método de verificação (um): Teste
- Critérios de aceitação (Given/When/Then):
  - Dado que acesso a seção Links,
  - Quando a tabela carrega,
  - Então vejo lista com slug, URL, cliques, status.
  - E posso buscar, filtrar e excluir links.
- Notas: Usar tabela virtualizada para performance.

### RF-023
- Heading: Gestão de Pastas por Hash
- Descrição (testável): Interface para buscar pasta por hash SHA256, visualizar todos os links associados, estatísticas agregadas e opção de banir pasta inteira.
- Prioridade (Must/Should/Could): Must
- Racional: Controle sobre grupos de links.
- Dependências: APIs de pastas do backend.
- Método de verificação (um): Teste
- Critérios de aceitação (Given/When/Then):
  - Dado que busco uma pasta pelo hash,
  - Quando a pasta é encontrada,
  - Então vejo todos os links e estatísticas.
  - E posso banir a pasta com confirmação.
- Notas: Banir pasta desativa todos os links associados.

### RF-024
- Heading: Analytics Detalhados com Filtros
- Descrição (testável): Tabela com eventos de cliques detalhados (timestamp, referer, user-agent), filtros por período, busca por referer, e exportação básica.
- Prioridade (Must/Should/Could): Should
- Racional: Análise detalhada do tráfego.
- Dependências: Analytics backend.
- Método de verificação (um): Demonstração
- Critérios de aceitação (Given/When/Then):
  - Dado que acesso a seção Analytics,
  - Quando aplico filtros de data,
  - Então vejo apenas cliques do período.
  - E posso buscar por referer específico.
- Notas: Paginação para grandes volumes de dados.

### RF-025
- Heading: Ferramentas de Administração
- Descrição (testável): Painel com botões para ações admin: resetar contadores de um link, limpar analytics antigos, banir pasta, desativar link, com confirmações.
- Prioridade (Must/Should/Could): Must
- Racional: Controle total sobre o sistema.
- Dependências: APIs admin do backend.
- Método de verificação (um): Teste
- Critérios de aceitação (Given/When/Then):
  - Dado que seleciono um link,
  - Quando clico em "Resetar Contadores",
  - Então vejo modal de confirmação.
  - E após confirmar, os contadores zeram.
- Notas: Todas as ações exigem confirmação explícita.

### RF-026
- Heading: Simulação de Autenticação
- Descrição (testável): Login simples com usuário/senha mock (admin/admin123) que protege rotas admin e simula headers de autenticação futuros.
- Prioridade (Must/Should/Could): Should
- Racional: Preparação para Cloudflare Access.
- Dependências: Vue Router guards.
- Método de verificação (um): Teste
- Critérios de aceitação (Given/When/Then):
  - Dado que tento acessar `/admin` sem login,
  - Quando sou redirecionado para página de login,
  - Então preencho credenciais corretas.
  - E sou redirecionado para o dashboard.
- Notas: Usar localStorage para token mock.

### RF-027
- Heading: Atualização em Tempo Real
- Descrição (testável): Sistema de polling que atualiza métricas do dashboard a cada X segundos e mostra indicadores de "dados atualizados".
- Prioridade (Must/Should/Could): Should
- Racional: Informações sempre atualizadas.
- Dependências: RF-020, RF-021.
- Método de verificação (um): Demonstração
- Critérios de aceitação (Given/When/Then):
  - Dado que estou no dashboard,
  - Quando alguém acessa um link externamente,
  - Então os contadores atualizam em até 10 segundos.
  - E vejo indicador "Atualizado agora".
- Notas: Usar composables para gerenciar polling.

## 4.2 Requisitos não funcionais
### RNF-010 Performance Admin
- Requisitos:
  1. Dashboard carrega em < 2 segundos.
  2. Tabelas suportam até 1000 itens sem lag.
  3. Gráficos renderizam em < 500ms.
- Critérios de aceitação:
  - Lighthouse performance > 85 para admin.
  - Interações respondem em < 200ms.
- Método de verificação: Análise com DevTools.

### RNF-011 Usabilidade Admin
- Requisitos:
  1. Interface intuitiva sem necessidade de treinamento.
  2. Feedback claro para todas as ações.
  3. Atalhos de teclado para ações comuns.
- Critérios de aceitação:
  - Novo usuário consegue executar tarefas básicas.
  - Todas as ações têm feedback visual.
- Método de verificação: Testes de usabilidade.

### RNF-012 Segurança Admin
- Requisitos:
  1. Todas as ações críticas exigem confirmação.
  2. Logs de auditoria para ações admin.
  3. Proteção contra CSRF básica.
- Critérios de aceitação:
  - Não é possível executar ação acidentalmente.
  - Logs registram todas as ações admin.
- Método de verificação: Inspeção de código e logs.

# 5) Dados (conceitual, sem implementação)
## 5.1 Entidades e campos (nível conceitual)
- **Admin User (Mock):**
  - `username` (String): "admin"
  - `password` (String): "admin123" (hash)
  - `token` (String): JWT mock para localStorage
- **Dashboard Metrics:**
  - `total_links` (Number): Total de links criados.
  - `clicks_today` (Number): Cliques no dia atual.
  - `active_links` (Number): Links ativos.
  - `total_folders` (Number): Pastas criadas.
- **Admin Action Log:**
  - `id` (Number): ID único.
  - `action` (String): Tipo de ação.
  - `target` (String): Alvo da ação.
  - `timestamp` (String): Quando ocorreu.
  - `admin_user` (String): Quem executou.

## 5.2 Regras, validações e integridade
- Apenas usuário autenticado pode acessar rotas `/admin/*`.
- Todas as ações de exclusão exigem confirmação.
- Logs de auditoria são imutáveis.
- Token mock expira em 24 horas.

## 5.3 Dados sensíveis, retenção e auditoria
- **Sensíveis:** Senhas (hash), URLs em analytics.
- **Retenção:** Logs admin mantidos por 90 dias.
- **Auditoria:** Todas as ações admin registradas.

# 6) Integrações (contratos narrativos)
- **INT-009 Chart.js + Vue.js**
  - Objetivo: Visualização de dados em gráficos.
  - Entradas: Arrays de dados (labels, valores).
  - Saídas: Componentes de gráfico renderizados.
  - Erros esperados: Dados malformados, render errors.
  - Autenticação: Nenhuma.

- **INT-010 Vue Router Guards**
  - Objetivo: Proteção de rotas administrativas.
  - Entradas: Requisição de navegação.
  - Saídas: Redirecionamento ou permissão.
  - Erros esperados: Token inválido, expirado.
  - Autenticação: Simulação local.

- **INT-011 Admin APIs Backend**
  - Objetivo: Endpoints para gestão admin.
  - Entradas: Requisições autenticadas.
  - Saídas: Dados de gestão e resultados de ações.
  - Erros esperados: Permissão negada, recurso não encontrado.
  - Autenticação: Token mock no header.

# 7) Estratégia de testes
## 7.1 Cenários mínimos do MVP
1. Login no painel admin com credenciais corretas.
2. Visualizar dashboard com métricas atualizadas.
3. Interagir com gráficos de cliques.
4. Buscar e filtrar links na tabela.
5. Excluir um link com confirmação.
6. Banir uma pasta inteira.
7. Visualizar analytics detalhados.
8. Resetar contadores de um link.

## 7.2 Casos de borda
- Tentativa de acesso sem autenticação.
- Token expirado durante sessão.
- Dados não carregam (erro de API).
- Ação admin falha (erro de backend).
- Grande volume de dados na tabela.

## 7.3 Critério de aceite do release
A Fase 04 está pronta quando:
- Login admin funciona corretamente.
- Dashboard exibe todas as métricas.
- Todas as ações de gestão funcionam.
- Interface é responsiva e intuitiva.
- Logs de auditoria são gerados.

# 8) Plano de execução para vibe coding
## 8.1 Ordem de construção (fatias finas)
1. **Setup Admin Router e Layout:**
   - Configurar rotas `/admin/*`.
   - Criar layout base com menu lateral.
   - Implementar guards de autenticação.

2. **Sistema de Login Mock:**
   - Formulário de login.
   - Geração de token mock.
   - Proteção de rotas.

3. **Dashboard Principal:**
   - Cards de métricas.
   - API de métricas no backend.
   - Polling para atualização.

4. **Gráficos com Chart.js:**
   - Instalação e configuração.
   - Gráfico de cliques diários.
   - Gráfico de cliques horários.

5. **Gestão de Links:**
   - Tabela com dados paginados.
   - Busca e filtros.
   - Ações de exclusão.

6. **Gestão de Pastas e Analytics:**
   - Interface de busca por hash.
   - Tabela de analytics detalhados.
   - Ferramentas admin.

## 8.2 Checkpoints por etapa
- **Pós-Setup:** Layout admin carregando, rotas protegidas.
- **Pós-Login:** Sistema de autenticação mock funcionando.
- **Pós-Dashboard:** Métricas carregando e atualizando.
- **Pós-Gráficos:** Visualizações interativas funcionando.
- **Pós-Gestão:** Links e pastas gerenciáveis.
- **Pós-Polimento:** Sistema admin completo e robusto.

## 8.3 Prompt pack operacional
- **Objetivo do build:** Implementar [Componente/Funcionalidade] conforme spec-fase-04.md.
- **Restrições:**
  - Interface desktop-first para admin.
  - Todas as ações críticas exigem confirmação.
  - Performance otimizada para grandes volumes.
  - Feedback claro para todas as interações.
- **Definição de pronto:**
  - Funcionalidade testada no navegador.
  - Interface responsiva e intuitiva.
  - Logs de auditoria gerados.
- **Como validar:**
  1. Testar fluxo completo de login.
  2. Verificar todas as ações admin.
  3. Testar responsividade.
  4. Verificar logs de auditoria.
- **Como registrar mudanças:**
  - Atualizar changelog da fase.

# 9) Riscos e mitigação
- **Risco:** Complexidade da interface admin. **Mitigação:** Componentização, design system consistente.
- **Risco:** Performance com grande volume de dados. **Mitigação:** Paginação, virtualização, lazy loading.
- **Risco:** Segurança da simulação de autenticação. **Mitigação:** Token mock com expiração, preparação para Access.

# 10) Checklists
## 10.1 Pronto para implementar
- [x] Interface admin desenhada
- [x] Fluxos de gestão mapeados
- [x] APIs admin especificadas
- [x] Sistema de autenticação planejado
- [x] Métricas e visualizações definidas

## 10.2 Segurança do vibe coding
- [x] Proteção de rotas admin
- [x] Confirmação para ações críticas
- [x] Logs de auditoria implementados
- [x] Validação de inputs admin

# 11) Decisões e Changelog
## 11.1 Decisões
- **DEC-013:** Chart.js para visualizações por simplicidade e ecossistema Vue.js.
- **DEC-014:** Layout desktop-first para foco administrativo.
- **DEC-015:** Simulação de autenticação para preparação Cloudflare Access.
- **DEC-016:** Polling para atualizações por simplicidade vs WebSocket.

## 11.2 Changelog
- v0.1: documento inicial da fase 04
- v1.0: especificação completa com painel admin, gestão e métricas
