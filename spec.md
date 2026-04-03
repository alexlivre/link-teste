INKPAGE_SPEC_v1.0.md

# 0) Metadados
- Projeto: INKPAGE (inkpage.com.br)
- Versão: 1.0
- Data: 03/04/2026
- Status (draft/review/final): draft
- Público: IA desenvolvedora (vibe coding) + stakeholders (Alex)
- Resumo em 2 linhas: Especificação para uma ferramenta de encurtamento de links e geração de URLs de WhatsApp, construída na stack Cloudflare (Workers, Pages, D1, KV), focada em performance, custo zero e crescimento orgânico, com controle administrativo total via Cloudflare Access.

# 1) Visão (PRD)
## 1.1 Objetivo e problema
**Objetivo:** Ser a ferramenta mais rápida e limpa para criar links de WhatsApp e encurtar URLs, crescendo organicamente até 10k acessos/mês.
**Problema:** Usuários precisam de uma solução simples e instantânea para gerar links de WhatsApp prontos para uso e encurtar URLs longas, sem barreiras de cadastro, anúncios intrusivos ou lentidão, enquanto o mantenedor precisa de controle total sobre o tráfego e custos (operar dentro do limite gratuito da Cloudflare).

## 1.2 Público-alvo (personas)
1.  **Criador de Conteúdo/Empreendedor:** Precisa gerar links de WhatsApp com mensagem pré-preparada para campanhas ou atendimento. Valoriza velocidade e simplicidade. Pode querer encurtar e rastrear o link posteriormente.
2.  **Usuário Casual de Internet:** Precisa encurtar uma URL longa para compartilhar em redes sociais ou mensagens. Busca uma ferramenta gratuita, limpa (sem anúncios) e confiável.
3.  **Administrador (Alex):** Requer monitoramento e controle absoluto sobre a plataforma: métricas de tráfego, gestão de abusos, configuração de limites e ativação de funcionalidades futuras.

## 1.3 Métricas de sucesso (1 primária + 2 secundárias)
- **Primária:** Atingir e manter ≥ 10.000 redirecionamentos (cliques em links encurtados) por mês.
- **Secundária 1:** Taxa de conversão ≥ 15% (usuários que geram um link de WhatsApp e optam por encurtá-lo no domínio inkpage.com.br).
- **Secundária 2:** Manter o consumo de requisições do Cloudflare Worker abaixo de 90% do limite diário gratuito (≤ 90.000 req/dia) sob tráfego normal.

## 1.4 Não-metas (por que NÃO fazer agora)
- Sistema de cadastro tradicional com e-mail/senha.
- Qualquer forma de anúncio ou monetização no produto (será uma decisão futura, pós 10k/mês).
- APIs públicas ou documentação para desenvolvedores externos.
- Aplicativos móveis nativos (iOS/Android).
- Funcionalidades sociais (compartilhamento em feed, likes).

# 2) Escopo
## 2.1 MVP (no escopo)
1.  **Página Estática (Cloudflare Pages):** Homepage com navegação para as ferramentas.
2.  **Gerador de Link WhatsApp (Client-side):** Página com campos para número e mensagem; JS gera link `wa.me` instantaneamente; oferta para encurtar no domínio.
3.  **Encurtador de Links Simples:** Página com campo para URL longa; gera slug aleatório ou customizado.
4.  **Sistema de Pastas via Hash:** Geração de um hash SHA256 como "chave mestre" para o usuário acessar e gerenciar seus links (criar, listar, excluir).
5.  **Motor de Redirecionamento (Worker):** Rota dinâmica (`/:slug`) que redireciona para a URL de destino. Consulta rápida via KV.
6.  **Sistema de Cotas e Bloqueio:** Limites de redirecionamentos por link (1k/dia, 5k/semana, 15k/mês). Bloqueio silencioso (HTTP 204/429) ao atingir limite.
7.  **Contagem e Analytics Leves:** Registro assíncrono de cliques (país, referência) para o painel admin.
8.  **Painel de Administração Protegido:** Acesso via Cloudflare Access (Zero Trust) em `/admin`. Dashboard com métricas, gestão de links/pastas, configuração de cotas e ferramentas de banimento.
9.  **SEO Básico:** Páginas estáticas otimizadas (sitemap, robots.txt, meta tags) no Cloudflare Pages. Tratamento diferenciado para bots de busca/redes sociais.

## 2.2 Fora do escopo (agora)
- Páginas intersticiais (com anúncios ou contagem regressiva).
- Sistema de login com e-mail/senha.
- Planos premium ou pagamentos.
- API para criação/gestão de links por terceiros.
- Edição da URL de destino de um link já criado.
- Recuperação da chave SHA256 caso o usuário a perca.
- Notificações por e-mail ou push para o usuário final.
- Logotipos customizáveis ou páginas de perfil.
- Integração com outras plataformas (ex: API do WhatsApp Business).

