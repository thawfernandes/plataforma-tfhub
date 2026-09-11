import { INITIAL_RECOGNITIONS } from './recognitionsData';
import { thumbnailService } from './thumbnailService';
import thawannyImg from '../assets/thawanny.png';
import fabianaImg from '../assets/fabiana.png';

const INITIAL_MENUS = [
  { id: '1', label: 'Início', path: '/' },
  { id: '2', label: 'Produtos', path: '/produtos' },
  { id: '3', label: 'Serviços', path: '/servicos' },
  { id: '4', label: 'Conteúdo', path: '/conteudo' },
  { id: '5', label: 'Portfólio', path: '/portfolio' },
  { id: '6', label: 'Certificados', path: '/certificados' }
];

const INITIAL_FOOTER = {
  aboutText: 'TF Hub - Soluções completas em tecnologia, desenvolvimento de sistemas, cursos e consultoria técnica corporativa.',
  links: [
    { label: 'Sobre Nós', path: '/#sobre-nos' },
    { label: 'Contato', path: '/#contato' },
    { label: 'Área do Cliente', path: '/cliente' },
    { label: 'Painel Admin', path: '/admin' }
  ],
  copyright: '© 2026 TF Hub. Todos os direitos reservados.'
};

const INITIAL_PRODUCTS = [
  {
    id: 'prod_arrecada',
    type: 'system',
    name: 'TF Arrecada+',
    slug: 'tf-arrecada-mais',
    price: 29.90,
    promoPrice: null,
    status: 'active',
    demoUrl: 'https://thawfernandes.github.io/TF-Arrecada-/login',
    downloadUrl: 'https://thawfernandes.github.io/TF-Arrecada-/',
    description: 'Sistema desenvolvido para gerenciamento de rifas e arrecadações, oferecendo uma experiência simples, organizada e intuitiva.',
    images: [thumbnailService.getWebsiteScreenshot('https://thawfernandes.github.io/TF-Arrecada-/login')],
    categories: ['Sistemas', 'Rifas'],
    seo: { title: 'TF Arrecada+ - Sistema de Rifas e Arrecadações', description: 'Sistema moderno e intuitivo para arrecadações.' },
    metadata: {
      demoUrl: 'https://thawfernandes.github.io/TF-Arrecada-/login',
      downloadUrl: 'https://thawfernandes.github.io/TF-Arrecada-/',
      fullDescription: 'O TF Arrecada+ é um sistema completo e de alta performance desenvolvido para quem deseja gerenciar campanhas de rifas, sorteios e arrecadações coletivas com total segurança, transparência e profissionalismo. Com interface limpa e intuitiva, facilita tanto a criação quanto a participação de doadores e compradores.',
      features: 'Realização de sorteios automatizados diretamente na própria plataforma (sorteador integrado em tempo real)\nCriação de campanhas personalizadas com metas de arrecadação\nSistema automatizado de escolha e reserva de números de rifa\nIntegração simples para chaves PIX de recebimento imediato\nPainel financeiro com controle de arrecadações em tempo real\nDesign 100% responsivo para celulares, tablets e computadores\nExportação de relatórios de doadores e participantes em PDF e Excel',
      requirements: 'Apenas um dispositivo conectado à internet (Celular, Tablet ou Computador)\nNavegador web moderno (Google Chrome, Safari, Edge, Opera ou Firefox)\nSem necessidade de servidores complexos ou instalações pesadas (100% pronto para uso)',
      faqs: 'Como recebo o sistema após a compra? | Após a aprovação do seu comprovante de pagamento, o instalador e código-fonte estarão liberados imediatamente na sua Área do Cliente.\nO sistema possui limite de campanhas ou rifas? | Não, o sistema é seu para uso vitalício, permitindo criar quantas campanhas e rifas desejar sem custos adicionais.\nComo é feito o suporte e atualizações? | Você terá 6 meses de suporte gratuito para instalação e configurações, além de atualizações gratuitas para correções de segurança.',
      futureVersions: 'Integração automática com gateways de pagamento (Mercado Pago / Stripe)\nSistema de cotas premiadas e bilhetes da sorte automáticos\nDisparo de notificações automáticas via WhatsApp API'
    }
  }
];

