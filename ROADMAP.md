# ROADMAP.md - Plataforma TF Hub

Este documento acompanha o status de conclusão e o progresso das metas da **Plataforma TF Hub**.

---

## Metas do Projeto

### Etapa 1: Estrutura Base e Design System ✅ CONCLUÍDA
- [x] Inicializar o scaffold Vite + React + JS.
- [x] Definir o sistema de design (variáveis CSS, reset, tipografia, temas).
- [x] Implementar a estrutura de roteamento e guards.
- [x] Criar layouts globais (`MainLayout`, `AdminLayout`).
- [x] Configurar mocks iniciais e persistência com `localStorage`.

### Etapa 2A: Biblioteca de Componentes TF Hub ✅ CONCLUÍDA (2026-07-13)
- [x] `Toast` + `useToast` hook — elimina todos os `alert()` nativos da plataforma.
- [x] `Button` — variantes primary, secondary, ghost, danger, accent; loading state.
- [x] `Input`, `Textarea`, `Select` — família de campos com label, helper, error.
- [x] `Badge` — status, tipos de produto, categorias.
- [x] `Modal` — overlay genérico com portal, ESC e animações.
- [x] `ConfirmDialog` — substitui `window.confirm()` com UX premium.
- [x] `Skeleton`, `Spinner` — placeholders de carregamento elegantes.
- [x] `Tabs` — variantes line, pill, card.
- [x] `Accordion` — conteúdo expansível animado.
- [x] `ProductCard` — card comercial com badge de tipo, promo, 1-clique.
- [x] `ServiceCard`, `PortfolioCard`, `ContentCard` (artigo+vídeo auto), `TestimonialCard`, `StatCard`.
- [x] Barrel de exports centralizado (`src/components/index.js`).

### Etapa 2B: Landing Page Completa ✅ CONCLUÍDA (2026-07-13)
- [x] `HeroSection` — animações de gradiente, orbs, grid, CTA duplo, trust badges.
- [x] `FeaturedProductsSection` — produtos ativos do mockDb com skeleton loader.
- [x] `ServicesSection` — cards dinâmicos + modal de orçamento funcional (salva no mockDb).
- [x] `HowWeWorkSection` — 4 passos visuais com explicação da entrada de 50%.
- [x] `PortfolioSection` — projetos em destaque com estado vazio elegante.
- [x] `ContentSection` — artigos e vídeos com player embed em modal.
- [x] `TestimonialsSection` — apenas depoimentos aprovados pelo admin.
- [x] `FAQSection` — accordion dinâmico administrável via painel.
- [x] `CTASection` — chamada final para ação.
- [x] `HomeView.jsx` — compõe todas as seções com carregamento único centralizado.
- [x] Refatoração `AdminDashboardView` — eliminação de `window.confirm()`, handlers faltantes corrigidos, geração automática de hash para certificados.
- [x] Build de produção: 0 erros, 0 warnings.
- [x] Testes visuais e funcionais via browser: todas as seções visíveis, modal funcional, toast exibido, FAQ expandível, console limpo.

### Etapa 3: Módulos de Engajamento e Credenciamento
- [ ] **Conteúdo (`content`)**: Página de artigo individual com markdown.
- [ ] **Portfólio (`portfolio`)**: Página de projeto individual.
- [ ] **Certificados (`certificates`)**: Emissão e sistema de validação online por hash.

### Etapa 4: Área do Cliente (`client`)
- [ ] Dashboard do cliente com pedidos e acessos.
- [ ] Downloads de produtos digitais adquiridos.
- [ ] Acesso a cursos e download de certificados.

### Etapa 5: Painel Administrativo Avançado
- [x] CRUD dinâmico para todos os módulos.
- [x] Gestão de orçamentos (aprovar/rejeitar).
- [x] Gestão de depoimentos (aprovar/publicar).
- [ ] Dashboard com estatísticas reais de vendas.
- [ ] Gestão de menus, rodapé e SEO.