## 2.3 Assunções (com risco e como mudar depois)
- **ASSUNÇÃO 01 (Risco: Médio)**
  - Decisão: O público-alvo primário é o usuário brasileiro (PT-BR).
  - Por que: O domínio é `.com.br` e o foco inicial é em ferramentas para WhatsApp, amplamente usado no Brasil.
  - Risco: Pode limitar a atratividade para usuários internacionais.
  - Mitigação: A interface é simples e pode ser compreendida intuitivamente. O sistema de geolocalização de cliques no painel ajudará a identificar demanda externa.
  - Como mudar depois: Adicionar suporte a i18n (internacionalização) no frontend estático, mantendo o PT-BR como padrão.

- **ASSUNÇÃO 02 (Risco: Baixo)**
  - Decisão: Não há integrações externas obrigatórias para o MVP.
  - Por que: O gerador de WhatsApp é client-side, e o redirecionamento é auto-contido.
  - Risco: Nenhum.
  - Mitigação: N/A.
  - Como mudar depois: Adicionar novas integrações (ex: validação de URL via API de segurança) como serviços extras no Worker.

- **ASSUNÇÃO 03 (Risco: Alto)**
  - Decisão: Os dados armazenados (URLs, hashes, contagem de cliques) não são classificados como "dados pessoais sensíveis" sob a LGPD, pois o sistema é anônimo por design (sem e-mail, CPF, etc.).
  - Por que: A única informação do usuário é a URL de destino e um hash gerado pelo sistema. Não há coleta direta de identificadores.
  - Risco: Alto. URLs podem conter informações pessoais indiretamente (ex: `meusite.com/perfil?userId=123`). Além disso, a interpretação da LGPD pode ser ampla.
  - Mitigação: Adicionar cláusula de isenção de responsabilidade na página de criação de link, informando que o usuário não deve inserir URLs com dados pessoais. Implementar redaction de logs no Worker para não registrar a URL completa em logs de erro.
  - Como mudar depois: Criar um processo formal de Avaliação de Impacto à Proteção de Dados (AIPD) e revisar a política de retenção de dados se necessário.

- **ASSUNÇÃO 04 (Risco: Médio)**
  - Decisão: O limite de 100.000 requisições diárias do Cloudflare Workers Free será suficiente para o crescimento inicial e a meta de 10k cliques/mês.
  - Por que: A arquitetura foi projetada para minimizar requisições (cache, bloqueio de bots, processamento client-side).
  - Risco: Um link pode virar viral e consumir muitas requisições em um dia, esgotando a cota.
  - Mitigação: A lógica de cotas por link (1k/dia) atua como um primeiro limitador. O "Modo de Segurança" (Global Kill Switch) no painel admin permite uma reação manual imediata.
  - Como mudar depois: Atualizar para um plano pago da Cloudflare se o tráfego sustentado justificar o custo.

## 2.4 Perguntas em aberto (máx. 10; se vazio, escrever “Nenhuma”)
1.  Qual o e-mail que será configurado para o acesso ao Cloudflare Access (Zero Trust)?
2.  Há alguma palavra-chave ou slug reservado que não deva ser usado (ex: `admin`, `api`)?
3.  Deve haver um limite máximo de links por pasta SHA256?
4.  Qual o comportamento desejado se um usuário tentar criar um slug já existente? (Sugestão: notificar "slug indisponível").
5.  Deve existir uma página de "Termos de Uso" ou "Política de Privacidade" estática?

# 3) UX e Fluxos
## 3.1 Jornada principal (passo a passo)
1.  **Acesso:** Usuário acessa `inkpage.com.br`.
2.  **Escolha da Ferramenta:** Clica em "Gerar Link do WhatsApp" ou "Encurtar URL".
3.  **Geração (WhatsApp):**
    a. Preenche número (com ou sem máscara) e mensagem.
    b. Visualiza o link `wa.me` gerado instantaneamente.
    c. Clica em "Copiar".
    d. Vê opção: "Quer um link curto e rastreável?" e clica.
    e. Insere um slug desejado (ex: `minha-loja`). Sistema verifica disponibilidade.
    f. Recebe o link `inkpage.com.br/minha-loja` e a **Chave Secreta (SHA256)**. É instruído a salvá-la.
4.  **Geração (Encurtador):**
    a. Cola a URL longa.
    b. (Opcional) Insere um slug customizado ou deixa em branco para um aleatório.
    c. Clica em "Encurtar".
    d. Recebe o link curto e a **Chave Secreta (SHA256)**.
5.  **Gerenciamento:** Usuário pode acessar `inkpage.com.br/pasta`, colar seu SHA256 e ver a lista de links, com cliques e status, podendo excluí-los.
6.  **Redirecionamento:** Terceiro clica no link curto `inkpage.com.br/minha-loja`. É redirecionado instantaneamente para a URL de destino, se dentro das cotas.

## 3.2 Fluxos alternativos e falhas
- **Slug já existe:** Usuário é notificado para escolher outro.
- **URL inválida no encurtador:** Mensagem de erro "Por favor, insira uma URL válida (começando com http:// ou https://)".
- **Hash SHA256 perdido:** Não há recuperação. Fluxo finaliza. Microcopy orienta: "Guarde esta chave com segurança. Se perdê-la, perderá o acesso a esta pasta."
- **Link bloqueado por cota:** Terceiro, ao clicar, recebe uma resposta HTTP de erro (204/429) e o navegador exibe uma página em branco ou de erro genérico.
- **Acesso a pasta com hash inválido:** Página exibe "Pasta não encontrada".
- **Bot de busca acessando link:** O Worker identifica e permite o redirecionamento direto (sem contabilizar para cota ou analytics).

