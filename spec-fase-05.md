# INKPAGE_FASE-05_SPEC_v1.0.md

# 0) Metadados
- Projeto: INKPAGE (inkpage.com.br)
- Fase: 05 - Integração Cloudflare com Vue.js
- Versão: 1.0
- Data: 03/04/2026
- Status (draft/review/final): draft
- Público: IA desenvolvedora (vibe coding) + stakeholders (Alex)
- Stack: Vue.js 3 + Cloudflare Pages + Workers + D1 + KV + Wrangler
- Resumo em 2 linhas: Especificação para migrar arquitetura local completa para Cloudflare, adaptando frontend Vue.js para Pages, backend para Workers, storage para D1/KV e configurando domínio em produção.

# 1) Visão (PRD)
## 1.1 Objetivo e problema
**Objetivo:** Migrar sistema local funcional para infraestrutura Cloudflare, mantendo todas as funcionalidades e adicionando performance de edge computing.
**Problema:** Sistema local precisa ser escalável, globalmente rápido e operar dentro dos limites gratuitos da Cloudflare, preparando para produção real.

## 1.2 Público-alvo (personas)
1. **Desenvolvedor (Alex):** Precisa migrar código para Cloudflare Workers, configurar D1/KV, fazer deploy e validar funcionamento em produção.
2. **Usuário Final:** Precisa que sistema funcione globalmente com alta performance e confiabilidade.

## 1.3 Métricas de sucesso (1 primária + 2 secundárias)
- **Primária:** Sistema 100% funcional em Cloudflare com todas as features da Fase 04.
- **Secundária 1:** Performance global < 100ms para redirecionamentos (edge).
- **Secundária 2:** Consumo dentro dos limites gratuitos (< 100k requests/dia).

## 1.4 Não-metas (por que NÃO fazer agora)
- Otimizações avançadas de performance.
- Sistema de pagamentos ou premium.
- APIs públicas para terceiros.
- Multi-região ou CDN avançada.

# 2) Escopo
## 2.1 MVP (no escopo)
1. **Setup Cloudflare Account:** Configurar conta, domínio `inkpage.com.br`, DNS records.
2. **Cloudflare Pages Setup:** Deploy do frontend Vue.js com build otimizado.
3. **Workers Migration:** Adaptar backend Node.js para Cloudflare Workers API.
4. **D1 Database Setup:** Criar banco D1, migrar schema JSON, implementar queries.
5. **KV Namespace Setup:** Configurar KV para cache rápido e contadores.
6. **Environment Variables:** Migrar segredos e configurações para Workers.
7. **Wrangler CLI Setup:** Configurar ferramenta de deploy local.
8. **Domain Configuration:** Apontar domínio para Pages, configurar SSL.
9. **API Routes Migration:** Adaptar todos os endpoints para Workers API.
10. **Static Asset Optimization:** Otimizar build Vue.js para edge delivery.
11. **Error Handling Adaptation:** Ajustar tratamento de erros para Workers environment.
12. **Testing in Production:** Validação completa de todas as funcionalidades.

## 2.2 Fora do escopo (agora)
- Cloudflare Access integration (deixado para Fase 06).
- Monitoramento avançado.
- Cache strategies avançadas.
- Multi-environment (staging/prod).

## 2.3 Assunções (com risco e como mudar depois)
- **ASSUNÇÃO 01 (Risco: Médio)**
  - Decisão: Migrar Node.js/Express para Workers API diretamente.
  - Por que: Manter lógica similar, menor curva de aprendizado.
  - Risco: Diferenças de runtime e APIs disponíveis.
  - Mitigação: Isolar lógica de negócio, adaptar apenas camada de HTTP.
  - Como mudar depois: Refatorar para padrões Workers se necessário.

- **ASSUNÇÃO 02 (Risco: Baixo)**
  - Decisão: D1 para dados persistentes, KV para cache/contadores.
  - Por que: Separação clara de responsabilidades, performance otimizada.
  - Risco: Limites do plano gratuito da D1.
  - Mitigação: Schema otimizado, queries eficientes.
  - Como mudar depois: Migrar para plano pago se necessário.