const INITIAL_SERVICES = [
  {
    id: 'srv_branding',
    name: 'Branding & Identidade Visual',
    slug: 'branding-identidade-visual',
    description: 'Construção completa da identidade visual da sua marca, criando uma presença impactante, profissional e memorável.',
    priceText: 'R$ 350,00',
    included: [
      'Logo personalizada (completamente exclusiva)',
      'Paleta de cores moderna e harmoniosa',
      'Tipografia (fontes primárias e secundárias)',
      'Manual de uso da marca'
    ],
    images: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop']
  },
  {
    id: 'srv_redes_sociais',
    name: 'Gestão de Redes Sociais',
    slug: 'gestao-redes-sociais',
    description: 'Planejamento estratégico de marca, criação de posts de altíssima qualidade e acompanhamento contínuo dos resultados.',
    priceText: 'A partir de R$ 600,00',
    included: [
      'Planejamento estratégico de feed',
      'Criação de artes e legendas persuasivas',
      'Estudo de hashtags e otimização de alcance',
      'Acompanhamento e suporte profissional'
    ],
    tiers: [
      { name: '3 posts por semana', price: 'R$ 600,00' },
      { name: '5 posts por semana', price: 'R$ 800,00' },
      { name: '7 posts por semana', price: 'R$ 1.000,00' }
    ],
    images: ['https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop']
  },
  {
    id: 'srv_consultoria_perfil',
    name: 'Consultoria de Perfil',
    slug: 'consultoria-perfil',
    description: 'Análise estratégica do seu perfil profissional para otimizar o seu posicionamento digital e aumentar a conversão de clientes.',
    priceText: 'R$ 100,00',
    included: [
      'Sugestões completas para Biografia e link',
      'Otimização e roteiro para Destaques',
      'Análise crítica das Fotos e estética visual',
      'Plano prático de Posicionamento e autoridade',
      'Entrega em PDF altamente detalhado'
    ],
    images: ['https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop']
  },
  {
    id: 'srv_edicao_videos',
    name: 'Edição de Vídeos',
    slug: 'edicao-videos',
    description: 'Edição audiovisual profissional de alto impacto para Reels, YouTube, TikTok ou lançamentos.',
    priceText: 'R$ 50,00 a R$ 150,00 / proj.',
    included: [
      'Cortes dinâmicos e ritmo engajante',
      'Legendas animadas e efeitos visuais',
      'Motion graphics e transições fluidas',
      'Tratamento de áudio e redução de ruídos',
      'Sound Design e Trilha sonora licenciada'
    ],
    images: ['https://images.unsplash.com/photo-1622737133809-d95047b9e673?w=800&auto=format&fit=crop']
  },
  {
    id: 'srv_vsl',
    name: 'Vídeo de Vendas com IA (VSL)',
    slug: 'video-vendas-ia',
    description: 'Produção completa de vídeos de vendas altamente persuasivos (VSL) utilizando inteligência artificial de ponta.',
    priceText: 'A partir de R$ 350,00',
    included: [
      'Roteiro focado em alta conversão',
      'Narração realista por IA premium',
      'Imagens e animações contextuais',
      'Legendas sincronizadas de alto contraste',
      'Efeitos de Sound Design envolventes'
    ],
    tiers: [
      { name: '15 a 30 segundos', price: 'R$ 350,00' },
      { name: '1 a 1:30 minuto', price: 'R$ 800,00' }
    ],
    images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop']
  },
  {
    id: 'srv_convites',
    name: 'Convites Animados & Save The Date',
    slug: 'convites-animados-save-date',
    description: 'Convites digitais interativos e animados que impressionam seus convidados e facilitam a RSVP.',
    priceText: 'A partir de R$ 90,00',
    included: [
      'Animação personalizada moderna',
      'PDF interativo com botões de clique',
      'Link personalizado exclusivo para o evento',
      'Integração com botão do WhatsApp e RSVP'
    ],
    tiers: [
      { name: 'Até 20 segundos', price: 'R$ 90,00' },
      { name: 'Até 45 segundos', price: 'R$ 150,00' }
    ],
    note: 'Incluso 1 alteração gratuita. Ajustes adicionais pós-entrega por R$ 10,00 cada.',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop']
  }
];

// Conteúdo editorial (artigos, tutoriais) — começa vazio.
// Adicione conteúdo real pelo Painel Administrativo → aba "Conteúdo".
const INITIAL_CONTENT = [];