## 3.3 Estados (vazio/carregando/sucesso/erro/sem permissão)
- **Pasta Vazia:** Tela da pasta com mensagem "Você ainda não criou nenhum link. Comece pela página inicial."
- **Carregando (API):** Indicador sutil (ex: esqueleto de linha) ao carregar a lista de links na pasta.
- **Sucesso (Criação):** Feedback visual claro com o link curto e a chave SHA256 em um campo destacado e copiável.
- **Erro (Validação):** Mensagem inline abaixo do campo com o problema (ex: "Slug indisponível", "URL inválida").
- **Sem Permissão (Admin):** Tentativa de acessar `/admin` sem autenticação pelo Cloudflare Access resulta na tela de login do Zero Trust.

## 3.4 Microcopy crítica (mensagens e rótulos)
- **Botão de Copiar:** "Copiar link"
- **Feedback ao Copiar:** "Copiado!"
- **Chamada para ação (WhatsApp):** "Quer um link curto, limpo e que você pode rastrear?"
- **Label do Campo Slug:** "Personalize seu link (opcional): inkpage.com.br/_____"
- **Instrução da Chave:** "**Sua Chave de Acesso (SHA256):** [HASH] **Guarde esta chave!** Ela é a senha para acessar e gerenciar seus links no futuro."
- **Título da Página de Pasta:** "Sua Pasta de Links"
- **Placeholder do Campo Hash:** "Cole sua Chave de Acesso (SHA256) aqui..."
- **Status na Pasta:** "Ativo", "Cota Diária Esgotada", "Cota Semanal Esgotada", "Cota Mensal Esgotada".

# 4) Requisitos (SRS)
> Regra: todo requisito deve ser testável e conter método de verificação primário: Teste | Demonstração | Inspeção | Análise.

## 4.1 Requisitos funcionais
### RF-001
- Heading: Gerador de Link WhatsApp (Client-side)
- Descrição (testável): A página `/whatsapp` deve conter dois campos (número, mensagem) e, ao preenchê-los, exibir instantaneamente o link gerado no formato `https://wa.me/<numeroLimpo>?text=<mensagemCodificada>`, sem realizar chamadas ao servidor.
- Prioridade (Must/Should/Could): Must
- Racional: É a funcionalidade principal de atração de tráfego e deve ser a mais rápida possível, economizando requisições do Worker.
- Dependências: Nenhuma.
- Método de verificação (um): Demonstração
- Critérios de aceitação (Given/When/Then):
    - Dado que estou na página do gerador de WhatsApp,
    - Quando insiro o número "11 98765-4321" e a mensagem "Olá, gostaria de informações",
    - Então vejo o link gerado: `https://wa.me/5511987654321?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es` e um botão para copiá-lo.
- Notas: A limpeza do número (remover parênteses, espaços, traços) e a codificação da mensagem (encodeURIComponent) devem ser feitas por JavaScript.

### RF-002
- Heading: Oferta de Encurtamento Pós-Geração WhatsApp
- Descrição (testável): Após gerar o link do WhatsApp, a página deve exibir um botão/opção chamativa que, ao ser clicado, redireciona o usuário para a interface de encurtamento, pré-preenchendo a URL longa com o link `wa.me` gerado.
- Prioridade (Must/Should/Could): Should
- Racional: É o mecanismo de conversão para trazer o usuário para a plataforma de encurtamento.
- Dependências: RF-001
- Método de verificação (um): Teste
- Critérios de aceitação (Given/When/Then):
    - Dado que acabei de gerar um link do WhatsApp,
    - Quando clico no botão "Obter link curto (inkpage.com.br/seulink)",
    - Então sou redirecionado para a página de encurtamento com o campo de URL longa preenchido com o link `wa.me`.
- Notas: O texto do botão deve ser persuasivo.

### RF-003
- Heading: Encurtamento de URL com Slug
- Descrição (testável): A página `/encurtar` deve permitir ao usuário inserir uma URL longa válida e um slug opcional. Ao submeter, o sistema deve verificar a unicidade do slug, salvar a associação e retornar o link curto `inkpage.com.br/<slug>`.
- Prioridade (Must/Should/Could): Must
- Racional: Funcionalidade core do produto.
- Dependências: RF-007 (Sistema de Pastas)
- Método de verificação (um): Teste
- Critérios de aceitação (Given/When/Then):
    - Dado que estou na página de encurtamento com uma URL válida e um slug único "minha-campanha",
    - Quando clico em "Encurtar",
    - Então recebo o link `inkpage.com.br/minha-campanha`, uma mensagem de sucesso e a Chave Secreta SHA256.
    - E quando tento criar outro link com o mesmo slug "minha-campanha", recebo uma mensagem de erro informando que o slug já está em uso.
- Notas: O slug deve ser normalizado (minúsculas, substituir espaços por hífens).

