# INKPAGE_FASE-03_SPEC_v1.0.md

# 0) Metadados
- Projeto: INKPAGE (inkpage.com.br)
- Fase: 03 - Motor de Redirecionamento com Vue.js
- Versão: 1.0
- Data: 03/04/2026
- Status (draft/review/final): draft
- Público: IA desenvolvedora (vibe coding) + stakeholders (Alex)
- Stack: Vue.js 3 + Node.js Express + Middleware Local + Contadores em Memória
- Resumo em 2 linhas: Especificação para implementar motor de redirecionamento funcional local com sistema de cotas básico, analytics simulado e integração Vue.js para visualização em tempo real.

# 1) Visão (PRD)
## 1.1 Objetivo e problema
**Objetivo:** Implementar core business de redirecionamento de URLs com sistema de cotas, analytics básico e visualização em tempo real via Vue.js.
**Problema:** Links encurtados precisam efetivamente redirecionar para URLs de destino, com controle de uso e métricas básicas para o administrador.

## 1.2 Público-alvo (personas)
1. **Desenvolvedor (Alex):** Precisa testar motor de redirecionamento, validar sistema de cotas e preparar arquitetura para Cloudflare Workers.
2. **Usuário Final:** Precisa que seus links encurtados funcionem corretamente e vejam estatísticas básicas de uso.

## 1.3 Métricas de sucesso (1 primária + 2 secundárias)
- **Primária:** Redirecionamento 301 funcional com latência < 100ms localmente.
- **Secundária 1:** Sistema de cotas bloqueando acessos quando limites atingidos.
- **Secundária 2:** Analytics básicos registrando e exibindo cliques em tempo real.

## 1.4 Não-metas (por que NÃO fazer agora)
- Sistema de cotas complexo em cascata.
- Analytics avançados com geolocalização.
- Performance otimizada para produção.
- Integração com banco de dados real.

# 2) Escopo
## 2.1 MVP (no escopo)
1. **Motor de Redirecionamento:** Middleware Express para rotas `/:slug` com busca em storage JSON.
2. **Redirecionamento 301:** Resposta HTTP 301 com header Location para URL de destino.
3. **Sistema de Cotagens Básico:** Contadores diários (1000), semanais (5000), mensais (15000) por link.
4. **Bloqueio por Cota:** Resposta HTTP 429 quando limites atingidos.
5. **Analytics Simples:** Registro de cliques com timestamp, referer, user-agent.
6. **Contadores em Memória:** Cache em memória para performance dos contadores.
7. **Reset Automático:** Job diário para zerar contadores (simulado).
8. **Dashboard Vue.js:** Interface para visualizar cliques em tempo real.
9. **WebSocket/Pooling:** Atualização em tempo real do dashboard.
10. **Tratamento de Bots:** Identificação básica de bots para não contar em cotas.

## 2.2 Fora do escopo (agora)
- Sistema de strikes e bloqueios em cascata.
- Analytics com geolocalização real.
- Cache avançado (Redis/KV).
- Performance para alta escala.
- Sistema de banimento.

## 2.3 Assunções (com risco e como mudar depois)
- **ASSUNÇÃO 01 (Risco: Médio)**
  - Decisão: Contadores em memória com persistência JSON.
  - Por que: Performance para desenvolvimento, simplicidade.
  - Risco: Perda de dados se server restartar.
  - Mitigação: Persistência periódica em JSON.
  - Como mudar depois: Migrar para KV/D1 com cache.

- **ASSUNÇÃO 02 (Risco: Baixo)**
  - Decisão: Middleware Express para redirecionamento.
  - Por que: Simples de implementar e testar localmente.
  - Risco: Diferenças de performance com Cloudflare Workers.
  - Mitigação: Manter lógica compatível com Workers.
  - Como mudar depois: Adaptar para Workers KV + D1.

- **ASSUNÇÃO 03 (Risco: Baixo)**
  - Decisão: WebSocket para atualização em tempo real.
  - Por que: Experiência visual imediata para o dashboard.
  - Risco: Complexidade adicional.
  - Mitigação: Implementar pooling como fallback.
  - Como mudar depois: Manter ou substituir por Server-Sent Events.

## 2.4 Perguntas em aberto (máx. 10; se vazio, escrever "Nenhuma")
1. Qual intervalo para atualização em tempo real (1s, 5s, 10s)?
2. Deve incluir simulação de geolocalização nos analytics?
3. Como simular diferentes user-agents de bots?
4. Deve ter interface manual para resetar contadores?

