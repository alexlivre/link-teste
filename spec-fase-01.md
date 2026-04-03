# INKPAGE_FASE-01_SPEC_v1.0.md

# 0) Metadados
- Projeto: INKPAGE (inkpage.com.br)
- Fase: 01 - Fundações Locais com Vue.js
- Versão: 1.0
- Data: 03/04/2026
- Status (draft/review/final): draft
- Público: IA desenvolvedora (vibe coding) + stakeholders (Alex)
- Stack: Vue.js 3 + Vue Router + localStorage
- Resumo em 2 linhas: Especificação para a base do projeto INKPAGE com frontend Vue.js 100% client-side, incluindo gerador WhatsApp, navegação e estado local, sem dependências de backend.

# 1) Visão (PRD)
## 1.1 Objetivo e problema
**Objetivo:** Criar a base funcional do INKPAGE com Vue.js, entregando um MVP 100% local com gerador WhatsApp e navegação fluida.
**Problema:** Usuários precisam de uma ferramenta instantânea para gerar links de WhatsApp, enquanto desenvolvedores precisam de uma base sólida e reativa para evolução futura do sistema.

## 1.2 Público-alvo (personas)
1. **Desenvolvedor (Alex):** Precisa de uma base Vue.js estruturada, componentizada e com roteamento para evolução incremental.
2. **Usuário Final:** Precisa gerar links de WhatsApp rapidamente com interface responsiva e feedback imediato.

## 1.3 Métricas de sucesso (1 primária + 2 secundárias)
- **Primária:** Gerador WhatsApp 100% funcional no navegador com validações e feedback visual.
- **Secundária 1:** Navegação entre páginas Vue.js sem reload (SPA fluido).
- **Secundária 2:** Estado persistente em localStorage (preferências e histórico local).

## 1.4 Não-metas (por que NÃO fazer agora)
- Integração com APIs externas.
- Sistema de autenticação.
- Persistência em banco de dados.
- Deploy em produção.

# 2) Escopo
## 2.1 MVP (no escopo)
1. **Projeto Vue.js Setup:** Configuração inicial com Vue CLI ou Vite, estrutura de componentes e roteamento.
2. **Gerador de Link WhatsApp (Componente):** Formulário reativo com validação, limpeza de número e geração instantânea do link `wa.me`.
3. **Navegação SPA:** Vue Router configurado para rotas: `/` (home), `/whatsapp`, `/encurtar`, `/pasta`.
4. **Estado Local:** Vuex/Pinia ou Composition API para gerenciar estado global e persistência em localStorage.
5. **Interface Responsiva:** Design mobile-first com Tailwind CSS ou similar.
6. **Validações Client-side:** Validação de número de telefone, formato de URL e slug em tempo real.
7. **Feedback Visual:** Estados de loading, sucesso, erro com componentes reativos.
8. **Oferta de Encurtamento:** Botão que redireciona para página de encurtamento com URL pré-preenchida.

## 2.2 Fora do escopo (agora)
- Criação real de links encurtados.
- Sistema de pastas e hashes SHA256.
- Redirecionamento real de URLs.
- Painel administrativo.
- Analytics e métricas.
- Integração com backend.

## 2.3 Assunções (com risco e como mudar depois)
- **ASSUNÇÃO 01 (Risco: Baixo)**
  - Decisão: Vue.js 3 com Composition API será o padrão.
  - Por que: Sintaxe moderna, reatividade melhorada e compatibilidade com TypeScript futuro.
  - Risco: Curva de aprendizado inicial.
  - Mitigação: Documentação clara e componentes simples no início.
  - Como mudar depois: Migrar para Options API se necessário (compatível).

- **ASSUNÇÃO 02 (Risco: Baixo)**
  - Decisão: Tailwind CSS para estilização.
  - Por que: Desenvolvimento rápido, design system consistente e utilitários prontos.
  - Risco: Nenhum.
  - Mitigação: N/A.
  - Como mudar depois: Migrar para CSS Modules ou Styled Components.

- **ASSUNÇÃO 03 (Risco: Médio)**
  - Decisão: Estado gerenciado com Composition API + localStorage.
  - Por que: Simplicidade para fase inicial, sem necessidade de store complexo.
  - Risco: Pode se tornar complexo com crescimento do estado.
  - Mitigação: Estrutura preparada para migração para Pinia/Vuex.
  - Como mudar depois: Implementar store centralizado quando necessário.