### RF-004
- Heading: Sistema de Pastas via Hash SHA256
- Descrição (testável): Ao criar o primeiro link, o sistema deve gerar um hash SHA256 único, apresentá-lo ao usuário como "Chave Secreta" e associar o novo link a essa "pasta". Uma página `/pasta` deve permitir, ao inserir o hash, listar todos os links daquela pasta.
- Prioridade (Must/Should/Could): Must
- Racional: Fornece gestão ao usuário sem necessidade de cadastro.
- Dependências: RF-003
- Método de verificação (um): Teste
- Critérios de aceitação (Given/When/Then):
    - Dado que criei um link e recebi um hash SHA256 `abc123`,
    - Quando acesso `inkpage.com.br/pasta` e insiro o hash `abc123`,
    - Então vejo uma lista contendo o link que criei, com seu slug, URL de destino e contador de cliques.
    - E quando insiro um hash inválido/inexistente, vejo a mensagem "Pasta não encontada".
- Notas: A geração do hash deve ser determinística a partir de um segredo + timestamp, ou aleatória. A associação link-pasta é many-to-one.

### RF-005
- Heading: Redirecionamento Rápido com Cache (Worker)
- Descrição (testável): Ao acessar `inkpage.com.br/:slug`, o Worker deve buscar a URL de destino no Cloudflare KV (cache primário). Se encontrado e o link estiver ativo (dentro das cotas), deve responder com um HTTP 301 para a URL de destino.
- Prioridade (Must/Should/Could): Must
- Racional: A latência de redirecionamento deve ser mínima. O KV é acessado na edge.
- Dependências: RF-008 (Cotas)
- Método de verificação (um): Teste
- Critérios de aceitação (Given/When/Then):
    - Dado que existe um link `inkpage.com.br/teste` apontando para `https://exemplo.com`,
    - Quando faço uma requisição GET para `inkpage.com.br/teste`,
    - Então recebo um status HTTP 301 com o header `Location` igual a `https://exemplo.com`.
    - E o tempo de resposta é inferior a 50ms (medido na edge).
- Notas: O código 301 (Permanente) é melhor para SEO que 302.

### RF-006
- Heading: Bloqueio Silencioso por Cota
- Descrição (testável): Se um link tiver excedido qualquer uma de suas cotas (diária, semanal, mensal), o Worker, ao receber o acesso, deve responder com um status HTTP 429 (Too Many Requests) ou 204 (No Content) sem corpo, e não deve processar a contagem do clique.
- Prioridade (Must/Should/Could): Must
- Racional: Economia radical de recursos e processamento.
- Dependências: RF-005, RF-008
- Método de verificação (um): Teste
- Critérios de aceitação (Given/When/Then):
    - Dado que o link `inkpage.com.br/promo` já atingiu 1000 cliques hoje,
    - Quando faço uma requisição GET para `inkpage.com.br/promo`,
    - Então recebo um status HTTP 429 (ou 204) e uma resposta vazia (sem HTML, sem redirecionamento).
- Notas: O bloqueio deve ser consultado no KV para velocidade.

### RF-007
- Heading: Contagem de Cliques e Analytics Assíncrono
- Descrição (testável): Após realizar um redirecionamento bem-sucedido (RF-005), o Worker deve, de forma assíncrona (`context.waitUntil`), incrementar os contadores de cliques no KV e registrar um evento de analytics no D1 com informações básicas (slug, timestamp, país, user-agent de referência).
- Prioridade (Must/Should/Could): Should
- Racional: Necessário para as métricas do painel admin e para o sistema de cotas. A assincronicidade não impacta a velocidade do redirecionamento.
- Dependências: RF-005
- Método de verificação (um): Análise (logs/banco)
- Critérios de aceitação (Given/When/Then):
    - Dado que um redirecionamento para um link ativo ocorreu,
    - Quando verifico os dados no banco D1 após um pequeno delay,
    - Então encontro um novo registro na tabela `analytics` para aquele slug, contendo dados como país e referência.
- Notas: A contagem no KV é usada para as cotas em tempo real. A escrita no D1 pode ser em batch para economizar operações.

### RF-008
- Heading: Sistema de Cotas em Cascata
- Descrição (testável): Cada link possui três contadores independentes: cliques no dia, na semana e no mês. O bloqueio ocorre se: cliques_dia ≥ 1000 OU cliques_semana ≥ 5000 OU cliques_mes ≥ 15000. Além disso, 5 violações da cota diária (strikes) em uma semana automaticamente ativam o bloqueio semanal, e 3 violações semanais ativam o bloqueio mensal.
- Prioridade (Must/Should/Could): Must
- Racional: Controle fino de tráfego e proteção contra abuso, conforme solicitado.
- Dependências: RF-006, RF-007
- Método de verificação (um): Teste
- Critérios de aceitação (Given/When/Then):
    - Dado um link novo,
    - Quando ele recebe 1000 cliques em um dia,
    - Então o 1001º clique é bloqueado (RF-006).
    - E se, em uma semana, ele for bloqueado por cota diária 5 vezes,
    - Então, mesmo com menos de 5000 cliques semanais, ele ficará bloqueado pelo resto da semana.
