# INKPAGE_FASE-02_SPEC_v1.0.md

# 0) Metadados
- Projeto: INKPAGE (inkpage.com.br)
- Fase: 02 - Backend Local API com Vue.js
- Versão: 1.0
- Data: 03/04/2026
- Status (draft/review/final): draft
- Público: IA desenvolvedora (vibe coding) + stakeholders (Alex)
- Stack: Vue.js 3 + Axios + Node.js Mock Server + JSON Storage
- Resumo em 2 linhas: Especificação para implementar APIs locais mockadas com integração Vue.js, habilitando criação de links encurtados, sistema de pastas SHA256 e gestão completa com armazenamento JSON simulado.

# 1) Visão (PRD)
## 1.1 Objetivo e problema
**Objetivo:** Implementar backend funcional local com APIs mockadas e integração completa com frontend Vue.js, permitindo criação e gestão de links encurtados com persistência simulada.
**Problema:** Frontend Vue.js precisa consumir APIs reais para funcionalidades de encurtamento, gestão de pastas e persistência, mas ainda sem integração com Cloudflare.

## 1.2 Público-alvo (personas)
1. **Desenvolvedor (Alex):** Precisa testar fluxos completos de API, validar integração Vue.js + backend e preparar arquitetura para migração futura.
2. **Usuário Final:** Precisa criar links encurtados, gerenciar suas pastas e visualizar estatísticas básicas.

## 1.3 Métricas de sucesso (1 primária + 2 secundárias)
- **Primária:** Sistema completo de criação e gestão de links funcionando 100% local.
- **Secundária 1:** APIs mockadas respondendo em < 50ms localmente.
- **Secundária 2:** Estado sincronizado entre frontend e backend JSON.

## 1.4 Não-metas (por que NÃO fazer agora)
- Integração com banco de dados real.
- Deploy em produção.
- Sistema de autenticação real.
- Redirecionamento real de URLs.

# 2) Escopo
## 2.1 MVP (no escopo)
1. **Mock Server Node.js:** Servidor local com Express simulando APIs REST.
2. **API de Criação de Links:** POST `/api/links` com validação, geração de slug e hash SHA256.
3. **API de Gestão de Pastas:** GET `/api/folder/:hash`, DELETE `/api/links/:id`.
4. **Armazenamento JSON:** Arquivos JSON simulando banco de dados (links.json, folders.json).
5. **Integração Vue.js + Axios:** Serviço HTTP no frontend consumindo APIs mock.
6. **Sistema de Pastas SHA256:** Geração e associação de hashes a grupos de links.
7. **Validações Backend:** Validação de slug único, formato URL, sanitize inputs.
8. **Estado Sincronizado:** Frontend Vue.js refletindo estado real do backend.
9. **Error Handling:** Tratamento de erros de API com feedback ao usuário.
10. **Mock Analytics:** Sistema básico de contagem de cliques simulado.

## 2.2 Fora do escopo (agora)
- Redirecionamento real de URLs.
- Sistema de cotas e bloqueios.
- Painel administrativo real.
- Persistência em banco real.
- Performance otimizada para produção.

## 2.3 Assunções (com risco e como mudar depois)
- **ASSUNÇÃO 01 (Risco: Baixo)**
  - Decisão: Node.js + Express para mock server.
  - Por que: Simplicidade, ecossistema maduro, fácil migração para Workers.
  - Risco: Diferenças de ambiente entre Node.js e Cloudflare Workers.
  - Mitigação: Manter lógica de negócio isolada e compatível.
  - Como mudar depois: Adaptar endpoints para Workers API.

- **ASSUNÇÃO 02 (Risco: Médio)**
  - Decisão: Armazenamento em arquivos JSON.
  - Por que: Simplicidade para desenvolvimento local, visibilidade dos dados.
  - Risco: Performance e concorrência em produção.
  - Mitigação: Estrutura de dados compatível com D1/KV.
  - Como mudar depois: Migrar para D1/KV mantendo mesmo schema.

