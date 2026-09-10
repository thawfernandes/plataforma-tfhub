# MASTER_PROJECT.md - Plataforma TF Hub

Este documento é a referência técnica oficial e a especificação de arquitetura da **Plataforma TF Hub**. Qualquer implementação ou refatoração deve obedecer rigorosamente a este guia.

---

## 1. Visão Geral e Filosofia

A **Plataforma TF Hub** é uma plataforma corporativa e comercial integrada. O projeto segue as seguintes diretrizes fundamentais:
*   **Zero Funcionalidade Ilustrativa**: Não são permitidos botões sem ação ou telas estáticas que simulem interações. Tudo deve ser funcional e persistido em estado/armazenamento local até a conexão com APIs finais.
*   **Aparência Premium e Simplicidade (UX/UI)**: Uso consistente de espaçamento generoso, menus intuitivos, pouca poluição textual e excelente hierarquia visual.
*   **Autonomia do Painel Administrativo**: Banners, menus, rodapé, FAQs, depoimentos, produtos, cursos, certificados e conteúdos editoriais devem ser buscados de fontes dinâmicas, permitindo edição completa pelo painel sem alterações no código fonte.

---

## 2. Tecnologias e Configurações

*   **Scaffold**: Vite + React (JavaScript)
*   **Roteamento**: React Router (com suporte a code splitting via lazy loading)
*   **Estilização**: Vanilla CSS com variáveis de design globais (`variables.css`) e CSS Modules para evitar conflito de classes.
*   **Gerenciamento de Estado**: React Context API para estados globais (Autenticação mockada, Carrinho, Dados Gerais dinâmicos) e hooks customizados.

---

## 3. Padrão de Arquitetura por Módulos de Negócio

O código reside dentro de `src/modules/` organizado de forma autocontida por domínio:
1.  **`products`**: Cadastro unificado de produtos diferenciados pelo campo `type` (livros, ebooks, sistemas, cursos, assinaturas, físicos).
2.  **`services`**: Fluxo próprio para solicitação de orçamentos e captação de briefs personalizados.
3.  **`content`**: Artigos, tutoriais, guias, notícias e vídeos.
4.  **`portfolio`**: Projetos desenvolvidos detalhados por tecnologias, clientes e imagens.
5.  **`certificates`**: Emissão, listagem e validação de certificados.
6.  **`client`**: Área logada com acesso aos pedidos e produtos adquiridos.
7.  **`admin`**: Painel administrativo totalizador das operações.

---

## 4. Convenções de Código

*   **Componentes**: Nomes em PascalCase (ex: `ProductCard.jsx`).
*   **Hooks**: Nomes iniciados em `use` (ex: `useProducts.js`).
*   **Views**: Componentes principais associados a uma rota, localizados dentro da subpasta `views/` de seu respectivo módulo.
*   **Mocks**: Todo dado dinâmico inicial ou gerado por formulários do painel administrativo deve ser centralizado em `src/services/mock/` usando `localStorage` para simular uma base de dados real persistente.

---

## 5. Auditoria de UX/UI & Lógica (Concluída)

Realizamos uma auditoria completa na plataforma para garantir que todas as interações fossem 100% reais e dinâmicas:
*   **CRUDs no Painel Admin**: O painel agora possui gerenciamento CRUD total para todos os domínios (Produtos, Conteúdo/Vídeos, Portfólio, Certificados, FAQ e Depoimentos).
*   **Dinamicidade de Exibição**: Todos os módulos públicos consomem os dados do mockDb de forma reativa, refletindo imediatamente as alterações do painel.
*   **Identidade Visual Refinada**: Adoção de split view no painel administrativo, badges de status estilizados e aplicação uniforme das variáveis CSS de dark mode para um visual corporativo moderno e profissional.

---

## 6. Filosofia de Automação & UX Premium (Versão 5.0)

A partir da Fase 2, todas as implementações devem seguir os seguintes padrões corporativos:

### 6.1. Automação Pró-Ativa (Trabalho do Sistema)
*   **Faturamento & Acesso**: Integração com gateways de pagamento (Mercado Pago simulation/API) para liberação imediata e automatizada de links de download (sistemas/eBooks) e matrículas de cursos na Área do Cliente.
*   **Geração Inteligente de Dados**: Slugs de produtos/conteúdos, códigos de validação de certificados baseados em hash seguro e metadados devem ser gerados automaticamente nas ações de cadastro, poupando formulários manuais.
*   **Vídeos e Mídia**: Ao cadastrar um link de vídeo do YouTube, a plataforma deve capturar a thumbnail e os metadados (como duração) automaticamente.

### 6.2. Interfaces Fluidas e Menos Fricção
*   **Passo-a-passo (Wizards)**: Uso de wizards interativos com pré-visualização em tempo real (ex: formulário inteligente de orçamento com estimativa de custo e prazo).
*   **Sem Formulários Gigantes**: Divisão lógica de inputs, uso de seleções visuais (ícones/cards clicáveis) e autosave onde for aplicável.
*   **Feedback Instantâneo**: Transições elegantes e toasts de notificação ao realizar operações críticas (adicionar ao carrinho, salvar alterações).

### 6.3. Arquitetura de Integrações Externas
*   Sempre que configurarmos serviços de terceiros (ex: **Supabase** para persistência, **Resend** para e-mails transacionais de orçamentos e pedidos, **Mercado Pago** para e-commerce):
    1.  Toda a configuração de código (clientes de API, schemas de tabelas) é criada localmente de forma automatizada.
    2.  A plataforma solicitará as credenciais (tokens/chaves de API) por meio de inputs específicos nas configurações do Painel Administrativo ou interrupção planejada no terminal/chat, salvando-as de forma segura nas configurações globais.