## 2.4 Perguntas em aberto (máx. 10; se vazio, escrever "Nenhuma")
1. Qual framework CSS preferido (Tailwind, Bootstrap, ou CSS puro)?
2. Deve incluir TypeScript nesta fase ou apenas JavaScript?
3. Há algum design system ou brand guidelines a seguir?
4. Qual o nível de complexidade desejado para validações (regex simples ou biblioteca)?

# 3) UX e Fluxos
## 3.1 Jornada principal (passo a passo)
1. **Acesso:** Usuário acessa `localhost:3000` (ou similar).
2. **Navegação:** Clica no menu para "Gerar Link do WhatsApp".
3. **Geração (WhatsApp):**
   a. Preenche número (com máscara automática) e mensagem.
   b. Visualiza o link `wa.me` gerado em tempo real.
   c. Clica em "Copiar" com feedback visual.
   d. Vê oferta para "Obter link curto" e clica.
4. **Redirecionamento para Encurtador:** É levado à página `/encurtar` com campo URL pré-preenchido.
5. **Navegação Adicional:** Pode acessar `/pasta` (placeholder) e voltar à home.

## 3.2 Fluxos alternativos e falhas
- **Número inválido:** Feedback inline "Formato de telefone inválido".
- **Campo vazio:** Botão desabilitado até preenchimento mínimo.
- **Navegação direta:** Acessar rotas diretamente pela URL funciona.
- **Browser refresh:** Estado persistido via localStorage.
- **Offline:** Aplicação continua funcional para geração de links.

## 3.3 Estados (vazio/carregando/sucesso/erro)
- **Carregando:** Spinner sutil ao gerar link (processamento rápido).
- **Sucesso:** Link gerado destacado com botão de copiar.
- **Erro:** Mensagem inline abaixo do campo específico.
- **Vazio:** Estado inicial do formulário.
- **Copiado:** Feedback visual "Copiado!" no botão.

## 3.4 Microcopy crítica (mensagens e rótulos)
- **Placeholder Telefone:** "(11) 98765-4321"
- **Placeholder Mensagem:** "Digite sua mensagem aqui..."
- **Botão Gerar:** "Gerar Link do WhatsApp"
- **Botão Copiar:** "Copiar Link"
- **Feedback Copiado:** "Copiado! ✓"
- **Oferta Encurtamento:** "Quer um link curto e rastreável?"
- **Label Slug:** "Personalize seu link: inkpage.com.br/_____"
- **Menu Navegação:** "Início", "WhatsApp", "Encurtador", "Minha Pasta"

# 4) Requisitos (SRS)
## 4.1 Requisitos funcionais
### RF-001
- Heading: Gerador de Link WhatsApp (Vue.js Component)
- Descrição (testável): Componente Vue.js `<WhatsAppGenerator>` deve conter formulário reativo com campos número e mensagem, validação em tempo real, e exibir link `wa.me` gerado instantaneamente sem requisições ao servidor.
- Prioridade (Must/Should/Could): Must
- Racional: Funcionalidade principal de atração, deve ser 100% client-side.
- Dependências: Nenhuma.
- Método de verificação (um): Demonstração
- Critérios de aceitação (Given/When/Then):
  - Dado que estou na página do gerador WhatsApp,
  - Quando insiro "(11) 98765-4321" e "Olá, tudo bem?",
  - Então vejo o link "https://wa.me/5511987654321?text=Ol%C3%A1%2C%20tudo%20bem%3F" instantaneamente.
  - E quando clico em "Copiar", o link é copiado para área de transferência.
- Notas: Usar v-model para reatividade, computed properties para geração do link.

### RF-002
- Heading: Navegação SPA com Vue Router
- Descrição (testável): Vue Router configurado para rotas `/`, `/whatsapp`, `/encurtar`, `/pasta` com navegação sem reload e menu ativo destacado.
- Prioridade (Must/Should/Could): Must
- Racional: Experiência de usuário moderna e base para evolução.
- Dependências: RF-001
- Método de verificação (um): Teste
- Critérios de aceitação (Given/When/Then):
  - Dado que estou na página inicial,
  - Quando clico no menu "WhatsApp",
  - Então a URL muda para `/whatsapp` sem reload e o menu item fica ativo.
  - E quando uso o botão voltar do navegador, retorno à página anterior.
- Notas: Usar router-link para navegação declarativa.