- Notas: A lógica de "strikes" requer armazenamento adicional.

### RF-009
- Heading: Painel de Administração (Cloudflare Access)
- Descrição (testável): A rota `/admin` deve ser protegida pelo Cloudflare Access (Zero Trust), exigindo autenticação via OTP/e-mail configurado. Após acesso, deve exibir um dashboard com: total de cliques (mês atual), total de links criados, lista de links/pastas, status de cotas e ferramentas de banimento (por hash ou IP).
- Prioridade (Must/Should/Could): Must
- Racional: Controle total pelo mantenedor.
- Dependências: Nenhuma (mas depende da configuração manual do Cloudflare Access).
- Método de verificação (um): Demonstração
- Critérios de aceitação (Given/When/Then):
    - Dado que estou autenticado via Cloudflare Access na rota `/admin`,
    - Quando a página carrega,
    - Então consigo visualizar as métricas agregadas, buscar por um slug ou hash específico e ver um botão para banir um hash de pasta.
- Notas: O frontend do painel consome dados de uma API interna protegida pela mesma política.

### RF-010
- Heading: SEO - Páginas Estáticas e Tratamento de Bots
- Descrição (testável): As páginas principais (`/`, `/whatsapp`, `/encurtar`) devem ser servidas como HTML estático pelo Cloudflare Pages, com tags `<title>`, `<meta description>` e Open Graph adequadas. O Worker, ao identificar user-agents de bots de busca (Google, Bing) ou de redes sociais (Facebook, Twitter, WhatsApp), deve permitir o redirecionamento (sem bloquear) e servir meta tags básicas se acessado diretamente.
- Prioridade (Must/Should/Could): Should
- Racional: Para crescimento orgânico e boa aparência ao compartilhar links.
- Dependências: RF-005
- Método de verificação (um): Inspeção
- Critérios de aceitação (Given/When/Then):
    - Dado o user-agent "Googlebot",
    - Quando acessa `inkpage.com.br/:slug`,
    - Então recebe um redirecionamento 301 normalmente, sem bloqueio por cota.
    - E ao inspecionar o HTML da homepage, encontro tags `<title>` e `<meta name="description">` relevantes.
- Notas: A lista de user-agents "amigáveis" deve ser configurável.

## 4.2 Requisitos não funcionais
### RNF-001 Segurança
- Requisitos:
    1.  Nenhum segredo (chaves de API, hash mestres) deve ser hardcoded no código-fonte ou exposto em prompts de vibe coding.
    2.  O painel admin deve ser inacessível sem autenticação via Cloudflare Access.
    3.  A entrada do usuário (URLs, slugs) deve ser sanitizada para prevenir XSS e injeção de código.
    4.  Acesso à API interna do painel deve verificar a origem da requisição (vinda do mesmo domínio após autenticação).
- Critérios de aceitação:
    - A chave secreta para gerar hashes SHA256 é definida como Environment Variable no Worker.
    - Tentativa de acesso a `/admin` sem token do Access resulta em bloqueio na borda (HTTP 403).
    - Inserir `<script>alert('xss')</script>` em um campo de slug resulta na string sendo sanitizada (codificada) ou rejeitada.
- Método de verificação: Inspeção de código e teste.

### RNF-002 Privacidade & dados
- Requisitos:
    1.  Logs de erro do Worker não devem conter URLs completas ou hashes de usuário.
    2.  Dados de analytics no D1 devem ter uma política de retenção definida (ex: 12 meses para detalhes, agregados permanecem).
    3.  A página deve conter um link para uma Política de Privacidade estática.
- Critérios de aceitação:
    - Um log de erro por URL inválida registra apenas o slug, não a URL de destino.
    - A consulta ao banco D1 para limpeza de dados antigos pode ser executada com base no campo `created_at`.
    - O rodapé do site contém um link "Política de Privacidade".
- Método de verificação: Análise de logs e inspeção.

### RNF-003 Performance
- Requisitos:
    1.  O redirecionamento (Worker + KV) deve ter latency p95 < 100ms globalmente.
    2.  As páginas estáticas (Pages) devem carregar o Core Web Vitals dentro dos limites "bons" (LCP < 2.5s, FID < 100ms, CLS < 0.1).
    3.  O site deve operar integralmente dentro da cota gratuita de 100k requisições/dia do Worker no crescimento inicial.
- Critérios de aceitação:
    - Testes com ferramentas como WebPageTest ou observabilidade da Cloudflare confirmam as métricas.
    - Em um dia com 10k cliques, o número de requisições ao Worker fica abaixo de 15k (considerando cache e bloqueio de bots).
- Método de verificação: Análise (monitoramento).

### RNF-004 Acessibilidade
- Requisitos:
    1.  O HTML deve ser semântico (uso correto de headers, landmarks).
    2.  Contraste de cores deve seguir WCAG AA.
    3.  Todos os elementos interativos devem ser acionáveis via teclado e ter estados visíveis de foco.
- Critérios de aceitação:
    - A ferramenta de auditoria acessibilidade do Lighthouse reporta score > 90.
    - Navegação por Tab funciona em todas as páginas.
- Método de verificação: Inspeção com ferramentas automatizadas.