const INITIAL_PORTFOLIO = [
  {
    id: 'port_femenina',
    name: 'Fé Menina',
    slug: 'fe-menina',
    category: 'Loja Virtual',
    client: 'Fé Menina Modas',
    description: 'Loja online desenvolvida com foco em identidade visual elegante, experiência de compra intuitiva e design moderno.',
    technologies: ['React', 'Vite', 'Vanilla CSS', 'Responsive Design'],
    images: [thumbnailService.getWebsiteScreenshot('https://femenina-loja.lovable.app/')],
    link: 'https://femenina-loja.lovable.app/',
    featured: true,
    year: 2026,
    status: 'Concluído',
    projectType: 'Loja Virtual',
    order: 1
  },
  {
    id: 'port_espirito_santo',
    name: 'Meu Amigo, Espírito Santo',
    slug: 'meu-amigo-espirito-santo',
    category: 'Plataforma Web',
    client: 'Comunidade Cristã',
    description: 'Plataforma interativa desenvolvida para tornar o estudo bíblico mais próximo, acolhedor e envolvente através de uma experiência diferenciada.',
    technologies: ['HTML5', 'Javascript', 'TailwindCSS', 'GitHub Pages'],
    images: [thumbnailService.getWebsiteScreenshot('https://thawfernandes.github.io/meu-amigo-espirito-santo./')],
    link: 'https://thawfernandes.github.io/meu-amigo-espirito-santo./',
    featured: true,
    year: 2025,
    status: 'Concluído',
    projectType: 'Plataforma Web',
    order: 2
  },
  {
    id: 'port_ranchao_palha',
    name: 'Ranchão de Palha',
    slug: 'ranchao-de-palha',
    category: 'Site Institucional',
    client: 'Ranchão de Palha Restaurante',
    address: '398 Av. Goiás',
    location: '398 Av. Goiás',
    description: 'Site criado para o restaurante Ranchão de Palha (398 Av. Goiás), destacando cardápio, identidade visual, informações de contato e presença digital.',
    technologies: ['React', 'CSS Modules', 'SEO Optimization', 'Interactive Menu'],
    images: [thumbnailService.getWebsiteScreenshot('https://ranchaodepalhafood.lovable.app/')],
    link: 'https://ranchaodepalhafood.lovable.app/',
    featured: true,
    year: 2026,
    status: 'Concluído',
    projectType: 'Site Institucional',
    order: 3
  },
  {
    id: 'port_arrecada',
    name: 'TF Arrecada+',
    slug: 'tf-arrecada-mais',
    category: 'Sistema Web',
    client: 'TF Hub Crowdfunding',
    description: 'Sistema desenvolvido para gerenciamento de rifas e arrecadações, oferecendo uma experiência simples, organizada e intuitiva.',
    technologies: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Payments Integration'],
    images: [thumbnailService.getWebsiteScreenshot('https://thawfernandes.github.io/TF-Arrecada-/login')],
    link: 'https://thawfernandes.github.io/TF-Arrecada-/login',
    featured: true,
    year: 2026,
    status: 'Concluído',
    projectType: 'Sistema Web',
    order: 4
  }
];

// Certificados de alunos — começa vazio.
// Emita certificados reais pelo Painel Administrativo → aba "Certificações".
const INITIAL_CERTIFICATES = [];

const INITIAL_FAQ = [
  { id: '1', question: 'Como recebo meus produtos digitais?', answer: 'Assim que o pagamento for confirmado, os arquivos e acessos serão liberados automaticamente na sua Área do Cliente.' },
  { id: '2', question: 'Os sistemas possuem suporte técnico?', answer: 'Sim, todos os sistemas comercializados contam com suporte especializado via ticket e atualizações inclusas conforme o plano.' }
];

// Depoimentos — começa vazio.
// Depoimentos reais são enviados pelos clientes e aprovados pelo Painel Administrativo.
const INITIAL_TESTIMONIALS = [];