# 3) UX e Fluxos
## 3.1 Jornada principal (passo a passo)
1. **Criação do Link:** Usuário cria link encurtado via interface Vue.js (Fase 02).
2. **Acesso ao Link:** Terceiro acessa `localhost:3001/meu-link`.
3. **Redirecionamento:** Server busca slug, verifica cotas, redireciona 301.
4. **Contagem:** Incrementa contadores e registra analytics.
5. **Visualização:** Administrador vê cliques em tempo real no dashboard.
6. **Bloqueio:** Ao atingir cota, próximos acessos recebem 429.

## 3.2 Fluxos alternativos e falhas
- **Slug Inexistente:** Retorna 404 com página "Link não encontrado".
- **URL Inválida:** Retorna 400 com erro de configuração.
- **Server Offline:** Frontend mostra erro de conexão.
- **Cota Esgotada:** Retorna 429, frontend pode mostrar página amigável.
- **Bot Detection:** Bots não contabilizam mas redirecionam normalmente.

## 3.3 Estados (ativo/bloqueado/limite)
- **Ativo:** Link redireciona normalmente, contadores incrementam.
- **Bloqueado Diário:** 429 até próximo dia, outros contadores continuam.
- **Bloqueio Total:** 429 em todos os níveis (diário+semanal+mensal).
- **Limite Atingindo:** Dashboard mostra alertas visuais.

## 3.4 Microcopy crítica (mensagens e rótulos)
- **Página 404:** "Este link não existe ou foi removido."
- **Página 429:** "Este link atingiu o limite de acesso diário. Tente novamente amanhã."
- **Dashboard Status:** "Ativo", "Cota Diária: 850/1000", "Bloqueado Temporariamente"
- **Alerta Cota:** "⚠️ Link approaching daily limit"
- **Bot Detection:** "Bot access detected (not counted)"

# 4) Requisitos (SRS)
## 4.1 Requisitos funcionais
### RF-013
- Heading: Motor de Redirecionamento com Middleware
- Descrição (testável): Middleware Express para `/:slug` que busca link no JSON, verifica existência e redireciona com HTTP 301.
- Prioridade (Must/Should/Could): Must
- Racional: Core business fundamental do sistema.
- Dependências: RF-007 (storage JSON)
- Método de verificação (um): Teste
- Critérios de aceitação (Given/When/Then):
  - Dado que existe link "teste" apontando para "https://exemplo.com",
  - Quando acesso "http://localhost:3001/teste",
  - Então recebo HTTP 301 com Location "https://exemplo.com".
  - E o tempo de resposta é < 100ms.
- Notas: Usar res.redirect(301, url).

### RF-014
- Heading: Sistema de Cotagens Básico
- Descrição (testável): Cada link mantém três contadores (diário, semanal, mensal) com limites (1000, 5000, 15000). Bloqueio ocorre se qualquer limite excedido.
- Prioridade (Must/Should/Could): Must
- Racional: Controle de uso e proteção contra abuso.
- Dependências: RF-013
- Método de verificação (um): Teste
- Critérios de aceitação (Given/When/Then):
  - Dado um link novo com 0 cliques,
  - Quando ele recebe 1000 acessos em um dia,
  - Então o 1001º acesso recebe HTTP 429.
  - E outros contadores (semanal/mensal) continuam funcionando.
- Notas: Contadores em memória com persistência JSON.

### RF-015
- Heading: Analytics Simples de Cliques
- Descrição (testável): Cada clique válido registra timestamp, referer, user-agent em analytics.json para visualização no dashboard.
- Prioridade (Must/Should/Could): Should
- Racional: Métricas básicas para administrador.
- Dependências: RF-013
- Método de verificação (um): Análise
- Critérios de aceitação (Given/When/Then):
  - Dado que um link foi acessado,
  - Quando verifico analytics.json,
  - Então encontro registro com timestamp, referer e user-agent.
  - E dashboard Vue.js exibe estatísticas atualizadas.
- Notas: Usar req.headers para dados do request.

### RF-016
- Heading: Dashboard Vue.js em Tempo Real
- Descrição (testável): Interface Vue.js que exibe cliques por link, status de cotas e atualiza automaticamente a cada X segundos via polling ou WebSocket.
- Prioridade (Must/Should/Could): Should
- Racional: Visualização imediata do sistema funcionando.
- Dependências: RF-014, RF-015
- Método de verificação (um): Demonstração
- Critérios de aceitação (Given/When/Then):
  - Dado que estou no dashboard de analytics,
  - Quando alguém acessa um link,
  - Então vejo o contador incrementar em até 5 segundos.
  - E status de cotas atualiza se limite atingido.
- Notas: Usar setInterval para polling ou ws para WebSocket.

### RF-017
- Heading: Tratamento de Bots de Busca
- Descrição (testável): Identificar user-agents de bots (Googlebot, FacebookBot, etc.) e permitir redirecionamento sem contar para cotas ou analytics.
- Prioridade (Must/Should/Could): Should
- Racional: Preservar SEO e previews sociais.
- Dependências: RF-013
- Método de verificação (um): Teste
- Critérios de aceitação (Given/When/Then):
  - Dado um user-agent "Googlebot/2.1",
  - Quando acesso um link,
  - Então sou redirecionado normalmente.
  - E contadores de cliques não incrementam.