### RNF-005 Observabilidade
- Requisitos:
    1.  O Worker deve registrar métricas básicas (contagem de redirecionamentos, bloqueios, erros) para o dashboard da Cloudflare.
    2.  Erros críticos (ex: falha ao escrever no D1) devem gerar alertas (via Cloudflare Alerts ou integração simples).
    3.  O painel admin deve exibir o consumo atual de requisições do Worker.
- Critérios de aceitação:
    - No painel da Cloudflare, é possível ver gráficos de requisições do Worker.
    - O painel admin inclui um card mostrando "Requisições Hoje: X / 100.000".
- Método de verificação: Demonstração.

# 5) Dados (conceitual, sem implementação)
## 5.1 Entidades e campos (nível conceitual)
- **Pasta (Folder):**
    - `folder_hash` (Texto, PK): O SHA256 que identifica a pasta.
    - `created_at` (Data/Hora): Data de criação.
    - `status` (Texto): 'active', 'suspended', 'banned'.
    - `strike_count_daily` (Inteiro): Número de vezes que links desta pasta estouraram a cota diária na semana atual.
    - `strike_count_weekly` (Inteiro): Número de vezes que links desta pasta estouraram a cota semanal no mês atual.
- **Link:**
    - `id` (Inteiro, PK).
    - `folder_hash` (Texto, FK para Pasta).
    - `slug` (Texto, Único): Parte customizada da URL.
    - `url_destination` (Texto): URL de destino (longa).
    - `type` (Texto): 'whatsapp', 'generic'.
    - `created_at` (Data/Hora).
    - `is_active` (Booleano): Pode ser desativado pelo admin.
    - `clicks_day` (Inteiro): Contador reiniciado diariamente (gerenciado no KV).
    - `clicks_week` (Inteiro): Contador reiniciado semanalmente (KV).
    - `clicks_month` (Inteiro): Contador reiniciado mensalmente (KV).
- **Evento de Analytics:**
    - `id` (Inteiro, PK).
    - `link_id` (Inteiro, FK para Link).
    - `accessed_at` (Data/Hora).
    - `country` (Texto, 2 caracteres): Código do país.
    - `referer` (Texto): Domínio de origem (se disponível).
    - `user_agent` (Texto): Agente do usuário (sanitizado).

## 5.2 Regras, validações e integridade
- O `slug` deve ser único em toda a tabela `links`.
- A `url_destination` deve começar com `http://` ou `https://`.
- O `slug` deve conter apenas caracteres alfanuméricos, hífens e underlines (`[a-zA-Z0-9_-]`).
- Ao deletar uma Pasta (status 'banned'), todos os seus Links devem ser marcados como `is_active = false`.
- Os contadores de clique (`clicks_day`, etc.) são mantidos primariamente no KV para performance. O D1 é atualizado de forma assíncrona/agregada.

## 5.3 Dados sensíveis, retenção e auditoria
- **Sensíveis:** A `url_destination` pode conter dados pessoais indiretos. O `folder_hash` é um identificador anônimo mas persistente.
- **Retenção:** Registros detalhados na tabela `analytics` serão expurgados após 12 meses. Dados agregados (contagem total por link) permanecem. Logs de erro com dados sensíveis são redatados.
- **Auditoria:** Ações administrativas críticas (banimento de pasta, alteração de cotas globais) devem ser registradas em uma tabela `admin_log` (ação, timestamp, IP do admin) ou via logs do Cloudflare Access.

# 6) Integrações (contratos narrativos)
- **INT-001 Cloudflare KV**
    - Objetivo: Cache de alta velocidade para mapeamento slug->URL e contadores de cota.
    - Entradas (conceitual): Chave (ex: `link:${slug}:url`), Valor (URL de destino). Chave (ex: `link:${slug}:clicks_day`), Valor (número inteiro).
    - Saídas (conceitual): Valor armazenado correspondente à chave.
    - Erros esperados: Chave não encontrada (para slug inexistente).
    - Limites/rate limit (assumido se desconhecido): 100.000 leituras/dia no plano Free.
    - Autenticação/autorização (conceitual): Vinculado ao mesmo namespace do Worker, acesso via API do Worker.

- **INT-002 Cloudflare D1**
    - Objetivo: Armazenamento persistente de metadados de links, pastas e analytics.
    - Entradas (conceitual): Queries SQL parametrizadas (INSERT, SELECT, UPDATE) para as tabelas `folders`, `links`, `analytics`.
    - Saídas (conceitual): Resultados das queries (rows, rowId).
    - Erros esperados: Constraint violation (slug duplicado), timeout.
    - Limites/rate limit (assumido se desconhecido): 10.000 linhas no banco gratuito? (Verificar documentação atual). Operações de escrita contam para o limite.
    - Autenticação/autorização (conceitual): Vinculado ao Worker, acesso via API do Worker.