- **ASSUNÇÃO 03 (Risco: Baixo)**
  - Decisão: SHA256 para hashes de pasta.
  - Por que: Segurança adequada para fase local, compatível com produção.
  - Risco: Nenhum.
  - Mitigação: N/A.
  - Como mudar depois: Manter mesmo algoritmo em produção.

## 2.4 Perguntas em aberto (máx. 10; se vazio, escrever "Nenhuma")
1. Qual porta para o mock server (3001, 8080, outra)?
2. Deve incluir CORS configuration para desenvolvimento?
3. Há necessidade de logging detalhado no mock server?
4. Mock server deve ter hot-reload automático?

# 3) UX e Fluxos
## 3.1 Jornada principal (passo a passo)
1. **Acesso:** Usuário acessa frontend Vue.js em `localhost:3000`.
2. **Criação de Link:**
   a. Navega para `/encurtar`.
   b. Insere URL longa e slug customizado.
   c. Submete formulário.
   d. Recebe link curto e hash SHA256.
3. **Gestão de Pasta:**
   a. Navega para `/pasta`.
   b. Insere hash SHA256.
   c. Visualiza lista de links criados.
   d. Pode excluir links individualmente.
4. **Feedback em Tempo Real:** Todas as ações atualizam interface imediatamente.

## 3.2 Fluxos alternativos e falhas
- **Slug Duplicado:** API retorna erro 409, frontend mostra "Slug já em uso".
- **URL Inválida:** API retorna erro 400, frontend mostra "URL inválida".
- **Hash Inexistente:** API retorna 404, frontend mostra "Pasta não encontrada".
- **Server Offline:** Frontend mostra erro de conexão com opção de retry.
- **Concorrência:** Mock server simula delays para testar loading states.

## 3.3 Estados (vazio/carregando/sucesso/erro)
- **Carregando (API):** Skeletons e spinners durante requisições.
- **Sucesso (Criação):** Link gerado com hash destacado e botões de cópia.
- **Erro (API):** Toast/alertas com mensagens específicas do backend.
- **Vazio (Pasta):** Mensagem "Nenhum link criado ainda".
- **Offline:** Indicador de conexão perdida com retry automático.

## 3.4 Microcopy crítica (mensagens e rótulos)
- **Botão Criar:** "Encurtar Link"
- **Feedback Criação:** "Link criado com sucesso!"
- **Erro Slug:** "Este slug já está em uso. Tente outro."
- **Erro URL:** "Por favor, insira uma URL válida."
- **Label Hash:** "Sua Chave de Acesso (SHA256):"
- **Botão Copiar:** "Copiar Chave"
- **Status Pasta:** "Pasta com X links"
- **Confirmar Exclusão:** "Tem certeza que deseja excluir este link?"

# 4) Requisitos (SRS)
## 4.1 Requisitos funcionais
### RF-006
- Heading: Mock Server Node.js com APIs REST
- Descrição (testável): Servidor Express rodando em porta configurada com endpoints POST `/api/links`, GET `/api/folder/:hash`, DELETE `/api/links/:id`, retornando JSON com dados simulados.
- Prioridade (Must/Should/Could): Must
- Racional: Backend funcional para testes completos do frontend.
- Dependências: Nenhuma.
- Método de verificação (um): Teste
- Critérios de aceitação (Given/When/Then):
  - Dado que o mock server está rodando,
  - Quando faço POST para `/api/links` com dados válidos,
  - Então recebo status 201 com link criado e hash SHA256.
  - E quando faço GET para `/api/folder/:hash`, recebo lista de links.
- Notas: Usar CORS para permitir requisições do frontend.