const INITIAL_TEAM = [
  {
    id: 'team_thawanny',
    name: 'Thawanny C.',
    role: 'Designer • Storymaker • Eng. Software',
    quote: 'O design é expressão e estratégia.',
    description: 'Designer, Storymaker e futura Engenheira de Software. Para mim, o design é expressão e estratégia. Utilizo minha base técnica em engenharia para dominar softwares de ponta e entregar um trabalho de excelência, transformando a criatividade em soluções reais e inovadoras para a TF.',
    specialties: ['Design Visual', 'Storymaking', 'UI/UX Design', 'Desenvolvimento Frontend'],
    imageUrl: thawannyImg,
    featured: true
  },
  {
    id: 'team_fabiana',
    name: 'Fabiana F.',
    role: 'Storymaker • Videomaker • Fotografia',
    quote: 'Contar histórias autênticas que conectam.',
    description: 'Storymaker e Videomaker, tenho uma grande paixão por fotografia e por contar histórias através da imagem. Gosto de desafios e de usar a criatividade para transformar ideias em algo que realmente toque as pessoas. Cada projeto é uma oportunidade de criar algo único e cheio de significado. Me dedico a desenvolver vídeos e roteiros que transmitam verdade, emoção e identidade. Na TF Hub, meu propósito é entregar conteúdos criativos, autênticos e que conectem de verdade.',
    specialties: ['Roteirização', 'Produção de Vídeo', 'Fotografia Criativa', 'Sound Design'],
    imageUrl: fabianaImg,
    featured: true
  }
];

const INITIAL_SETTINGS = {
  siteName: 'Plataforma TF Hub',
  logoUrl: '',
  contactPhone: '(11) 99999-9999',
  contactEmail: 'contato@tfhub.com.br',
  address: 'São Paulo, SP',
  heroHeading: 'Tecnologia & Criatividade que trabalham por você',
  heroHighlight: 'trabalham por você',
  heroSubheading: 'Transformando ideias em projetos, projetos em realidade e possibilidades em conquistas. Se dá para imaginar, dá para criar.',
  heroCtaPrimaryText: 'Ver Produtos',
  heroCtaPrimaryLink: '/produtos',
  heroCtaSecondaryText: 'Solicitar Orçamento',
  heroCtaSecondaryLink: '#servicos',
  heroTrustBadges: [
    '✓ Entrega imediata em produtos digitais',
    '✓ Suporte especializado',
    '✓ Tecnologia & Design moderno'
  ],
  contractText: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS E LICENCIAMENTO DE SOFTWARE\n\n1. OBJETO\nO presente contrato tem por objeto o licenciamento de uso do software comercialmente denominado "TF Arrecada+" ou outros produtos comercializados pela TF Hub, além de serviços associados.\n\n2. PAGAMENTO E VALORES\nO licenciamento ou serviço é concedido mediante o pagamento do valor acordado nas políticas comerciais. Para projetos personalizados ou sob demanda, trabalhamos com 50% do valor antecipado como sinal de entrada, e os 50% restantes pagos na entrega do serviço ou conforme combinado entre as partes.\n\n3. SUPORTE E ATUALIZAÇÕES\nO licenciado terá direito a suporte técnico pelo período acordado no ato da compra para instalação e configuração do software. Atualizações futuras corretivas e de segurança serão disponibilizadas na Área do Cliente.\n\n4. PROPRIEDADE INTELECTUAL\nTodos os direitos de propriedade intelectual sobre o software ou criativos desenvolvidos permanecem sob titularidade exclusiva da TF Hub, sendo concedida apenas uma licença de uso individual ao cliente.',
  resendApiKey: '',
  resendSenderEmail: 'noreply@tfhub.com.br',
  mercadoPagoAccessToken: '',
  mercadoPagoPublicKey: '',
  youtubeChannelId: 'UC46pM5Nvd0qC8281V2yV21A',
  youtubeApiKey: ''
};

// Database class helper
class MockDb {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem('tf_initialized')) {
      localStorage.setItem('tf_menus', JSON.stringify(INITIAL_MENUS));
      localStorage.setItem('tf_footer', JSON.stringify(INITIAL_FOOTER));
      localStorage.setItem('tf_products', JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem('tf_services', JSON.stringify(INITIAL_SERVICES));
      localStorage.setItem('tf_content', JSON.stringify(INITIAL_CONTENT));
      localStorage.setItem('tf_portfolio', JSON.stringify(INITIAL_PORTFOLIO));
      localStorage.setItem('tf_certificates', JSON.stringify(INITIAL_CERTIFICATES));
      localStorage.setItem('tf_faq', JSON.stringify(INITIAL_FAQ));
      localStorage.setItem('tf_testimonials', JSON.stringify(INITIAL_TESTIMONIALS));
      localStorage.setItem('tf_settings', JSON.stringify(INITIAL_SETTINGS));
      localStorage.setItem('tf_quotes', JSON.stringify([]));
      localStorage.setItem('tf_orders', JSON.stringify([]));
      localStorage.setItem('tf_recognitions', JSON.stringify(INITIAL_RECOGNITIONS));
      localStorage.setItem('tf_team', JSON.stringify(INITIAL_TEAM));
      localStorage.setItem('tf_initialized', 'true');
    }