- **INT-003 Cloudflare Access (Zero Trust)**
    - Objetivo: Proteger a rota `/admin` com autenticação forte.
    - Entradas (conceitual): Requisição HTTP para `inkpage.com.br/admin`.
    - Saídas (conceitual): Se autenticado: requisição passa para o Worker/Pages. Se não: página de login/erro do Access.
    - Erros esperados: Token expirado, e-mail não autorizado.
    - Limites/rate limit (assumido se desconhecido): Plano Free cobre até 50 usuários.
    - Autenticação/autorização (conceitual): Configurada via dashboard da Cloudflare. O Worker recebe headers (como `CF-Access-Authenticated-User-Email`) para identificar o usuário autenticado.

# 7) Estratégia de testes
## 7.1 Cenários mínimos do MVP
1.  Criar um link de WhatsApp e copiá-lo.
2.  Encurtar uma URL longa com slug customizado, receber hash.
3.  Acessar a pasta com o hash e ver o link criado.
4.  Clicar no link encurtado e ser redirecionado.
5.  Simular 1001 acessos a um link em um dia e verificar o bloqueio no 1001º.
6.  Acessar `/admin` (com credenciais) e visualizar o dashboard.
7.  Banir uma pasta via painel admin e verificar que seus links não redirecionam mais.

## 7.2 Casos de borda
- Slug com caracteres especiais (deve ser normalizado/rejeitado).
- URL de destino extremamente longa.
- Tentativa de usar slug reservado (ex: `admin`, `api`).
- Acesso a link com slug inexistente (deve retornar 404).
- Geração de dois hashes SHA256 iguais (colisão - probabilidade infinitesimal, mas tratar com regeneração).
- Acesso por bot do Google (deve redirecionar, não bloquear).
- Zeragem automática dos contadores diários à meia-noite UTC.

## 7.3 Critério de aceite do release
O MVP está pronto para produção quando:
- Todos os RF Must (RF-001, RF-003, RF-004, RF-005, RF-006, RF-008, RF-009) passam nos testes.
- O sistema opera por 24h em ambiente de staging sem erros críticos.
- O painel admin está configurado e acessível apenas pelo e-mail do mantenedor.
- As métricas básicas (cliques, requisições) são visíveis no painel admin.
- A homepage e as ferramentas estão indexáveis e com meta tags básicas.

# 8) Plano de execução para vibe coding (sem código)
## 8.1 Ordem de construção (fatias finas)
1.  **F0: Setup do Projeto e Configurações Cloudflare**
    - Criar repositório git.
    - Configurar Cloudflare Pages (frontend estático placeholder).
    - Configurar Cloudflare Workers, D1 (criar banco), KV (criar namespace).
    - Configurar Environment Variables no Worker (ex: `SECRET_KEY` para hash).
    - Configurar domínio `inkpage.com.br` nos serviços.

2.  **F1: Páginas Estáticas e Gerador WhatsApp (Client-side)**
    - Desenvolver HTML/JS/CSS para: Home (`/`), Gerador WhatsApp (`/whatsapp`), Encurtador (`/encurtar`), Pasta (`/pasta`).
    - Implementar lógica JS do gerador (limpeza de número, encodeURIComponent).
    - Implementar oferta de encurtamento (redirecionamento com URL pré-preenchida).

3.  **F2: Worker Core - APIs de Criação e Pasta**
    - Rota POST `/api/links`: Valida URL, gera slug (verifica unicidade no D1), gera/associa hash da pasta, salva no D1 e KV, retorna resposta.
    - Rota GET `/api/folder/:hash`: Retorna lista de links da pasta (leitura D1).
    - Rota DELETE `/api/links/:id`: Deleta link (valida hash da pasta).

4.  **F3: Worker Core - Redirecionamento e Cotas**
    - Rota dinâmica `/:slug`: Lógica de busca no KV, verificação de cotas (consultando contadores no KV), redirecionamento 301 ou bloqueio 429.
    - Lógica assíncrona (`waitUntil`): Incrementar contadores no KV e registrar analytics no D1.
    - Lógica de identificação e permissão para bots de busca/redes sociais.

5.  **F4: Sistema de Cotas em Cascata e Manutenção**
    - Implementar no Worker a lógica de "strikes": quando um link é bloqueado por cota diária, incrementar strike na pasta.
    - Implementar regra de bloqueio semanal/mensal por strikes.
    - Criar Worker Scheduled (Cron Trigger) para zerar contadores diários/semanais/mensais no KV e resetar strikes.

6.  **F5: Painel de Administração (Frontend + API)**
    - Desenvolver página estática `admin.html` ( gráficos simples, tabelas).
    - Criar APIs internas protegidas (ex: `/admin/api/metrics`, `/admin/api/links`, `/admin/api/ban`) que verificam o header `CF-Access-Authenticated-User-Email`.
    - Configurar Cloudflare Access para a rota `/admin/*`.

7.  **F6: Polimento, SEO e Monitoramento**
    - Adicionar meta tags, sitemap.xml, robots.txt no Pages.
    - Implementar redaction de logs no Worker.
    - Configurar alertas simples no Cloudflare Dashboard.
    - Testes finais de performance e carga leve.