- **ASSUNÇÃO 03 (Risco: Médio)**
  - Decisão: Build Vue.js para Pages com SPA mode.
  - Por que: Simplicidade, fallback para client-side routing.
  - Risco: Performance em primeira visita.
  - Mitigação: Otimizar bundle, pré-carregar rotas críticas.
  - Como mudar depois: Implementar SSR se necessário.

## 2.4 Perguntas em aberto (máx. 10; se vazio, escrever "Nenhuma")
1. Qual plano da Cloudflare (Free vs Pro) para iniciar?
2. Já possui domínio `inkpage.com.br` registrado?
3. Há necessidade de configurar HTTPS customizado?
4. Deve implementar analytics da Cloudflare ou manter local?

# 3) UX e Fluxos
## 3.1 Jornada principal (passo a passo)
1. **Setup Inicial:** Configurar conta Cloudflare, registrar domínio, instalar Wrangler.
2. **Database Migration:** Criar D1, executar migrations, popular dados iniciais.
3. **KV Setup:** Criar namespace, configurar bindings.
4. **Frontend Build:** Build Vue.js otimizado para Pages deploy.
5. **Backend Adaptation:** Converter Express para Workers API syntax.
6. **Deploy Pages:** Fazer deploy inicial do frontend estático.
7. **Deploy Workers:** Deploy do backend com environment variables.
8. **Domain Configuration:** Apontar DNS, configurar SSL.
9. **Testing:** Validar todas as funcionalidades em produção.
10. **Monitoring:** Configurar métricas básicas da Cloudflare.

## 3.2 Fluxos alternativos e falhas
- **Deploy Falha:** Rollback para versão anterior, debug de logs.
- **Database Error:** Verificar migrations, schema compatibility.
- **Performance Issues:** Analisar bundle size, otimizar queries.
- **Domain Problems:** Verificar DNS records, propagation.
- **Environment Issues:** Validar variables, secrets.

## 3.3 Estados (desenvolvimento/staging/produção)
- **Desenvolvimento:** Ambiente local com Wrangler dev.
- **Staging:** Preview deployment em Workers preview.
- **Produção:** Deploy final em domínio real.
- **Rollback:** Reversão para versão estável anterior.

## 3.4 Microcopy crítica (mensagens e rótulos)
- **Status Deploy:** "Deploying...", "Deployed Successfully", "Deploy Failed"
- **Status Database:** "Migrating...", "Migration Complete", "Migration Error"
- **Error Messages:** "Service temporarily unavailable", "Database connection failed"
- **Success Messages:** "System migrated successfully", "All systems operational"

# 4) Requisitos (SRS)
## 4.1 Requisitos funcionais
### RF-028
- Heading: Cloudflare Pages Setup com Vue.js
- Descrição (testável): Configurar Cloudflare Pages com build Vue.js, SPA mode, custom domain e deploy automático via Wrangler.
- Prioridade (Must/Should/Could): Must
- Racional: Frontend em produção globalmente rápido.
- Dependências: Projeto Vue.js da Fase 04.
- Método de verificação (um): Demonstração
- Critérios de aceitação (Given/When/Then):
  - Dado que tenho build Vue.js otimizado,
  - Quando faço deploy via Wrangler,
  - Então frontend está acessível em `https://inkpage.com.br`.
  - E todas as rotas SPA funcionam corretamente.
- Notas: Usar `wrangler pages deploy` com configuração adequada.

### RF-029
- Heading: Workers API Migration
- Descrição (testável): Adaptar backend Express para Workers API syntax, mantendo todos os endpoints: POST `/api/links`, GET `/api/folder/:hash`, DELETE `/api/links/:id`, etc.
- Prioridade (Must/Should/Could): Must
- Racional: Backend serverless em edge computing.
- Dependências: APIs da Fase 02, RF-028.
- Método de verificação (um): Teste
- Critérios de aceitação (Given/When/Then):
  - Dado que adaptei código para Workers,
  - Quando faço deploy do Worker,
  - Então todos os endpoints respondem corretamente.
  - E frontend consome APIs sem erros.
- Notas: Usar `fetch` API do Workers, adaptar middleware.