    // Safe migration: update services if they are the old defaults
    const currentServices = JSON.parse(localStorage.getItem('tf_services')) || [];
    const isOldDefaults = currentServices.length === 0 ||
      (currentServices.length <= 2 && currentServices.every(s => s.id === 'srv_1' || s.id === 'srv_2'));
    if (isOldDefaults) {
      localStorage.setItem('tf_services', JSON.stringify(INITIAL_SERVICES));
    }

    // Safe migration: merge hero settings if they are missing in current settings
    const currentSettings = JSON.parse(localStorage.getItem('tf_settings')) || {};
    if (currentSettings.heroHeading && currentSettings.heroHeading.includes('Transformando ideias em projetos')) {
      currentSettings.heroHeading = 'Tecnologia & Criatividade que trabalham por você';
      currentSettings.heroHighlight = 'trabalham por você';
      currentSettings.heroSubheading = 'Transformando ideias em projetos, projetos em realidade e possibilidades em conquistas. Se dá para imaginar, dá para criar.';
      localStorage.setItem('tf_settings', JSON.stringify(currentSettings));
    } else if (!currentSettings.heroHeading || currentSettings.heroHeading === 'Tecnologia & Criatividade que trabalham por você') {
      const mergedSettings = {
        ...INITIAL_SETTINGS,
        ...currentSettings,
        heroHeading: INITIAL_SETTINGS.heroHeading,
        heroHighlight: INITIAL_SETTINGS.heroHighlight,
        heroSubheading: INITIAL_SETTINGS.heroSubheading
      };
      localStorage.setItem('tf_settings', JSON.stringify(mergedSettings));
    }

    // Migration: seed recognitions if missing (existing installs)
    if (!localStorage.getItem('tf_recognitions')) {
      localStorage.setItem('tf_recognitions', JSON.stringify(INITIAL_RECOGNITIONS));
    }

    // Safe migration: seed or update team if missing or using old relative string paths
    const currentTeam = JSON.parse(localStorage.getItem('tf_team')) || [];
    const isOldTeam = currentTeam.length === 0 || currentTeam.some(t => t.imageUrl === '/thawanny.png' || t.imageUrl === '/fabiana.png');
    if (isOldTeam) {
      localStorage.setItem('tf_team', JSON.stringify(INITIAL_TEAM));
    }

    // Safe migration: seed/reset portfolio or update with automatic screenshots
    const currentPortfolio = JSON.parse(localStorage.getItem('tf_portfolio')) || [];
    const isOldPortfolio = currentPortfolio.length === 0 || 
      (currentPortfolio.length === 1 && currentPortfolio[0].id === 'port_1') ||
      !currentPortfolio.some(p => p.id === 'port_femenina');
    if (isOldPortfolio) {
      localStorage.setItem('tf_portfolio', JSON.stringify(INITIAL_PORTFOLIO));
    } else {
      let changed = false;
      const updatedPort = currentPortfolio.map(p => {
        // Ensure Ranchão de Palha address
        if (p.id === 'port_ranchao_palha') {
          p.address = '398 Av. Goiás';
          p.location = '398 Av. Goiás';
          p.description = 'Site criado para o restaurante Ranchão de Palha (398 Av. Goiás), destacando cardápio, identidade visual, informações de contato e presença digital.';
          changed = true;
        }
        // Auto-assign screenshot if images array is empty or has empty first item
        if ((!p.images || p.images.length === 0 || !p.images[0]) && p.link) {
          p.images = [thumbnailService.getWebsiteScreenshot(p.link)];
          changed = true;
        }
        return p;
      });
      if (changed) {
        localStorage.setItem('tf_portfolio', JSON.stringify(updatedPort));
      }
    }