### RF-007
- Heading: API de Criação de Links com Validações
- Descrição (testável): Endpoint POST `/api/links` deve validar URL, slug único, gerar hash SHA256 para nova pasta ou usar existente, salvar em JSON e retornar link completo.
- Prioridade (Must/Should/Could): Must
- Racional: Core business de encurtamento de links.
- Dependências: RF-006
- Método de verificação (um): Teste
- Critérios de aceitação (Given/When/Then):
  - Dado que envio POST com `{url: "https://exemplo.com", slug: "teste"}`,
  - Quando a API processa,
  - Então retorna `{id: 1, slug: "teste", url: "https://exemplo.com", folder_hash: "abc123..."}`.
  - E o link é salvo em links.json.
- Notas: Usar crypto.randomUUID() + timestamp para hash SHA256.

### RF-008
- Heading: Sistema de Pastas SHA256
- Descrição (testável): Cada link criado deve ser associado a um hash SHA256, novos links do mesmo usuário usam o mesmo hash, permitindo gestão agrupada.
- Prioridade (Must/Should/Could): Must
- Racional: Sistema de gestão sem cadastro tradicional.
- Dependências: RF-007
- Método de verificação (um): Teste
- Critérios de aceitação (Given/When/Then):
  - Dado que criei um link e recebi hash "abc123",
  - Quando crio outro link sem especificar hash,
  - Então o novo link usa o mesmo hash "abc123".
  - E quando acesso `/api/folder/abc123`, vejo ambos os links.
- Notas: Implementar lógica de "último hash usado" por sessão.

### RF-009
- Heading: API de Gestão de Pastas
- Descrição (testável): GET `/api/folder/:hash` deve retornar todos os links associados ao hash, DELETE `/api/links/:id` deve remover link específico validando pertencimento à pasta.
- Prioridade (Must/Should/Could): Must
- Racional: Funcionalidades essenciais de gestão.
- Dependências: RF-008
- Método de verificação (um): Teste
- Critérios de aceitação (Given/When/Then):
  - Dado que tenho links na pasta "abc123",
  - Quando faço GET `/api/folder/abc123`,
  - Então recebo array com todos os links da pasta.
  - E quando faço DELETE `/api/links/:id` válido, o link é removido.
- Notas: Validar se link pertence à pasta antes de deletar.

### RF-010
- Heading: Integração Vue.js + Axios
- Descrição (testável): Serviço HTTP no frontend usando Axios para consumir APIs mock, com interceptors para tratamento de erros e loading states.
- Prioridade (Must/Should/Could): Must
- Racional: Conexão frontend-backend funcional.
- Dependências: RF-006
- Método de verificação (um): Teste
- Critérios de aceitação (Given/When/Then):
  - Dado que estou no componente de encurtamento,
  - Quando preencho formulário e submeto,
  - Então Axios faz POST para API e atualiza estado Vue.js.
  - E em caso de erro, exibe mensagem amigável.
- Notas: Usar try/catch com tratamento específico por status code.

### RF-011
- Heading: Armazenamento JSON Simulado
- Descrição (testável): Dados persistidos em arquivos JSON (links.json, folders.json) com estrutura compatível com futuro D1/KV.
- Prioridade (Must/Should/Could): Must
- Racional: Persistência local para desenvolvimento.
- Dependências: RF-007
- Método de verificação (um): Inspeção
- Critérios de aceitação (Given/When/Then):
  - Dado que criei um link via API,
  - Quando verifico links.json,
  - Então encontro o novo link salvo com estrutura correta.
  - E dados persistem entre restarts do server.
- Notas: Usar fs.writeFileSync com JSON.stringify.

### RF-012
- Heading: Error Handling e Feedback Visual
- Descrição (testável): Tratamento de erros de API (400, 404, 409, 500) com mensagens específicas ao usuário via toast/alertas no Vue.js.
- Prioridade (Must/Should/Could): Should
- Racional: Experiência do usuário robusta.
- Dependências: RF-010
- Método de verificação (um): Teste
- Critérios de aceitação (Given/When/Then):
  - Dado que tento criar link com slug duplicado,
  - Quando API retorna 409,
  - Então frontend exibe "Slug já em uso" em destaque.
  - E usuário pode corrigir e tentar novamente.