### RF-003
- Heading: Oferta de Encurtamento Pós-Geração
- Descrição (testável): Após gerar link WhatsApp, exibir botão que navega para `/encurtar` com campo URL pré-preenchido com o link `wa.me` gerado.
- Prioridade (Must/Should/Could): Should
- Racional: Mecanismo de conversão para funcionalidade futura.
- Dependências: RF-001, RF-002
- Método de verificação (um): Teste
- Critérios de aceitação (Given/When/Then):
  - Dado que gerei um link WhatsApp,
  - Quando clico em "Obter link curto",
  - Então sou redirecionado para `/encurtar` com o campo URL preenchido.
- Notas: Usar query params ou estado global para传递 URL.

### RF-004
- Heading: Estado Persistente em localStorage
- Descrição (testável): Preferências do usuário (último número usado, histórico recente) devem persistir em localStorage e ser restauradas ao recarregar a página.
- Prioridade (Must/Should/Could): Should
- Racional: Melhora experiência de usuário com dados persistentes.
- Dependências: RF-001
- Método de verificação (um): Teste
- Critérios de aceitação (Given/When/Then):
  - Dado que gerei um link com número "(11) 98765-4321",
  - Quando recarrego a página,
  - Então o campo número mantém o valor anterior.
- Notas: Usar localStorage API com try/catch para segurança.

### RF-005
- Heading: Interface Responsiva com Tailwind CSS
- Descrição (testável): Layout deve ser responsivo funcionando perfeitamente em mobile (320px+) até desktop (1920px+).
- Prioridade (Must/Should/Could): Must
- Racional: Acesso universal em diferentes dispositivos.
- Dependências: Nenhuma.
- Método de verificação (um): Inspeção
- Critérios de aceitação (Given/When/Then):
  - Dado que acesso a aplicação em um dispositivo mobile,
  - Quando visualizo a página,
  - Então o layout se adapta com menu hamburguer e campos touch-friendly.
- Notas: Usar responsive design do Tailwind.

## 4.2 Requisitos não funcionais
### RNF-001 Performance
- Requisitos:
  1. Tempo de resposta da interface < 100ms para interações.
  2. Bundle size inicial < 100KB gzipped.
  3. Nenhuma requisição de rede para funcionalidades core.
- Critérios de aceitação:
  - Lighthouse performance score > 90.
  - DevTools mostra interações em < 100ms.
- Método de verificação: Análise com ferramentas.

### RNF-002 Acessibilidade
- Requisitos:
  1. Navegação por teclado funcional.
  2. Contraste WCAG AA compliance.
  3. Semântica HTML5 correta.
- Critérios de aceitação:
  - Lighthouse accessibility score > 90.
  - Tab navigation funciona em todos elementos.
- Método de verificação: Inspeção com ferramentas.

### RNF-003 Manutenibilidade
- Requisitos:
  1. Componentes Vue.js com single responsibility.
  2. Código documentado com JSDoc onde necessário.
  3. Estrutura de arquivos organizada e escalável.
- Critérios de aceitação:
  - Cada componente < 200 linhas.
  - Props e emits documentados.
- Método de verificação: Inspeção de código.

# 5) Dados (conceitual, sem implementação)
## 5.1 Entidades e campos (nível conceitual)
- **Preferências do Usuário:**
  - `last_phone` (Texto): Último número usado.
  - `last_message` (Texto): Última mensagem enviada.
  - `theme` (Texto): Preferência de tema (light/dark).
- **Histórico Local:**
  - `generated_links` (Array): Lista de links gerados localmente.
  - `timestamp` (Data): Data/hora da geração.
  - `type` (Texto): 'whatsapp', 'generic'.

## 5.2 Regras, validações e integridade
- Telefone deve seguir padrão brasileiro: `(XX) XXXXX-XXXX` ou `(XX) XXXX-XXXX`.
- Mensagem não pode estar vazia e máximo 1000 caracteres.
- Links gerados devem ser válidos (começar com `https://wa.me/`).

## 5.3 Dados sensíveis, retenção e auditoria
- **Sensíveis:** Nenhuma informação sensível nesta fase.
- **Retenção:** Dados locais mantidos indefinidamente ou até limpeza do browser.
- **Auditoria:** Logs de desenvolvimento no console apenas.

# 6) Integrações (contratos narrativos)
- **INT-001 Vue Router**
  - Objetivo: Navegação client-side sem reload.
  - Entradas: Rotas configuradas (`/`, `/whatsapp`, `/encurtar`, `/pasta`).
  - Saídas: Componentes renderizados dinamicamente.
  - Erros esperados: Rota não encontrada (404).
  - Autenticação: Nenhuma (público).

- **INT-002 localStorage**
  - Objetivo: Persistência de estado local.
  - Entradas: Dados serializados JSON.
  - Saídas: Dados recuperados parseados.
  - Erros esperados: Quota excedida, disabled no private mode.
  - Autenticação: Nenhuma.