### RF-030
- Heading: D1 Database Setup e Migration
- Descrição (testável): Criar banco D1, executar migrations para criar tabelas `links`, `folders`, `analytics`, e migrar dados do JSON local.
- Prioridade (Must/Should/Could): Must
- Racional: Persistência de dados em produção.
- Dependências: Schema JSON das fases anteriores.
- Método de verificação (um): Análise
- Critérios de aceitação (Given/When/Then):
  - Dado que executei migrations D1,
  - Quando verifico o banco,
  - Então todas as tabelas existem com schema correto.
  - E dados migrados estão presentes.
- Notas: Usar `wrangler d1 migrations` com SQL files.

### RF-031
- Heading: KV Namespace para Cache e Contadores
- Descrição (testável): Configurar KV namespace para cache rápido de links, contadores de cotas e analytics temporários, com TTL adequado.
- Prioridade (Must/Should/Could): Must
- Racional: Performance otimizada para leituras frequentes.
- Dependências: RF-029, RF-030.
- Método de verificação (um): Teste
- Critérios de aceitação (Given/When/Then):
  - Dado que configurei KV bindings,
  - Quando o Worker faz leitura de link,
  - Então resposta vem em < 50ms (cache hit).
  - E contadores incrementam corretamente.
- Notas: Usar KV para lookup de slugs, D1 para persistência.

### RF-032
- Heading: Environment Variables e Secrets
- Descrição (testável): Migrar configurações e segredos (SECRET_KEY para hash, etc.) para environment variables do Workers com segurança.
- Prioridade (Must/Should/Could): Must
- Racional: Segurança e configuração de produção.
- Dependências: Secrets do desenvolvimento local.
- Método de verificação (um): Inspeção
- Critérios de aceitação (Given/When/Then):
  - Dado que configurei secrets no Wrangler,
  - Quando o Worker inicia,
  - Então environment variables estão disponíveis.
  - E segredos não estão expostos no código.
- Notas: Usar `wrangler secret put` para dados sensíveis.

### RF-033
- Heading: Domain Configuration e DNS
- Descrição (testável): Configurar domínio `inkpage.com.br` para apontar para Cloudflare Pages, com DNS records corretos e SSL automático.
- Prioridade (Must/Should/Could): Must
- Racional: Acesso público via domínio próprio.
- Dependências: RF-028, domínio registrado.
- Método de verificação (um): Demonstração
- Critérios de aceitação (Given/When/Then):
  - Dado que configurei DNS records,
  - Quando acesso `https://inkpage.com.br`,
  - Então vejo o frontend Vue.js carregado.
  - E SSL certificate é válido.
- Notas: Usar CNAME para Pages, A records para Workers.

### RF-034
- Heading: Static Asset Optimization
- Descrição (testável): Otimizar build Vue.js para entrega via edge, com bundle splitting, lazy loading e compressão adequada.
- Prioridade (Must/Should/Could): Should
- Racional: Performance ótima para frontend.
- Dependências: RF-028.
- Método de verificação (um): Análise
- Critérios de aceitação (Given/When/Then):
  - Dado que otimizei o build,
  - Quando analiso o bundle,
  - Então tamanho < 100KB gzipped.
  - E assets são servidos via CDN edge.
- Notas: Usar Vite/Webpack optimizations.

### RF-035
- Heading: Error Handling Adaptation
- Descrição (testável): Adaptar tratamento de erros para Workers environment, com logging adequado e respostas HTTP corretas.
- Prioridade (Must/Should/Could): Should
- Racional: Debugging e experiência do usuário.
- Dependências: RF-029.
- Método de verificação (um): Teste
- Critérios de aceitação (Given/When/Then):
  - Dado que ocorre um erro no Worker,
  - Quando o erro é capturado,
  - Então log é registrado adequadamente.
  - E usuário recebe resposta HTTP apropriada.
- Notas: Usar console.log com contexto, try/catch blocks.

## 4.2 Requisitos não funcionais
### RNF-013 Performance Edge
- Requisitos:
  1. Redirecionamentos < 100ms globalmente.
  2. Frontend LCP < 2.5s globalmente.
  3. API responses < 200ms edge.