- Notas: Usar Vue Toastification ou similar.

## 4.2 Requisitos não funcionais
### RNF-004 Performance Local
- Requisitos:
  1. APIs mock respondem em < 50ms localmente.
  2. Frontend atualiza estado em < 100ms após resposta.
  3. Mock server suporta concorrência básica.
- Critérios de aceitação:
  - DevTools Network mostra tempos < 50ms.
  - Interface permanece responsiva.
- Método de verificação: Análise com DevTools.

### RNF-005 Desenvolvimento
- Requisitos:
  1. Mock server com hot-reload automático.
  2. Logs detalhados das requisições para debug.
  3. Estrutura de dados compatível com Cloudflare.
- Critérios de aceitação:
  - Mudanças no código atualizam server automaticamente.
  - Console mostra todas as requisições recebidas.
- Método de verificação: Demonstração.

### RNF-006 Manutenibilidade
- Requisitos:
  1. Separação clara entre frontend e backend.
  2. Contratos de API documentados via JSDoc.
  3. Código backend preparado para migração Workers.
- Critérios de aceitação:
  - Frontend funciona independente do backend.
  - Endpoints documentados com exemplos.
- Método de verificação: Inspeção de código.

# 5) Dados (conceitual, sem implementação)
## 5.1 Entidades e campos (nível conceitual)
- **Link (JSON):**
  - `id` (Number): ID único.
  - `slug` (String): Parte customizada da URL.
  - `url_destination` (String): URL de destino.
  - `folder_hash` (String): Hash SHA256 da pasta.
  - `created_at` (String): ISO timestamp.
  - `clicks` (Number): Contador de cliques (mock).
- **Folder (JSON):**
  - `hash` (String): SHA256 identificador.
  - `created_at` (String): ISO timestamp.
  - `last_accessed` (String): ISO timestamp.

## 5.2 Regras, validações e integridade
- Slug deve ser único em todo o sistema.
- URL deve começar com http:// ou https://.
- Hash SHA256 gerado com crypto + timestamp + random.
- IDs sequenciais começando em 1.

## 5.3 Dados sensíveis, retenção e auditoria
- **Sensíveis:** URLs podem conter dados pessoais (tratar como na spec principal).
- **Retenção:** Dados mantidos indefinidamente em desenvolvimento.
- **Auditoria:** Logs de requisições no console do server.

# 6) Integrações (contratos narrativos)
- **INT-003 Mock Server (Node.js + Express)**
  - Objetivo: Simular backend real para desenvolvimento.
  - Entradas: Requisições HTTP JSON via REST API.
  - Saídas: Respostas JSON com status codes apropriados.
  - Erros esperados: 400 (bad request), 404 (not found), 409 (conflict).
  - Autenticação: Nenhuma (público).

- **INT-004 Axios (Frontend)**
  - Objetivo: Cliente HTTP para consumir APIs mock.
  - Entradas: Configurações de requisição (URL, método, dados).
  - Saídas: Promises com respostas da API.
  - Erros esperados: Network errors, timeout, status errors.
  - Autenticação: Nenhuma.

- **INT-005 Armazenamento JSON**
  - Objetivo: Persistência local de dados.
  - Entradas: Objetos JavaScript para serializar.
  - Saídas: Arquivos JSON com estrutura de dados.
  - Erros esperados: File system errors, JSON parse errors.
  - Autenticação: Nenhuma.

# 7) Estratégia de testes
## 7.1 Cenários mínimos do MVP
1. Criar link com slug único via API.
2. Tentar criar link com slug duplicado (deve falhar).
3. Listar links de uma pasta via hash.
4. Excluir link específico da pasta.
5. Tratar erro de URL inválida.
6. Testar concorrência de requisições.
7. Verificar persistência de dados.

## 7.2 Casos de borda
- Mock server offline durante requisição.
- Arquivos JSON corrompidos.
- Slug com caracteres especiais.
- Hash SHA256 colisão (improvável).
- Requisições simultâneas para mesmo slug.