    // Safe migration: update footer link for 'Sobre Nós' if it is old
    const currentFooter = JSON.parse(localStorage.getItem('tf_footer')) || {};
    if (currentFooter.links && currentFooter.links.some(l => l.label === 'Sobre Nós' && l.path === '/')) {
      currentFooter.links = currentFooter.links.map(l => l.label === 'Sobre Nós' ? { ...l, path: '/#sobre-nos' } : l);
      localStorage.setItem('tf_footer', JSON.stringify(currentFooter));
    }

    // Safe migration: seed/reset products if they have old fictional ones or lack prod_arrecada
    const currentProds = JSON.parse(localStorage.getItem('tf_products')) || [];
    const hasOldProds = currentProds.some(p => p.id === 'prod_1' || p.id === 'prod_2' || p.id === 'prod_3') || !currentProds.some(p => p.id === 'prod_arrecada');
    if (hasOldProds || currentProds.length === 0) {
      localStorage.setItem('tf_products', JSON.stringify(INITIAL_PRODUCTS));
    }

    // Safe migration: add new settings properties if they don't exist
    const currentSettingsData = JSON.parse(localStorage.getItem('tf_settings')) || {};
    if (!currentSettingsData.contractText || !currentSettingsData.hasOwnProperty('youtubeChannelId')) {
      const mergedSettings = {
        ...INITIAL_SETTINGS,
        ...currentSettingsData
      };
      localStorage.setItem('tf_settings', JSON.stringify(mergedSettings));
    }

    // ─── Data-cleanup migrations (remove fictional/placeholder data) ──────────

    // Fix TF Arrecada+ price, image, features and ensure demoUrl is active
    const storedProds = JSON.parse(localStorage.getItem('tf_products')) || [];
    const arrecadaIdx = storedProds.findIndex(p => p.id === 'prod_arrecada' || p.slug === 'tf-arrecada-mais' || p.name?.includes('Arrecada'));
    if (arrecadaIdx !== -1) {
      storedProds[arrecadaIdx].id = 'prod_arrecada';
      storedProds[arrecadaIdx].name = 'TF Arrecada+';
      storedProds[arrecadaIdx].slug = 'tf-arrecada-mais';
      storedProds[arrecadaIdx].price = 29.90;
      storedProds[arrecadaIdx].promoPrice = null;
      storedProds[arrecadaIdx].demoUrl = 'https://thawfernandes.github.io/TF-Arrecada-/login';
      storedProds[arrecadaIdx].downloadUrl = 'https://thawfernandes.github.io/TF-Arrecada-/';
      storedProds[arrecadaIdx].images = [thumbnailService.getWebsiteScreenshot('https://thawfernandes.github.io/TF-Arrecada-/login')];
      storedProds[arrecadaIdx].metadata = storedProds[arrecadaIdx].metadata || {};
      storedProds[arrecadaIdx].metadata.demoUrl = 'https://thawfernandes.github.io/TF-Arrecada-/login';
      storedProds[arrecadaIdx].metadata.downloadUrl = 'https://thawfernandes.github.io/TF-Arrecada-/';
      storedProds[arrecadaIdx].metadata.features = 'Realização de sorteios automatizados diretamente na própria plataforma (sorteador integrado em tempo real)\nCriação de campanhas personalizadas com metas de arrecadação\nSistema automatizado de escolha e reserva de números de rifa\nIntegração simples para chaves PIX de recebimento imediato\nPainel financeiro com controle de arrecadações em tempo real\nDesign 100% responsivo para celulares, tablets e computadores\nExportação de relatórios de doadores e participantes em PDF e Excel';
      storedProds[arrecadaIdx].metadata.requirements = 'Apenas um dispositivo conectado à internet (Celular, Tablet ou Computador)\nNavegador web moderno (Google Chrome, Safari, Edge, Opera ou Firefox)\nSem necessidade de servidores complexos ou instalações pesadas (100% pronto para uso)';
      localStorage.setItem('tf_products', JSON.stringify(storedProds));
    }

    // Ensure port_arrecada link points to login
    const storedPort = JSON.parse(localStorage.getItem('tf_portfolio')) || [];
    const portArrecadaIdx = storedPort.findIndex(p => p.id === 'port_arrecada');
    if (portArrecadaIdx !== -1 && storedPort[portArrecadaIdx].link !== 'https://thawfernandes.github.io/TF-Arrecada-/login') {
      storedPort[portArrecadaIdx].link = 'https://thawfernandes.github.io/TF-Arrecada-/login';
      storedPort[portArrecadaIdx].images = [thumbnailService.getWebsiteScreenshot('https://thawfernandes.github.io/TF-Arrecada-/login')];
      localStorage.setItem('tf_portfolio', JSON.stringify(storedPort));
    }