- Notas: Lista configurável de user-agents.

### RF-018
- Heading: Reset Automático de Contadores
- Descrição (testável): Job agendado (simulado) que zera contadores diários à meia-noite, semanais a cada 7 dias, mensais a cada 30 dias.
- Prioridade (Must/Should/Could): Should
- Racional: Funcionamento correto do sistema de cotas.
- Dependências: RF-014
- Método de verificação (um): Teste
- Critérios de aceitação (Given/When/Then):
  - Dado um link com 100 cliques diários,
  - Quando o job de reset diário executa,
  - Então o contador diário volta para 0.
  - E contadores semanal/mensal mantêm valores.
- Notas: Usar node-cron ou simulação manual.

### RF-019
- Heading: Cache em Memória para Performance
- Descrição (testável): Implementar cache em memória (Map/objeto) para lookup rápido de slugs e contadores, com persistência periódica em JSON.
- Prioridade (Must/Should/Could): Should
- Racional: Performance otimizada para redirecionamento.
- Dependências: RF-013, RF-014
- Método de verificação (um): Análise
- Critérios de aceitação (Given/When/Then):
  - Dado que o server está rodando,
  - Quando múltiplos acessos ocorrem ao mesmo slug,
  - Então todos respondem em < 50ms (cache hit).
  - E dados persistem no JSON a cada 30 segundos.
- Notas: Usar Map para cache, setInterval para persistência.

## 4.2 Requisitos não funcionais
### RNF-007 Performance Redirecionamento
- Requisitos:
  1. Redirecionamento < 100ms (cache hit).
  2. Suporte a 100 requisições simultâneas.
  3. Uso de memória < 100MB para contadores.
- Critérios de aceitação:
  - ApacheBench mostra < 100ms média.
  - Server não crasha sob carga.
- Método de verificação: Testes de carga.

### RNF-008 Confiabilidade
- Requisitos:
  1. Dados persistem entre restarts do server.
  2. Recuperação automática de JSON corrompido.
  3. Logs de erros para debug.
- Critérios de aceitação:
  - Restart server não perde contadores.
  - Server recupera de JSON malformado.
- Método de verificação: Testes de restart.

### RNF-009 Monitoramento
- Requisitos:
  1. Logs de acesso com status codes.
  2. Métricas básicas de performance.
  3. Alertas visuais no dashboard.
- Critérios de aceitação:
  - Console mostra todos os redirecionamentos.
  - Dashboard alerta sobre problemas.
- Método de verificação: Inspeção de logs.

# 5) Dados (conceitual, sem implementação)
## 5.1 Entidades e campos (nível conceitual)
- **Link com Contadores:**
  - `id` (Number): ID único.
  - `slug` (String): Identificador único.
  - `url_destination` (String): URL de destino.
  - `clicks_day` (Number): Contador diário.
  - `clicks_week` (Number): Contador semanal.
  - `clicks_month` (Number): Contador mensal.
  - `last_reset_day` (String): Data do último reset diário.
  - `last_reset_week` (String): Data do último reset semanal.
  - `last_reset_month` (String): Data do último reset mensal.
- **Analytics Event:**
  - `id` (Number): ID único.
  - `link_id` (Number): ID do link.
  - `timestamp` (String): ISO timestamp.
  - `referer` (String): Domínio de origem.
  - `user_agent` (String): User agent string.
  - `is_bot` (Boolean): Se era um bot.

## 5.2 Regras, validações e integridade
- Contadores nunca podem ser negativos.
- Reset diário ocorre à 00:00 UTC.
- Reset semanal ocorre 7 dias após criação.
- Reset mensal ocorre 30 dias após criação.
- Bots identificados não incrementam contadores.

## 5.3 Dados sensíveis, retenção e auditoria
- **Sensíveis:** URLs em analytics (tratar como spec principal).
- **Retenção:** Analytics mantidos por 30 dias em desenvolvimento.
- **Auditoria:** Logs de acesso com IPs anonimizados.

# 6) Integrações (contratos narrativos)
- **INT-006 Middleware Express**
  - Objetivo: Processar requisições de redirecionamento.
  - Entradas: Requisição HTTP com slug na URL.
  - Saídas: Resposta HTTP 301 ou 429/404.
  - Erros esperados: Slug não encontrado, cota excedida.
  - Autenticação: Nenhuma.

- **INT-007 Cache em Memória**
  - Objetivo: Performance otimizada para lookup.
  - Entradas: Chave slug, valor dados do link.
  - Saídas: Dados do link ou undefined.
  - Erros esperados: Memory overflow.
  - Autenticação: Nenhuma.