- Critérios de aceitação:
  - WebPageTest mostra tempos < 100ms.
  - Lighthouse performance > 90.
- Método de verificação: Ferramentas de performance.

### RNF-014 Confiabilidade
- Requisitos:
  1. Uptime > 99.9% (Cloudflare SLA).
  2. Zero cold starts para Workers.
  3. Deploy sem downtime.
- Critérios de aceitação:
  - Monitoring mostra uptime adequado.
  - Deploy funciona com zero downtime.
- Método de verificação: Cloudflare dashboard.

### RNF-015 Escalabilidade
- Requisitos:
  1. Suporte a 10k requests/dia no plano free.
  2. Auto-scaling automático.
  3. Performance sob picos de tráfego.
- Critérios de aceitação:
  - System funciona sob carga de teste.
  - Consumo dentro dos limites free.
- Método de verificação: Load testing.

# 5) Dados (conceitual, sem implementação)
## 5.1 Entidades e campos (nível conceitual)
- **Links Table (D1):**
  ```sql
  CREATE TABLE links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    url_destination TEXT NOT NULL,
    folder_hash TEXT NOT NULL,
    created_at TEXT NOT NULL,
    clicks_day INTEGER DEFAULT 0,
    clicks_week INTEGER DEFAULT 0,
    clicks_month INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1
  );
  ```
- **Folders Table (D1):**
  ```sql
  CREATE TABLE folders (
    hash TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    last_accessed TEXT,
    status TEXT DEFAULT 'active'
  );
  ```
- **Analytics Table (D1):**
  ```sql
  CREATE TABLE analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    link_id INTEGER NOT NULL,
    accessed_at TEXT NOT NULL,
    country TEXT,
    referer TEXT,
    user_agent TEXT,
    is_bot BOOLEAN DEFAULT 0,
    FOREIGN KEY (link_id) REFERENCES links(id)
  );
  ```

## 5.2 Regras, validações e integridade
- Slug unique constraint em links table.
- Foreign key constraints para analytics.
- Indexes em slug, folder_hash para performance.
- TTL de 24h para KV cache de links.

## 5.3 Dados sensíveis, retenção e auditoria
- **Sensíveis:** SECRET_KEY em environment variables.
- **Retenção:** Analytics expurgados após 12 meses.
- **Auditoria:** Logs de Workers retidos por 7 dias.

# 6) Integrações (contratos narrativos)
- **INT-012 Cloudflare Pages**
  - Objetivo: Servir frontend Vue.js globalmente.
  - Entradas: Build assets otimizados.
  - Saídas: Website acessível via domínio.
  - Erros esperados: Build failures, deployment errors.
  - Autenticação: Nenhuma (público).

- **INT-013 Cloudflare Workers**
  - Objetivo: Backend serverless API.
  - Entradas: Requisições HTTP JSON.
  - Saídas: Respostas JSON com dados.
  - Erros esperados: D1 errors, KV errors.
  - Autenticação: Nenhuma (público).

- **INT-014 Cloudflare D1**
  - Objetivo: Persistência de dados estruturados.
  - Entradas: Queries SQL parametrizadas.
  - Saídas: Resultados das queries.
  - Erros esperados: Constraint violations, timeouts.
  - Autenticação: Via Workers bindings.

- **INT-015 Cloudflare KV**
  - Objetivo: Cache rápido e contadores.
  - Entradas: Chave-valor pairs.
  - Saídas: Valores armazenados.
  - Erros esperados: Key not found, quota exceeded.
  - Autenticação: Via Workers bindings.

# 7) Estratégia de testes
## 7.1 Cenários mínimos do MVP
1. Deploy frontend em Pages com sucesso.
2. Deploy backend Workers sem erros.
3. Todas as APIs funcionam em produção.
4. Redirecionamento 301 funciona globalmente.
5. Sistema de cotas opera corretamente.
6. Dashboard admin atualiza em tempo real.
7. Performance dentro dos limites esperados.

## 7.2 Casos de borda
- Deploy falhando midway.
- D1 migration errors.
- KV quota exceeded.
- DNS propagation delays.
- Environment variables missing.