    // Remove fictional article/video content (cont_1, cont_2)
    const storedContent = JSON.parse(localStorage.getItem('tf_content')) || [];
    const hasOldContent = storedContent.some(c => c.id === 'cont_1' || c.id === 'cont_2');
    if (hasOldContent) {
      const cleanedContent = storedContent.filter(c => c.id !== 'cont_1' && c.id !== 'cont_2');
      localStorage.setItem('tf_content', JSON.stringify(cleanedContent));
    }

    // Remove fictional testimonial (id '1')
    const storedTestimonials = JSON.parse(localStorage.getItem('tf_testimonials')) || [];
    const hasOldTestimonial = storedTestimonials.some(t => t.id === '1' && t.name === 'Mariana Souza');
    if (hasOldTestimonial) {
      const cleanedT = storedTestimonials.filter(t => !(t.id === '1' && t.name === 'Mariana Souza'));
      localStorage.setItem('tf_testimonials', JSON.stringify(cleanedT));
    }

    // Remove fictional certificate (cert_1 / Thiago Alencar)
    const storedCerts = JSON.parse(localStorage.getItem('tf_certificates')) || [];
    const hasOldCert = storedCerts.some(c => c.id === 'cert_1');
    if (hasOldCert) {
      const cleanedCerts = storedCerts.filter(c => c.id !== 'cert_1');
      localStorage.setItem('tf_certificates', JSON.stringify(cleanedCerts));
    }

    // Remove fictional recognitions (rec_1, rec_2, rec_3)
    const storedRec = JSON.parse(localStorage.getItem('tf_recognitions')) || [];
    const hasOldRec = storedRec.some(r => r.id === 'rec_1' || r.id === 'rec_2' || r.id === 'rec_3');
    if (hasOldRec) {
      const cleanedRec = storedRec.filter(r => r.id !== 'rec_1' && r.id !== 'rec_2' && r.id !== 'rec_3');
      localStorage.setItem('tf_recognitions', JSON.stringify(cleanedRec));
    }

    // Clear old simulated YouTube videos (they were placeholder data)
    const oldYtVideos = JSON.parse(localStorage.getItem('tf_youtube_videos')) || [];
    const hasOldYt = oldYtVideos.some(v => v.id === 'yt_vid_1' || v.id === 'yt_vid_2' || v.id === 'yt_vid_3');
    if (hasOldYt) {
      localStorage.removeItem('tf_youtube_videos');
      localStorage.removeItem('tf_youtube_cache');
    }
  }

  get(key) {
    return JSON.parse(localStorage.getItem(`tf_${key}`));
  }

  save(key, data) {
    localStorage.setItem(`tf_${key}`, JSON.stringify(data));
  }

  // Generic helper for adding/editing elements in list keys
  addItem(key, item) {
    const list = this.get(key) || [];
    let itemToSave = { ...item };
    if (key === 'portfolio') {
      if ((!itemToSave.images || itemToSave.images.length === 0 || !itemToSave.images[0]) && itemToSave.link) {
        itemToSave.images = [thumbnailService.getWebsiteScreenshot(itemToSave.link)];
      }
    }
    const newItem = { ...itemToSave, id: itemToSave.id || `${key.substring(0, 3)}_${Date.now()}` };
    list.push(newItem);
    this.save(key, list);
    return newItem;
  }

  updateItem(key, id, updatedFields) {
    const list = this.get(key) || [];
    const index = list.findIndex(i => i.id === id);
    if (index !== -1) {
      let fieldsToApply = { ...updatedFields };
      if (key === 'portfolio') {
        if ((!fieldsToApply.images || fieldsToApply.images.length === 0 || !fieldsToApply.images[0]) && (fieldsToApply.link || list[index].link)) {
          fieldsToApply.images = [thumbnailService.getWebsiteScreenshot(fieldsToApply.link || list[index].link)];
        }
      }
      list[index] = { ...list[index], ...fieldsToApply };
      this.save(key, list);
      return list[index];
    }
    return null;
  }

  deleteItem(key, id) {
    const list = this.get(key) || [];
    const filtered = list.filter(i => i.id !== id);
    this.save(key, filtered);
  }
}

export const mockDb = new MockDb();