## 7.3 Critério de aceite do release
A Fase 02 está pronta quando:
- Todos os RF Must passam nos testes.
- Frontend consome APIs mock corretamente.
- Dados persistem entre restarts.
- Erros são tratados com feedback adequado.
- Mock server está documentado.

# 8) Plano de execução para vibe coding
## 8.1 Ordem de construção (fatias finas)
1. **Setup Mock Server:**
   - `npm init -y` + express install.
   - Estrutura básica com CORS.
   - Endpoints placeholder retornando JSON.

2. **Implementar Storage JSON:**
   - Funções para ler/escrever links.json.
   - Estrutura inicial de dados.
   - Validações básicas.

3. **API de Criação de Links:**
   - POST `/api/links` completo.
   - Geração SHA256.
   - Validações de slug/URL.

4. **API de Gestão de Pastas:**
   - GET `/api/folder/:hash`.
   - DELETE `/api/links/:id`.
   - Lógica de associação pasta-link.

5. **Integração Frontend:**
   - Serviço HTTP com Axios.
   - Atualizar componentes Vue.js.
   - Tratamento de erros.

6. **Polimento Final:**
   - Logs detalhados no server.
   - Documentação de APIs.
   - Testes manuais completos.

## 8.2 Checkpoints por etapa
- **Pós-Setup:** Mock server responde "Hello World" na porta configurada.
- **Pós-Storage:** Arquivos JSON criados e lidos corretamente.
- **Pós-Criação:** POST `/api/links` cria links e retorna hash.
- **Pós-Gestão:** GET/DELETE funcionam para pastas e links.
- **Pós-Integração:** Frontend Vue.js consome APIs sem erros.
- **Pós-Polimento:** Sistema completo funcionando localmente.

## 8.3 Prompt pack operacional
- **Objetivo do build:** Implementar [API/Componente] conforme spec-fase-02.md.
- **Restrições:**
  - Mock server deve rodar independentemente do frontend.
  - Estrutura JSON compatível com D1/KV futuro.
  - APIs RESTful com status codes corretos.
  - Tratamento de todos os erros.
- **Definição de pronto:**
  - API testada via curl/Postman.
  - Frontend integra sem erros.
  - Dados persistem corretamente.
- **Como validar:**
  1. Testar endpoints com curl.
  2. Verificar arquivos JSON.
  3. Testar integração Vue.js.
  4. Simular cenários de erro.
- **Como registrar mudanças:**
  - Atualizar changelog da fase.

# 9) Riscos e mitigação
- **Risco:** Diferenças entre ambiente Node.js e Workers. **Mitigação:** Manter lógica pura, evitar dependências Node.js-specific.
- **Risco:** Performance do JSON storage. **Mitigação:** Estrutura otimizada, considerar indexação futura.
- **Risco:** Concorrência em arquivos JSON. **Mitigação:** Lock files simples para desenvolvimento.

# 10) Checklists
## 10.1 Pronto para implementar
- [x] Stack definido (Node.js + Express + Vue.js)
- [x] APIs e contratos especificados
- [x] Estrutura de dados definida
- [x] Fluxos de integração mapeados
- [x] Estratégia de testes completa

## 10.2 Segurança do vibe coding
- [x] Validação de inputs no backend
- [x] Sanitização contra XSS
- [x] CORS configurado corretamente
- [x] Logs sem dados sensíveis

# 11) Decisões e Changelog
## 11.1 Decisões
- **DEC-005:** Node.js + Express para mock server por simplicidade e ecossistema maduro.
- **DEC-006:** Armazenamento JSON por visibilidade e compatibilidade com D1.
- **DEC-007:** Axios para cliente HTTP por interceptors e tratamento de erros.
- **DEC-008:** SHA256 para hashes por segurança e compatibilidade futura.

## 11.2 Changelog
- v0.1: documento inicial da fase 02
- v1.0: especificação completa com APIs mock, integração Vue.js e plano