## 7.3 Critério de aceite do release
A Fase 05 está pronta quando:
- Sistema completo funciona em `https://inkpage.com.br`.
- Todas as features das fases anteriores operam.
- Performance atende requisitos.
- Consumo dentro dos limites free.
- Monitoramento básico configurado.

# 8) Plano de execução para vibe coding
## 8.1 Ordem de construção (fatias finas)
1. **Setup Cloudflare Account:**
   - Criar conta, registrar domínio.
   - Instalar Wrangler CLI.
   - Autenticar localmente.

2. **D1 Database Setup:**
   - Criar banco D1.
   - Escrever migrations SQL.
   - Executar migrations.

3. **KV Namespace Setup:**
   - Criar namespace KV.
   - Configurar bindings no Worker.
   - Testar leitura/escrita.

4. **Frontend Build Optimization:**
   - Configurar build para Pages.
   - Otimizar bundle e assets.
   - Testar build localmente.

5. **Backend Workers Migration:**
   - Adaptar código Express para Workers.
   - Configurar environment variables.
   - Testar localmente com Wrangler dev.

6. **Deploy Pages:**
   - Deploy inicial do frontend.
   - Configurar custom domain.
   - Validar funcionamento.

7. **Deploy Workers:**
   - Deploy do backend.
   - Configurar routes para APIs.
   - Testar integração completa.

8. **Final Testing:**
   - Testar todas as funcionalidades.
   - Validar performance.
   - Configurar monitoramento.

## 8.2 Checkpoints por etapa
- **Pós-Setup:** Wrangler autenticado, domínio configurado.
- **Pós-D1:** Banco criado, migrations executadas.
- **Pós-KV:** Namespace funcionando, bindings ok.
- **Pós-Build:** Frontend otimizado, pronto para deploy.
- **Pós-Workers:** Backend adaptado, testado localmente.
- **Pós-Deploy:** Sistema completo em produção.
- **Pós-Testing:** Performance validada, monitoramento ok.

## 8.3 Prompt pack operacional
- **Objetivo do build:** Migrar [Componente/Funcionalidade] para Cloudflare conforme spec-fase-05.md.
- **Restrições:**
  - Adaptar código para Workers runtime.
  - Usar D1 para persistência, KV para cache.
  - Manter compatibilidade com frontend Vue.js.
  - Performance < 100ms para operações críticas.
- **Definição de pronto:**
  - Funcionalidade testada em produção.
  - Performance atende requisitos.
  - Consumo dentro dos limites free.
- **Como validar:**
  1. Deploy via Wrangler.
  2. Testar no domínio real.
  3. Verificar performance tools.
  4. Monitorar consumo Cloudflare.
- **Como registrar mudanças:**
  - Atualizar changelog da fase.

# 9) Riscos e mitigação
- **Risco:** Workers runtime limitations. **Mitigação:** Testar localmente, adaptar código progressivamente.
- **Risco:** D1 performance issues. **Mitigação:** Otimizar queries, usar índices adequados.
- **Risco:** KV quota exceeded. **Mitigação:** Monitorar consumo, implementar fallback para D1.
- **Risco:** Domain/DNS issues. **Mitigação:** Configurar gradualmente, testar propagation.

# 10) Checklists
## 10.1 Pronto para implementar
- [x] Conta Cloudflare configurada
- [x] Domínio registrado
- [x] Wrangler CLI instalado
- [x] Schema D1 definido
- [x] Estrutura KV planejada
- [x] Estratégia de migração definida

## 10.2 Segurança do vibe coding
- [x] Secrets em environment variables
- [x] SQL queries parametrizadas
- [x] Input sanitization mantida
- [x] CORS configurado corretamente

# 11) Decisões e Changelog
## 11.1 Decisões
- **DEC-017:** D1 para dados persistidos por performance e simplicidade.
- **DEC-018:** KV para cache e contadores por velocidade de edge.
- **DEC-019:** Workers API por serverless scalability.
- **DEC-020:** Pages para frontend por global CDN.

## 11.2 Changelog
- v0.1: documento inicial da fase 05
- v1.0: especificação completa com migração Cloudflare, D1, KV, Workers