# 7) Estratégia de testes
## 7.1 Cenários mínimos do MVP
1. Gerar link WhatsApp com número válido.
2. Validar número inválido e mostrar erro.
3. Navegar entre páginas sem reload.
4. Copiar link para área de transferência.
5. Redirecionar para encurtador com URL pré-preenchida.
6. Persistir dados ao recarregar página.
7. Testar responsividade em diferentes tamanhos.

## 7.2 Casos de borda
- Número com formato internacional.
- Mensagem com caracteres especiais (emojis, acentos).
- Navegação direta pela URL.
- localStorage desabilitado.
- Browser offline.

## 7.3 Critério de aceite do release
A Fase 01 está pronta quando:
- Todos os RF Must passam nos testes.
- Interface funciona em mobile e desktop.
- Navegação SPA está fluida.
- Estado persiste corretamente.
- Código está organizado e documentado.

# 8) Plano de execução para vibe coding
## 8.1 Ordem de construção (fatias finas)
1. **Setup Projeto Vue.js:**
   - `npm create vue@latest` ou Vite setup.
   - Configurar Tailwind CSS.
   - Estrutura de pastas (components, views, router).

2. **Componente WhatsAppGenerator:**
   - Formulário reativo com v-model.
   - Validações em tempo real.
   - Computed property para geração do link.

3. **Vue Router Setup:**
   - Configurar rotas principais.
   - Componentes de navegação.
   - Menu responsivo.

4. **Estado Local:**
   - Implementar persistência localStorage.
   - Composables para estado reativo.

5. **Interface e UX:**
   - Design responsivo.
   - Estados de loading/erro/sucesso.
   - Microcopy implementada.

6. **Polimento Final:**
   - Otimizações de performance.
   - Testes manuais.
   - Documentação básica.

## 8.2 Checkpoints por etapa
- **Pós-Setup:** Projeto Vue.js roda localmente, Tailwind funcionando.
- **Pós-Componente:** Gerador WhatsApp funcional 100% client-side.
- **Pós-Router:** Navegação SPA fluida entre páginas.
- **Pós-Estado:** Dados persistem ao recarregar.
- **Pós-Interface:** Layout responsivo e acessível.
- **Pós-Polimento:** Performance otimizada, código limpo.

## 8.3 Prompt pack operacional
- **Objetivo do build:** Implementar [Componente/Função] conforme spec-fase-01.md.
- **Restrições:**
  - Usar Vue 3 Composition API.
  - Componentes < 200 linhas.
  - Sem dependências externas além de Vue/Tailwind.
  - Código deve ser acessível e responsivo.
- **Definição de pronto:**
  - Funcionalidade testada manualmente.
  - Componente reutilizável.
  - Código documentado.
- **Como validar:**
  1. Testar no navegador (Chrome DevTools).
  2. Verificar responsividade (mobile/desktop).
  3. Testar acessibilidade (Lighthouse).
- **Como registrar mudanças:**
  - Atualizar changangelog da fase.

# 9) Riscos e mitigação
- **Risco:** Complexidade excessiva no estado local. **Mitigação:** Manter estado simples, usar composables.
- **Risco:** Performance do bundle. **Mitigação:** Lazy loading de componentes, code splitting.
- **Risco:** Compatibilidade browser. **Mitigação:** Polyfills se necessário, testar em browsers principais.

# 10) Checklists
## 10.1 Pronto para implementar
- [x] Objetivo e público definidos
- [x] Stack tecnológico escolhido
- [x] Requisitos funcionais claros
- [x] Fluxos UX definidos
- [x] Estrutura de dados conceitual
- [x] Plano de testes mínimo

## 10.2 Segurança do vibe coding
- [x] Nenhuma informação sensível nesta fase
- [x] Validações client-side implementadas
- [x] Código sanitizado contra XSS
- [x] Uso seguro de localStorage

# 11) Decisões e Changelog
## 11.1 Decisões
- **DEC-001:** Vue.js 3 com Composition API escolhido por sintaxe moderna e reatividade aprimorada.
- **DEC-002:** Tailwind CSS para design system consistente e desenvolvimento rápido.
- **DEC-003:** Estado gerenciado com composables + localStorage para simplicidade inicial.
- **DEC-004:** Navegação SPA com Vue Router para experiência moderna.

## 11.2 Changelog
- v0.1: documento inicial da fase 01
- v1.0: especificação completa com Vue.js, requisitos e plano de execução