## 8.2 Checkpoints por etapa (o que validar antes de avançar)
- **Pós-F0:** Worker responde "Hello World", Pages serve HTML, D1 e KV aparecem no dashboard.
- **Pós-F1:** Gerador de WhatsApp funciona 100% no navegador. Navegação entre páginas funciona.
- **Pós-F2:** É possível criar um link via API (curl/Postman) e receber hash. É possível listar links da pasta via API.
- **Pós-F3:** Acessar um slug criado redireciona. Acessá-lo 1001 vezes em teste bloqueia. Analytics são registrados.
- **Pós-F4:** Após 5 bloqueios diários de links de uma pasta, novos acessos são bloqueados pelo resto da semana.
- **Pós-F5:** Acesso a `/admin` pede autenticação. Após login, dashboard mostra dados.
- **Pós-F6:** A homepage tem título e descrição. Logs de erro não contêm URLs.

## 8.3 Prompt pack operacional (para a IA dev)
- **Objetivo do build:** Implementar a fatia [Número e Nome da Fatia] conforme especificação INKPAGE_SPEC_v1.0.md.
- **Restrições:**
    - Nunca hardcodar segredos (`SECRET_KEY`, tokens). Usar `env` ou `secrets`.
    - Evitar padrões inseguros: sempre sanitizar entradas do usuário, usar parâmetros parametrizados em queries SQL.
    - Priorizar economia de requisições: usar cache (KV), respostas curtas, processamento assíncrono.
    - O frontend deve ser leve (HTML/JS/CSS vanilla ou framework mínimo). Nada de React pesado se não for necessário.
- **Definição de pronto:**
    - A funcionalidade descrita na fatia funciona ponta a ponta.
    - O código segue as boas práticas da plataforma Cloudflare.
    - As alterações foram commitadas com mensagem clara.
- **Como validar (passos conceituais, sem comandos):**
    1.  Para frontend: abrir a página no navegador e testar o fluxo manualmente.
    2.  Para Worker: usar ferramenta como `curl` ou `wrangler dev` para simular requisições e verificar respostas e status HTTP.
    3.  Verificar no dashboard da Cloudflare se recursos (KV, D1) foram atualizados conforme esperado.
- **Como registrar mudanças (changelog e atualização do .md):**
    - Atualizar a seção 11.2 Changelog do .md com a versão, data e uma breve descrição do que foi implementado na fatia.
    - Se alguma decisão de implementação divergir da especificação, documentá-la na seção 11.1 Decisões.

# 9) Riscos e mitigação (vibe coding)
- **Risco:** Aceitar código "que parece certo" sem revisar (ex: deixar uma chave de API fictícia no código). **Mitigação:** Revisão manual de código focada em segredos hardcoded e consultas SQL brutas antes de cada commit. Usar ferramentas de scan de segredos no CI (se disponível).
- **Risco:** Exposição de segredos/dados em repo/logs/prompt. **Mitigação:** Todos os segredos devem ser gerenciados via Environment Variables/Secrets do Cloudflare. Política de prompt proíbe incluir segredos reais. Logs do Worker devem redacionar informações sensíveis.
- **Risco:** Dependências/supply-chain e drift arquitetural. **Mitigação:** Minimizar dependências externas no Worker (usar APIs nativas da Cloudflare). Se usar npm packages, preferir as mais estáveis e auditadas. Revisar o `package.json` gerado. Congelar versões de dependências.

# 10) Checklists
## 10.1 Pronto para implementar
- [x] Objetivo, público e métricas definidos
- [x] MVP e fora de escopo explícitos
- [x] Requisitos com critérios de aceitação e método de verificação (Teste/Demo/Inspeção/Análise)
- [x] Fluxos alternativos e estados de erro definidos
- [x] Dados sensíveis mapeados e política definida
- [x] Integrações com entradas/saídas/erros descritos
- [x] Plano de testes mínimo do MVP pronto

## 10.2 Segurança do vibe coding
- [x] Guardrails/políticas de prompt (escopo de dados, padrões proibidos, revisão reforçada para áreas críticas)
- [x] Segredos fora do repositório e redaction em logs
- [x] Revisão de segurança antes de release (obrigatória)
- [x] Controle/revisão de dependências

# 11) Decisões e Changelog
## 11.1 Decisões
- **DEC-001:** Optou-se por usar HTTP 301 (em vez de 302) para redirecionamentos, visando melhor SEO e cache. O risco de mudança de destino de um link é baixo, dado o controle do usuário via pasta.
- **DEC-002:** A geração do hash SHA256 para pastas será feita no Worker, combinando um segredo da Environment Variable com um timestamp e um random nonce, garantindo unicidade e imprevisibilidade.
- **DEC-003:** O tratamento de bots será feito por uma lista de user-agents conhecidos (Googlebot, FacebookBot, etc.) no Worker. Para esses agents, as cotas não são aplicadas e o redirecionamento é direto. Isso preserva a funcionalidade para SEO e previews sociais.
- **DEC-004:** A escrita de analytics no D1 será feita em batch a cada X cliques (ex: 10) por slug para reduzir operações de escrita. Os contadores em tempo real para cotas ficam no KV.

## 11.2 Changelog
- v0.1: documento inicial
- v1.0: especificação completa baseada na conversa, com PRD, SRS, UX, dados, integrações, plano de execução e checklists. Inclui assunções e decisões arquiteturais.