- **INT-008 WebSocket (Opcional)**
  - Objetivo: Atualização em tempo real do dashboard.
  - Entradas: Eventos de atualização de contadores.
  - Saídas: Mensagens para clientes conectados.
  - Erros esperados: Connection lost.
  - Autenticação: Nenhuma.

# 7) Estratégia de testes
## 7.1 Cenários mínimos do MVP
1. Criar link e redirecionar corretamente.
2. Atingir cota diária e receber 429.
3. Acessar link inexistente e receber 404.
4. Simular acesso de bot (não contar).
5. Visualizar cliques em tempo real no dashboard.
6. Testar reset automático de contadores.
7. Verificar persistência entre restarts.

## 7.2 Casos de borda
- Acesso simultâneo ao mesmo link.
- JSON corrompido no startup.
- Memória insuficiente para cache.
- User-agent malformado.
- Timestamp inválido em analytics.

## 7.3 Critério de aceite do release
A Fase 03 está pronta quando:
- Redirecionamento 301 funciona corretamente.
- Sistema de cotas bloqueia quando necessário.
- Dashboard atualiza em tempo real.
- Dados persistem entre restarts.
- Bots são tratados corretamente.

# 8) Plano de execução para vibe coding
## 8.1 Ordem de construção (fatias finas)
1. **Middleware de Redirecionamento:**
   - Criar middleware para `/:slug`.
   - Implementar busca em JSON.
   - Retornar 301 ou 404.

2. **Sistema de Cotagens:**
   - Adicionar contadores ao schema.
   - Implementar lógica de verificação.
   - Retornar 429 quando excedido.

3. **Analytics Básicos:**
   - Registrar cada clique válido.
   - Salvar em analytics.json.
   - Estrutura para dashboard.

4. **Cache em Memória:**
   - Implementar Map para links.
   - Persistência periódica.
   - Performance optimization.

5. **Dashboard Vue.js:**
   - Componente para visualizar cliques.
   - Polling para atualização.
   - Status de cotas.

6. **Tratamento de Bots e Resets:**
   - Identificar user-agents de bots.
   - Implementar job de reset.
   - Testes completos.

## 8.2 Checkpoints por etapa
- **Pós-Middleware:** Redirecionamento básico funcionando.
- **Pós-Cotas:** Sistema bloqueando corretamente.
- **Pós-Analytics:** Cliques sendo registrados.
- **Pós-Cache:** Performance otimizada (< 50ms).
- **Pós-Dashboard:** Visualização em tempo real funcionando.
- **Pós-Polimento:** Sistema completo e robusto.

## 8.3 Prompt pack operacional
- **Objetivo do build:** Implementar [Middleware/Funcionalidade] conforme spec-fase-03.md.
- **Restrições:**
  - Middleware deve ser stateless onde possível.
  - Cache em memória com persistência.
  - Performance < 100ms para redirecionamento.
  - Tratamento de todos os casos de erro.
- **Definição de pronto:**
  - Redirecionamento testado com curl/browser.
  - Cotas validadas com testes de carga.
  - Dashboard atualizando em tempo real.
- **Como validar:**
  1. Testar redirecionamento com browser.
  2. Simular carga com ApacheBench.
  3. Verificar dashboard Vue.js.
  4. Testar persistência/restart.
- **Como registrar mudanças:**
  - Atualizar changelog da fase.

# 9) Riscos e mitigação
- **Risco:** Performance sob alta carga. **Mitigação:** Cache em memória, testes de carga.
- **Risco:** Perda de dados em restart. **Mitigação:** Persistência periódica, recovery procedures.
- **Risco:** Complexidade do WebSocket. **Mitigação:** Implementar pooling como fallback.

# 10) Checklists
## 10.1 Pronto para implementar
- [x] Motor de redirecionamento definido
- [x] Sistema de cotas especificado
- [x] Analytics básicos planejados
- [x] Dashboard Vue.js desenhado
- [x] Estratégia de cache definida

## 10.2 Segurança do vibe coding
- [x] Validação de slugs contra injection
- [x] Sanitização de URLs de destino
- [x] Logs sem dados sensíveis
- [x] Proteção contra DoS básica

# 11) Decisões e Changelog
## 11.1 Decisões
- **DEC-009:** Middleware Express para redirecionamento por simplicidade local.
- **DEC-010:** Contadores em memória com persistência JSON para performance.
- **DEC-011:** Dashboard Vue.js com polling por simplicidade vs WebSocket.
- **DEC-012:** Tratamento de bots baseado em user-agent por efetividade.

## 11.2 Changelog
- v0.1: documento inicial da fase 03
- v1.0: especificação completa com motor redirecionamento, cotas e analytics
