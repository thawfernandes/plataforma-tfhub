import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mockDb } from '../../../services/mockDb';
import { youtubeService } from '../../../services/youtubeService';
import { emailService } from '../../../services/emailService';
import { thumbnailService } from '../../../services/thumbnailService';
import {
  ShoppingBag, Briefcase, Award,
  HelpCircle, MessageSquare, Trash2, Edit2, Save, Check, X,
  Search, Eye, Send, FileText, Settings, Download
} from 'lucide-react';
import { ConfirmDialog, useToast, PwaInstallPrompt } from '../../../components/index';
import styles from './AdminDashboardView.module.css';

export default function AdminDashboardView() {
  const [activeTab, setActiveTab] = useState('stats');
  const { toast } = useToast();

  // Data States
  const [products, setProducts]           = useState([]);
  const [quotes, setQuotes]               = useState([]);
  const [faqs, setFaqs]                   = useState([]);
  const [testimonials, setTestimonials]   = useState([]);
  const [contents, setContents]           = useState([]);
  const [portfolio, setPortfolio]         = useState([]);
  const [certificates, setCertificates]   = useState([]);
  const [recognitions, setRecognitions]   = useState([]);
  const [team, setTeam]                   = useState([]);
  const [orders, setOrders]               = useState([]);
  const [stats, setStats]                 = useState({ productsCount: 0, ordersCount: 0, quotesCount: 0, revenue: 0 });

  // Confirm dialog state
  const [confirmState, setConfirmState] = useState({ open: false, key: null, id: null, loading: false });

  // Form toggles
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState('');

  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    type: 'system',
    price: '',
    promoPrice: '',
    description: '',
    imageUrl: '',
    fullDescription: '',
    features: '',
    requirements: '',
    faqs: '',
    futureVersions: '',
    downloadUrl: ''
  });
  const [faqForm, setFaqForm]                 = useState({ question: '', answer: '' });
  const [contentForm, setContentForm]         = useState({ title: '', type: 'article', body: '', imageUrl: '', videoUrl: '', readingTime: '5 min' });
  const [portfolioForm, setPortfolioForm]     = useState({
    name: '',
    category: 'Site Institucional',
    client: '',
    address: '',
    description: '',
    technologies: '',
    imageUrl: '',
    link: '',
    featured: true,
    year: new Date().getFullYear().toString(),
    status: 'Concluído',
    projectType: 'Site Institucional',
    order: '1'
  });
  const [certificateForm, setCertificateForm] = useState({ validation_code: '', studentName: '', institution: 'TF Hub Academy', issueDate: '', hours: '', description: '' });
  const [recognitionForm, setRecognitionForm] = useState({ title: '', institution: '', date: '', description: '', image: '', category: 'Certificação' });
  const [teamForm, setTeamForm]               = useState({ name: '', role: '', quote: '', description: '', specialties: '', imageUrl: '', featured: true });

  // Orders Tab Filters & Detail States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [adminReply, setAdminReply] = useState('');
  const [internalNotes, setInternalNotes] = useState('');

  // Settings Configuration Form
  const [settingsForm, setSettingsForm] = useState({
    siteName: '',
    heroHeading: '',
    heroSubheading: '',
    contractText: '',
    resendApiKey: '',
    resendSenderEmail: '',
    mercadoPagoAccessToken: '',
    mercadoPagoPublicKey: '',
    youtubeChannelId: '',
    youtubeApiKey: ''
  });

  const location = useLocation();
  const navigate = useNavigate();

  // Sync activeTab with current URL route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/admin/produtos')) setActiveTab('products');
    else if (path.includes('/admin/pedidos') || path.includes('/admin/solicitacoes')) setActiveTab('orders');
    else if (path.includes('/admin/servicos') || path.includes('/admin/orcamentos')) setActiveTab('quotes');
    else if (path.includes('/admin/conteudo')) setActiveTab('content');
    else if (path.includes('/admin/portfolio')) setActiveTab('portfolio');
    else if (path.includes('/admin/equipe')) setActiveTab('team');
    else if (path.includes('/admin/certificados')) setActiveTab('recognitions');
    else if (path.includes('/admin/depoimentos')) setActiveTab('testimonials');
    else if (path.includes('/admin/faq')) setActiveTab('faq');
    else if (path.includes('/admin/configuracoes')) setActiveTab('settings');
    else setActiveTab('stats');
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetForm();
    const routeMap = {
      stats: '/admin',
      products: '/admin/produtos',
      orders: '/admin/pedidos',
      quotes: '/admin/servicos',
      content: '/admin/conteudo',
      portfolio: '/admin/portfolio',
      team: '/admin/equipe',
      recognitions: '/admin/certificados',
      testimonials: '/admin/depoimentos',
      faq: '/admin/faq',
      settings: '/admin/configuracoes'
    };
    if (routeMap[tab] && location.pathname !== routeMap[tab]) {
      navigate(routeMap[tab]);
    }
  };

  useEffect(() => { loadAllData(); }, []);

  // Monitor details updates if selectedOrder is active
  useEffect(() => {
    if (selectedOrder) {
      setInternalNotes(selectedOrder.notes || '');
    }
  }, [selectedOrder]);

  const loadAllData = () => {
    const p    = mockDb.get('products')     || [];
    const q    = mockDb.get('quotes')       || [];
    const f    = mockDb.get('faq')          || [];
    const t    = mockDb.get('testimonials') || [];
    const c    = mockDb.get('content')      || [];
    const port = mockDb.get('portfolio')    || [];
    const cert = mockDb.get('certificates') || [];
    const tm   = mockDb.get('team')         || [];
    const o    = mockDb.get('orders')       || [];
    const rec  = mockDb.get('recognitions') || [];
    const s    = mockDb.get('settings')     || {};

    setProducts(p); setQuotes(q); setFaqs(f);
    setTestimonials(t); setContents(c); setPortfolio(port); setCertificates(cert);
    setRecognitions(rec); setTeam(tm); setOrders(o);
    
    setSettingsForm({
      siteName: s.siteName || '',
      heroHeading: s.heroHeading || '',
      heroSubheading: s.heroSubheading || '',
      contractText: s.contractText || '',
      resendApiKey: s.resendApiKey || '',
      resendSenderEmail: s.resendSenderEmail || '',
      mercadoPagoAccessToken: s.mercadoPagoAccessToken || '',
      mercadoPagoPublicKey: s.mercadoPagoPublicKey || '',
      youtubeChannelId: s.youtubeChannelId || '',
      youtubeApiKey: s.youtubeApiKey || ''
    });

    const totalRev = o.reduce((acc, cur) => acc + (cur.total || 0), 0);
    setStats({ productsCount: p.length, ordersCount: o.length, quotesCount: q.length, revenue: totalRev });
  };

  const resetForm = () => {
    setIsEditing(false); setCurrentId('');
    setProductForm({
      name: '',
      type: 'system',
      price: '',
      promoPrice: '',
      description: '',
      imageUrl: '',
      fullDescription: '',
      features: '',
      requirements: '',
      faqs: '',
      futureVersions: '',
      downloadUrl: ''
    });
    setFaqForm({ question: '', answer: '' });
    setContentForm({ title: '', type: 'article', body: '', imageUrl: '', videoUrl: '', readingTime: '5 min' });
    setPortfolioForm({
      name: '',
      category: 'Site Institucional',
      client: '',
      address: '',
      description: '',
      technologies: '',
      imageUrl: '',
      link: '',
      featured: true,
      year: new Date().getFullYear().toString(),
      status: 'Concluído',
      projectType: 'Site Institucional',
      order: '1'
    });
    setCertificateForm({ validation_code: '', studentName: '', institution: 'TF Hub Academy', issueDate: '', hours: '', description: '' });
    setRecognitionForm({ title: '', institution: '', date: '', description: '', image: '', category: 'Certificação' });
    setTeamForm({ name: '', role: '', quote: '', description: '', specialties: '', imageUrl: '', featured: true });
  };

  const handleSave = (key, itemData) => {
    if (isEditing) {
      mockDb.updateItem(key, currentId, itemData);
      toast.success('Registro atualizado com sucesso!');
    } else {
      mockDb.addItem(key, itemData);
      toast.success('Registro adicionado com sucesso!');
    }
    resetForm(); loadAllData();
  };

  const handleEdit = (item, type) => {
    setIsEditing(true); setCurrentId(item.id);
    if (type === 'product') {
      setProductForm({
        name: item.name,
        type: item.type,
        price: item.price.toString(),
        promoPrice: item.promoPrice ? item.promoPrice.toString() : '',
        description: item.description,
        imageUrl: item.images?.[0] || '',
        fullDescription: item.metadata?.fullDescription || '',
        features: item.metadata?.features || '',
        requirements: item.metadata?.requirements || '',
        faqs: item.metadata?.faqs || '',
        futureVersions: item.metadata?.futureVersions || '',
        downloadUrl: item.metadata?.downloadUrl || ''
      });
      setActiveTab('products');
    } else if (type === 'faq') {
      setFaqForm({ question: item.question, answer: item.answer });
    } else if (type === 'content') {
      setContentForm({ title: item.title, type: item.type, body: item.body, imageUrl: item.images?.[0] || '', videoUrl: item.metadata?.videoUrl || '', readingTime: item.metadata?.readingTime || '5 min' });
    } else if (type === 'portfolio') {
      setPortfolioForm({
        name: item.name,
        category: item.category || 'Site Institucional',
        client: item.client || '',
        address: item.address || item.location || '',
        description: item.description,
        technologies: (item.technologies || []).join(', '),
        imageUrl: (item.images || []).join(', '),
        link: item.link || '',
        featured: item.featured !== false,
        year: (item.year || '').toString(),
        status: item.status || 'Concluído',
        projectType: item.projectType || item.category || 'Site Institucional',
        order: (item.order || '0').toString()
      });
      setActiveTab('portfolio');
    } else if (type === 'certificate') {
      setCertificateForm({ validation_code: item.validation_code, studentName: item.studentName, institution: item.institution, issueDate: item.issueDate, hours: item.hours.toString(), description: item.description });
    } else if (type === 'recognition') {
      setRecognitionForm({ title: item.title, institution: item.institution, date: item.date || '', description: item.description, image: item.image || '', category: item.category || 'Certificação' });
      setActiveTab('recognitions');
    } else if (type === 'team') {
      setTeamForm({ name: item.name, role: item.role, quote: item.quote || '', description: item.description, specialties: (item.specialties || []).join(', '), imageUrl: item.imageUrl || '', featured: item.featured });
      setActiveTab('team');
    }
  };

  // Opens confirm dialog before delete
  const handleDelete = (key, id) => {
    setConfirmState({ open: true, key, id, loading: false });
  };

  const confirmDelete = () => {
    setConfirmState(s => ({ ...s, loading: true }));
    setTimeout(() => {
      mockDb.deleteItem(confirmState.key, confirmState.id);
      loadAllData();
      toast.success('Registro excluído.');
      setConfirmState({ open: false, key: null, id: null, loading: false });
    }, 400);
  };

  const handleUpdateQuoteStatus = (id, status) => {
    mockDb.updateItem('quotes', id, { status });
    loadAllData();
    toast.success(status === 'approved' ? 'Orçamento aprovado!' : 'Orçamento rejeitado.');
  };

  const handleApproveTestimonial = (id) => {
    mockDb.updateItem('testimonials', id, { approved: true });
    loadAllData();
    toast.success('Depoimento aprovado e publicado na home!');
  };

  const handleFaqSubmit = (e) => {
    e.preventDefault();
    handleSave('faq', { question: faqForm.question, answer: faqForm.answer });
  };

  // Update order status, write to timeline, send update email
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const oList = mockDb.get('orders') || [];
    const idx = oList.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      const oldStatus = oList[idx].status;
      oList[idx].status = newStatus;
      
      // Timeline tracking update
      oList[idx].timeline.push({
        title: `Status atualizado: ${newStatus}`,
        date: new Date().toISOString(),
        description: `O status da solicitação foi alterado de "${oldStatus}" para "${newStatus}" pelo administrador.`
      });

      // Append support notification
      oList[idx].messages.push({
        sender: 'admin',
        senderName: 'TF Hub Sistema',
        text: `O status do seu projeto foi atualizado para "${newStatus}".`,
        timestamp: new Date().toISOString()
      });

      mockDb.save('orders', oList);
      loadAllData();
      setSelectedOrder(oList[idx]);
      
      // Dispatch update notification email
      emailService.sendStatusUpdatedEmail(oList[idx], oldStatus);
      toast.success(`Status atualizado para: ${newStatus}`);
    }
  };

  // Save internal notes
  const handleSaveInternalNotes = () => {
    if (!selectedOrder) return;
    const oList = mockDb.get('orders') || [];
    const idx = oList.findIndex(o => o.id === selectedOrder.id);
    if (idx !== -1) {
      oList[idx].notes = internalNotes;
      mockDb.save('orders', oList);
      loadAllData();
      setSelectedOrder(oList[idx]);
      toast.success('Observações internas salvas com sucesso!');
    }
  };

  // Send admin chat response
  const handleSendAdminReply = (e) => {
    e.preventDefault();
    if (!adminReply.trim() || !selectedOrder) return;

    const oList = mockDb.get('orders') || [];
    const idx = oList.findIndex(o => o.id === selectedOrder.id);
    if (idx !== -1) {
      const message = {
        sender: 'admin',
        senderName: 'TF Hub',
        text: adminReply.trim(),
        timestamp: new Date().toISOString()
      };
      oList[idx].messages.push(message);
      mockDb.save('orders', oList);
      loadAllData();
      setSelectedOrder(oList[idx]);
      setAdminReply('');
      toast.success('Mensagem enviada no mural!');
    }
  };

  // Save Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    const settings = mockDb.get('settings') || {};
    const updatedSettings = {
      ...settings,
      ...settingsForm
    };
    mockDb.save('settings', updatedSettings);
    loadAllData();
    toast.success('Configurações salvas com sucesso!');
  };

  // Helper for input style (legacy forms still use inline style)
  const inputStyle = { width: '100%', padding: '8px 10px', backgroundColor: 'var(--bg-tertiary)', border: '1.5px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontFamily: 'var(--font-primary)', fontSize: '0.875rem' };

  // Status badge CSS matching helper
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Aguardando pagamento': return styles.statusAwaiting;
      case 'Em análise': return styles.statusAnalysis;
      case 'Pagamento aprovado': return styles.statusApproved;
      case 'Projeto iniciado': return styles.statusStarted;
      case 'Em desenvolvimento': return styles.statusDev;
      case 'Finalizado': return styles.statusFinished;
      default: return '';
    }
  };

  // Filter orders list
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.clientEmail?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesProduct = productFilter === 'all' || order.items.some(i => i.id === productFilter);
    const matchesDate = !dateFilter || new Date(order.createdAt).toLocaleDateString().includes(new Date(dateFilter).toLocaleDateString());

    return matchesSearch && matchesStatus && matchesProduct && matchesDate;
  });

  return (
    <div className={styles.adminDashboard}>
      {/* PWA Mobile Installation Card */}
      <PwaInstallPrompt />

      {/* Tabs */}
      <div className={styles.tabs}>
        {['stats','products','orders','content','portfolio','team','recognitions','quotes','faq','testimonials','settings'].map(tab => (
          <button
            key={tab}
            className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => handleTabChange(tab)}
          >
            {{ 
              stats:'Estatísticas', 
              products:'Produtos', 
              orders: 'Solicitações',
              content:'Conteúdo', 
              portfolio:'Portfólio', 
              team:'Equipe', 
              recognitions:'Certificações', 
              quotes:'Orçamentos', 
              faq:'FAQ', 
              testimonials:'Depoimentos',
              settings: 'Configurações'
            }[tab]}
          </button>
        ))}
      </div>

      {/* Stats */}
      {activeTab === 'stats' && (
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} card`}>
            <ShoppingBag size={32} style={{ color: 'var(--accent)' }} />
            <h4>Total de Produtos</h4>
            <span className={styles.statValue}>{stats.productsCount}</span>
          </div>
          <div className={`${styles.statCard} card`}>
            <Briefcase size={32} style={{ color: 'var(--success)' }} />
            <h4>Orçamentos Recebidos</h4>
            <span className={styles.statValue}>{stats.quotesCount}</span>
          </div>
          <div className={`${styles.statCard} card`}>
            <Award size={32} style={{ color: 'var(--warning)' }} />
            <h4>Solicitações Vendas</h4>
            <span className={styles.statValue}>{stats.ordersCount}</span>
          </div>
          <div className={`${styles.statCard} card`}>
            <span style={{ fontSize: '1.25rem', color: 'var(--accent)', fontWeight: 'bold' }}>R$</span>
            <h4>Receita Confirmada</h4>
            <span className={styles.statValue}>R$ {stats.revenue.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Products CRUD */}
      {activeTab === 'products' && (
        <div className={styles.splitView}>
          <div className="card">
            <h3>Gerenciar Produtos</h3>
            <table className={styles.table}>
              <thead><tr><th>Nome</th><th>Tipo</th><th>Preço</th><th>Ações</th></tr></thead>
              <tbody>
                {products.map(prod => (
                  <tr key={prod.id}>
                    <td>{prod.name}</td>
                    <td style={{ textTransform: 'capitalize' }}>{prod.type}</td>
                    <td>R$ {prod.price.toFixed(2)}</td>
                    <td>
                      <button onClick={() => handleEdit(prod, 'product')} className={styles.editBtn}><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete('products', prod.id)} className={styles.deleteBtn}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card">
            <h3>{isEditing ? 'Editar Produto' : 'Adicionar Produto'}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSave('products', {
                name: productForm.name, type: productForm.type,
                price: parseFloat(productForm.price), 
                promoPrice: productForm.promoPrice ? parseFloat(productForm.promoPrice) : null,
                description: productForm.description,
                images: [productForm.imageUrl || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop'],
                slug: productForm.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''),
                status: 'active', categories: ['Geral'],
                seo: { title: productForm.name, description: productForm.description },
                metadata: {
                  fullDescription: productForm.fullDescription,
                  features: productForm.features,
                  requirements: productForm.requirements,
                  faqs: productForm.faqs,
                  futureVersions: productForm.futureVersions,
                  downloadUrl: productForm.downloadUrl
                }
              });
            }} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
              <div><label>Nome do Produto / Serviço</label><input type="text" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} style={inputStyle} required /></div>
              <div>
                <label>Tipo</label>
                <select value={productForm.type} onChange={e => setProductForm({ ...productForm, type: e.target.value })} style={inputStyle}>
                  <option value="system">Sistema</option><option value="book">Livro</option>
                  <option value="ebook">eBook</option><option value="course">Curso</option>
                  <option value="physical">Físico</option><option value="template">Template</option>
                  <option value="digital">Digital / Serviços</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div><label>Preço Base (R$)</label><input type="number" step="0.01" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} style={inputStyle} required /></div>
                <div><label>Preço Promo (R$)</label><input type="number" step="0.01" value={productForm.promoPrice} onChange={e => setProductForm({ ...productForm, promoPrice: e.target.value })} style={inputStyle} /></div>
              </div>
              <div><label>URL Imagem</label><input type="text" value={productForm.imageUrl} onChange={e => setProductForm({ ...productForm, imageUrl: e.target.value })} style={inputStyle} /></div>
              <div><label>Descrição Curta</label><input type="text" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} style={inputStyle} required /></div>
              
              <div><label>Descrição Completa</label><textarea rows="3" value={productForm.fullDescription} onChange={e => setProductForm({ ...productForm, fullDescription: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} /></div>
              <div><label>Funcionalidades (uma por linha)</label><textarea rows="3" placeholder="Recurso 1&#10;Recurso 2" value={productForm.features} onChange={e => setProductForm({ ...productForm, features: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} /></div>
              <div><label>Requisitos do Sistema (um por linha)</label><textarea rows="2" placeholder="MySQL 8.0&#10;PHP 8.1" value={productForm.requirements} onChange={e => setProductForm({ ...productForm, requirements: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} /></div>
              <div><label>FAQs (Pergunta | Resposta por linha)</label><textarea rows="3" placeholder="Como recebo o produto? | Download na área do cliente&#10;Tem garantia? | Sim, 7 dias" value={productForm.faqs} onChange={e => setProductForm({ ...productForm, faqs: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} /></div>
              <div><label>Atualizações Futuras (uma por linha)</label><textarea rows="2" placeholder="Nova integração de APIs&#10;Refatoração UI" value={productForm.futureVersions} onChange={e => setProductForm({ ...productForm, futureVersions: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} /></div>
              <div><label>URL de Download do Produto Digital</label><input type="text" placeholder="https://..." value={productForm.downloadUrl} onChange={e => setProductForm({ ...productForm, downloadUrl: e.target.value })} style={inputStyle} /></div>
              
              <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}><Save size={16} /> Salvar Produto</button>
                {isEditing && <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancelar</button>}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Orders (Solicitações de Compra) CRUD */}
      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {/* Filters Bar */}
          <div className={styles.filterBar}>
            <div className={styles.filterGroup} style={{ flexGrow: 2 }}>
              <label>Pesquisar Cliente</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="Nome ou e-mail do cliente..." 
                  style={{ ...inputStyle, paddingLeft: '32px' }}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--text-muted)' }} />
              </div>
            </div>
            
            <div className={styles.filterGroup}>
              <label>Status</label>
              <select style={inputStyle} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">Todos os Status</option>
                <option value="Aguardando pagamento">Aguardando pagamento</option>
                <option value="Em análise">Em análise</option>
                <option value="Pagamento aprovado">Pagamento aprovado</option>
                <option value="Projeto iniciado">Projeto iniciado</option>
                <option value="Em desenvolvimento">Em desenvolvimento</option>
                <option value="Finalizado">Finalizado</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Produto</label>
              <select style={inputStyle} value={productFilter} onChange={e => setProductFilter(e.target.value)}>
                <option value="all">Todos os Produtos</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Data</label>
              <input 
                type="date" 
                style={inputStyle} 
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
              />
            </div>
          </div>

          {/* Table list */}
          <div className="card">
            <h3>Fila de Solicitações de Compra</h3>
            {filteredOrders.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>Nenhuma solicitação encontrada.</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Produto</th>
                    <th>Valor</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id}>
                      <td>
                        <strong>{order.clientName}</strong>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{order.clientEmail}</span>
                      </td>
                      <td>{order.items[0]?.name}</td>
                      <td>R$ {order.total.toFixed(2)}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-secondary btn-sm" 
                          style={{ padding: '4px 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye size={14} />
                          <span>Detalhes</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Configurações Globais (Contrato e chaves APIs) */}
      {activeTab === 'settings' && (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3>Definições da Plataforma & APIs</h3>
          <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
            
            <h4 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '4px', color: 'var(--accent)' }}>Aparência</h4>
            <div>
              <label className={styles.label}>Nome da Plataforma / Agência</label>
              <input type="text" value={settingsForm.siteName} onChange={e => setSettingsForm({...settingsForm, siteName: e.target.value})} style={inputStyle} required />
            </div>

            <h4 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '4px', color: 'var(--accent)', marginTop: '1rem' }}>Contrato Padrão</h4>
            <div>
              <label className={styles.label}>Texto do Contrato de Prestação de Serviços (Exibido no Wizard)</label>
              <textarea rows="8" value={settingsForm.contractText} onChange={e => setSettingsForm({...settingsForm, contractText: e.target.value})} style={{ ...inputStyle, resize: 'vertical' }} required />
            </div>

            <h4 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '4px', color: 'var(--accent)', marginTop: '1rem' }}>Integração Resend (Notificações E-mail)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label className={styles.label}>Chave de API do Resend (API Key)</label>
                <input type="password" placeholder="re_..." value={settingsForm.resendApiKey} onChange={e => setSettingsForm({...settingsForm, resendApiKey: e.target.value})} style={inputStyle} />
              </div>
              <div>
                <label className={styles.label}>E-mail Remetente Autorizado (Resend)</label>
                <input type="text" placeholder="noreply@seudominio.com" value={settingsForm.resendSenderEmail} onChange={e => setSettingsForm({...settingsForm, resendSenderEmail: e.target.value})} style={inputStyle} />
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '-8px' }}>Se a chave de API estiver vazia, o sistema rodará em modo simulação exibindo logs de disparos no console de desenvolvedor.</p>

            <h4 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '4px', color: 'var(--accent)', marginTop: '1rem' }}>Integração Mercado Pago (PIX Automático)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label className={styles.label}>Mercado Pago Access Token</label>
                <input type="password" placeholder="APP_USR-..." value={settingsForm.mercadoPagoAccessToken} onChange={e => setSettingsForm({...settingsForm, mercadoPagoAccessToken: e.target.value})} style={inputStyle} />
              </div>
              <div>
                <label className={styles.label}>Mercado Pago Public Key</label>
                <input type="text" placeholder="APP_USR-..." value={settingsForm.mercadoPagoPublicKey} onChange={e => setSettingsForm({...settingsForm, mercadoPagoPublicKey: e.target.value})} style={inputStyle} />
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '-8px' }}>Se configuradas, o checkout de sistemas e produtos gerará QR Codes e webhook de confirmação automática. Caso contrário, usará PIX manual e comprovante.</p>

            <h4 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '4px', color: 'var(--accent)', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#ff0000', fontSize: '1.1em' }}>▶</span>
              Integração YouTube (Conteúdo Automático)
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 12px', lineHeight: 1.5 }}>
              Novos vídeos publicados no canal TF Hub aparecerão automaticamente na seção de Conteúdo do site e na Home.
              A API Key é opcional — sem ela o sistema usará conteúdo simulado (ideal para desenvolvimento e testes).
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '12px' }}>
              <div>
                <label className={styles.label}>ID do Canal no YouTube</label>
                <input
                  type="text"
                  placeholder="UCxxxxxxxxxxxxxxxxxx"
                  value={settingsForm.youtubeChannelId}
                  onChange={e => setSettingsForm({...settingsForm, youtubeChannelId: e.target.value})}
                  style={inputStyle}
                />
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', marginBottom: 0 }}>
                  Canal oficial TF Hub: <a href="https://www.youtube.com/@TF-HUB" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>@TF-HUB</a>
                </p>
              </div>
              <div>
                <label className={styles.label}>YouTube Data API v3 Key (opcional)</label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={settingsForm.youtubeApiKey}
                  onChange={e => setSettingsForm({...settingsForm, youtubeApiKey: e.target.value})}
                  style={inputStyle}
                />
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', marginBottom: 0 }}>Obtenha em console.cloud.google.com → YouTube Data API v3</p>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 0, 0, 0.04)', border: '1px solid rgba(255, 0, 0, 0.15)', borderRadius: '10px', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.88rem', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#ff0000' }}>●</span> Simulador de Novo Vídeo
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '3px 0 0' }}>
                  Simula a publicação de um novo vídeo no canal para testar a sincronização em tempo real (sem API Key necessária).
                </p>
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}
                onClick={() => {
                  youtubeService.simulateNewUpload();
                  toast.success('Novo vídeo simulado! Veja a seção de Conteúdo ou a Home para confirmar a sincronização.');
                }}
              >
                ▶ Simular Upload de Vídeo
              </button>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Save size={16} />
              <span>Salvar Configurações Globais</span>
            </button>
          </form>
        </div>
      )}

      {/* Legacy and Other CRUD tabs (testimonials, faqs, recognitions, team, content, portfolio, quotes) */}
      {activeTab === 'quotes' && (
        <div className="card">
          <h3>Orçamentos de Serviços Recebidos</h3>
          {quotes.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>Nenhum orçamento solicitado ainda.</p>
          ) : (
            <table className={styles.table}>
              <thead><tr><th>Nome</th><th>Serviço</th><th>E-mail</th><th>Data</th><th>Status</th><th>Ações</th></tr></thead>
              <tbody>
                {quotes.map(q => (
                  <tr key={q.id}>
                    <td>{q.clientName}</td>
                    <td>{q.serviceName}</td>
                    <td>{q.clientEmail}</td>
                    <td>{new Date(q.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${q.status === 'approved' ? styles.statusApproved : styles.statusPending}`}>
                        {q.status === 'pending' ? 'Em Análise' : 'Aprovado'}
                      </span>
                    </td>
                    <td>
                      {q.status === 'pending' && (
                        <>
                          <button onClick={() => handleUpdateQuoteStatus(q.id, 'approved')} className={styles.approveBtn} title="Aprovar"><Check size={16} /></button>
                          <button onClick={() => handleUpdateQuoteStatus(q.id, 'rejected')} className={styles.deleteBtn} title="Rejeitar"><X size={16} /></button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'faq' && (
        <div className={styles.splitView}>
          <div className="card">
            <h3>Gerenciar FAQ</h3>
            <table className={styles.table}>
              <thead><tr><th>Pergunta</th><th>Ações</th></tr></thead>
              <tbody>
                {faqs.map(f => (
                  <tr key={f.id}>
                    <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.question}</td>
                    <td>
                      <button onClick={() => handleEdit(f, 'faq')} className={styles.editBtn}><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete('faq', f.id)} className={styles.deleteBtn}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card">
            <h3>{isEditing ? 'Editar FAQ' : 'Nova Pergunta'}</h3>
            <form onSubmit={handleFaqSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
              <div><label>Pergunta</label><input type="text" value={faqForm.question} onChange={e => setFaqForm({ ...faqForm, question: e.target.value })} style={inputStyle} required /></div>
              <div><label>Resposta</label><textarea rows="4" value={faqForm.answer} onChange={e => setFaqForm({ ...faqForm, answer: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} required /></div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}><Save size={16} /> Salvar FAQ</button>
                {isEditing && <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancelar</button>}
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'testimonials' && (
        <div className="card">
          <h3>Depoimentos de Clientes</h3>
          {testimonials.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>Nenhum depoimento ainda.</p>
          ) : (
            <table className={styles.table}>
              <thead><tr><th>Nome</th><th>Depoimento</th><th>Status</th><th>Ações</th></tr></thead>
              <tbody>
                {testimonials.map(t => (
                  <tr key={t.id}>
                    <td>{t.name}</td>
                    <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.content}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${t.approved ? styles.statusApproved : styles.statusPending}`}>
                        {t.approved ? 'Publicado' : 'Pendente'}
                      </span>
                    </td>
                    <td>
                      {!t.approved && (
                        <button onClick={() => handleApproveTestimonial(t.id)} className={styles.approveBtn} title="Aprovar e publicar"><Check size={16} /></button>
                      )}
                      <button onClick={() => handleDelete('testimonials', t.id)} className={styles.deleteBtn} title="Excluir"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'recognitions' && (
        <div className={styles.splitView}>
          <div className="card">
            <h3>Certificações e Reconhecimentos</h3>
            <table className={styles.table}>
              <thead><tr><th>Título</th><th>Categoria</th><th>Instituição</th><th>Ações</th></tr></thead>
              <tbody>
                {recognitions.map(rec => (
                  <tr key={rec.id}>
                    <td>{rec.title}</td>
                    <td>{rec.category}</td>
                    <td>{rec.institution}</td>
                    <td>
                      <button onClick={() => handleEdit(rec, 'recognition')} className={styles.editBtn}><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete('recognitions', rec.id)} className={styles.deleteBtn}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card">
            <h3>{isEditing ? 'Editar Reconhecimento' : 'Novo Reconhecimento'}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSave('recognitions', {
                title: recognitionForm.title,
                institution: recognitionForm.institution,
                date: recognitionForm.date,
                description: recognitionForm.description,
                image: recognitionForm.image || 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&auto=format&fit=crop',
                category: recognitionForm.category,
              });
            }} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
              <div><label>Título</label><input type="text" value={recognitionForm.title} onChange={e => setRecognitionForm({ ...recognitionForm, title: e.target.value })} style={inputStyle} required /></div>
              <div>
                <label>Categoria</label>
                <select value={recognitionForm.category} onChange={e => setRecognitionForm({ ...recognitionForm, category: e.target.value })} style={inputStyle}>
                  <option value="Certificação">Certificação</option><option value="Premiação">Premiação</option>
                  <option value="Reconhecimento">Reconhecimento</option><option value="Parceria">Parceria</option>
                </select>
              </div>
              <div><label>Instituição Emissora</label><input type="text" value={recognitionForm.institution} onChange={e => setRecognitionForm({ ...recognitionForm, institution: e.target.value })} style={inputStyle} required /></div>
              <div><label>Data</label><input type="date" value={recognitionForm.date} onChange={e => setRecognitionForm({ ...recognitionForm, date: e.target.value })} style={inputStyle} /></div>
              <div><label>URL da Imagem / Foto</label><input type="text" placeholder="https://..." value={recognitionForm.image} onChange={e => setRecognitionForm({ ...recognitionForm, image: e.target.value })} style={inputStyle} /></div>
              <div><label>Descrição</label><textarea rows="3" value={recognitionForm.description} onChange={e => setRecognitionForm({ ...recognitionForm, description: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} required /></div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}><Save size={16} /> Salvar</button>
                {isEditing && <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancelar</button>}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Portfolio CRUD with Automatic Website Screenshots */}
      {activeTab === 'portfolio' && (
        <div className={styles.splitView}>
          <div className="card">
            <h3>Gerenciar Portfólio ({portfolio.length})</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Todos os projetos com link recebem automaticamente uma captura de tela em tempo real.
            </p>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Projeto</th>
                  <th>Tipo / Cliente</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map(proj => {
                  const previewImg = thumbnailService.getProjectImage(proj);
                  return (
                    <tr key={proj.id}>
                      <td style={{ width: '60px' }}>
                        {previewImg ? (
                          <img 
                            src={previewImg} 
                            alt={proj.name} 
                            style={{ width: '48px', height: '32px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} 
                          />
                        ) : (
                          <div style={{ width: '48px', height: '32px', background: 'var(--bg-tertiary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            TF
                          </div>
                        )}
                      </td>
                      <td>
                        <strong>{proj.name}</strong>
                        {proj.link && (
                          <a href={proj.link} target="_blank" rel="noreferrer" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent)', textDecoration: 'none' }}>
                            {proj.link.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                          </a>
                        )}
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem' }}>{proj.projectType || proj.category}</span>
                        {proj.client && <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{proj.client}</span>}
                      </td>
                      <td>
                        <button onClick={() => handleEdit(proj, 'portfolio')} className={styles.editBtn} title="Editar"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete('portfolio', proj.id)} className={styles.deleteBtn} title="Excluir"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="card">
            <h3>{isEditing ? 'Editar Projeto' : 'Novo Projeto no Portfólio'}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const autoImages = portfolioForm.imageUrl.trim() 
                ? portfolioForm.imageUrl.split(',').map(s => s.trim()).filter(Boolean)
                : portfolioForm.link.trim() 
                  ? [thumbnailService.getWebsiteScreenshot(portfolioForm.link.trim())]
                  : [];

              handleSave('portfolio', {
                name: portfolioForm.name,
                category: portfolioForm.category,
                projectType: portfolioForm.projectType,
                client: portfolioForm.client,
                address: portfolioForm.address,
                location: portfolioForm.address,
                description: portfolioForm.description,
                technologies: portfolioForm.technologies.split(',').map(t => t.trim()).filter(Boolean),
                images: autoImages,
                link: portfolioForm.link,
                featured: portfolioForm.featured,
                year: parseInt(portfolioForm.year, 10) || new Date().getFullYear(),
                status: portfolioForm.status,
                order: parseInt(portfolioForm.order, 10) || 1,
                slug: portfolioForm.name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '')
              });
            }} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
              
              <div>
                <label>Nome do Projeto</label>
                <input type="text" value={portfolioForm.name} onChange={e => setPortfolioForm({ ...portfolioForm, name: e.target.value })} style={inputStyle} required placeholder="Ex: Ranchão de Palha, Fé Menina..." />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label>Tipo de Projeto</label>
                  <input type="text" value={portfolioForm.projectType} onChange={e => setPortfolioForm({ ...portfolioForm, projectType: e.target.value })} style={inputStyle} required placeholder="Ex: Loja Virtual, Site Institucional..." />
                </div>
                <div>
                  <label>Cliente</label>
                  <input type="text" value={portfolioForm.client} onChange={e => setPortfolioForm({ ...portfolioForm, client: e.target.value })} style={inputStyle} placeholder="Ex: Restaurante..." />
                </div>
              </div>

              <div>
                <label>Endereço / Localização (Opcional)</label>
                <input type="text" value={portfolioForm.address} onChange={e => setPortfolioForm({ ...portfolioForm, address: e.target.value })} style={inputStyle} placeholder="Ex: 398 Av. Goiás" />
              </div>

              <div>
                <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Link do Site / Aplicação (Gera Foto Automática)</span>
                  <span style={{ color: 'var(--accent)', fontSize: '0.75rem' }}>✨ Snapshot automático</span>
                </label>
                <input 
                  type="url" 
                  value={portfolioForm.link} 
                  onChange={e => setPortfolioForm({ ...portfolioForm, link: e.target.value })} 
                  style={inputStyle} 
                  placeholder="https://exemplo.com.br" 
                />
              </div>

              {/* Live Preview of automatic screenshot */}
              {portfolioForm.link && portfolioForm.link.startsWith('http') && (
                <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    📸 Pré-visualização da foto gerada automaticamente:
                  </span>
                  <img 
                    src={thumbnailService.getWebsiteScreenshot(portfolioForm.link)} 
                    alt="Preview automático" 
                    style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                    onError={(e) => {
                      e.target.src = thumbnailService.getFallbackScreenshot(portfolioForm.link);
                    }}
                  />
                </div>
              )}

              <div>
                <label>URL de Imagem Customizada (Opcional, substitui a foto automática)</label>
                <input type="text" value={portfolioForm.imageUrl} onChange={e => setPortfolioForm({ ...portfolioForm, imageUrl: e.target.value })} style={inputStyle} placeholder="Deixe em branco para usar a foto automática do link" />
              </div>

              <div>
                <label>Descrição do Projeto</label>
                <textarea rows="3" value={portfolioForm.description} onChange={e => setPortfolioForm({ ...portfolioForm, description: e.target.value })} style={{ ...inputStyle, resize: 'vertical' }} required placeholder="Detalhes do que foi desenvolvido..." />
              </div>

              <div>
                <label>Tecnologias (separadas por vírgula)</label>
                <input type="text" value={portfolioForm.technologies} onChange={e => setPortfolioForm({ ...portfolioForm, technologies: e.target.value })} style={inputStyle} placeholder="React, Vite, CSS Modules..." />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label>Ano</label>
                  <input type="number" value={portfolioForm.year} onChange={e => setPortfolioForm({ ...portfolioForm, year: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label>Ordem</label>
                  <input type="number" value={portfolioForm.order} onChange={e => setPortfolioForm({ ...portfolioForm, order: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label>Status</label>
                  <select value={portfolioForm.status} onChange={e => setPortfolioForm({ ...portfolioForm, status: e.target.value })} style={inputStyle}>
                    <option value="Concluído">Concluído</option>
                    <option value="Em Andamento">Em Andamento</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <input 
                  type="checkbox" 
                  id="featuredProject"
                  checked={portfolioForm.featured} 
                  onChange={e => setPortfolioForm({ ...portfolioForm, featured: e.target.checked })} 
                />
                <label htmlFor="featuredProject" style={{ cursor: 'pointer', fontSize: '0.85rem' }}>Exibir na Página Inicial (Destaque)</label>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}><Save size={16} /> Salvar Projeto</button>
                {isEditing && <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancelar</button>}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected Order Detailed Modal Overlay */}
      {selectedOrder && (
        <div className={styles.overlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeModalBtn} onClick={() => setSelectedOrder(null)}>
              <X size={24} />
            </button>

            <h2>Detalhes da Solicitação — ID: {selectedOrder.id}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Recebido em: {new Date(selectedOrder.createdAt).toLocaleString('pt-BR')}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '1.5rem' }}>
              <div>
                <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>Cliente</h4>
                <p><strong>Nome:</strong> {selectedOrder.clientName}</p>
                <p><strong>E-mail:</strong> {selectedOrder.clientEmail}</p>
                <p><strong>WhatsApp:</strong> {selectedOrder.clientPhone}</p>
                <p><strong>Contato Preferencial:</strong> {selectedOrder.preferredContact === 'whatsapp' ? 'WhatsApp' : 'Site'}</p>
              </div>

              <div>
                <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>Produto e Valores</h4>
                <p><strong>Item Adquirido:</strong> {selectedOrder.items[0]?.name}</p>
                <p><strong>Valor Total:</strong> R$ {selectedOrder.total.toFixed(2)}</p>
                <p><strong>Tipo de Pagamento:</strong> {selectedOrder.paymentType === 'mercado_pago' ? 'Mercado Pago (Automático)' : 'PIX Manual'}</p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <strong>Status Atual:</strong>
                  <span className={`${styles.statusBadge} ${getStatusBadgeClass(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </p>
              </div>
            </div>

            {/* Audit Trail digital contract */}
            {selectedOrder.contractAccepted && (
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0 }}>
                  <FileText size={16} style={{ color: 'var(--success)' }} />
                  <span>Aceite de Contrato Digital Registrado</span>
                </h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  <p><strong>Data/Hora do Aceite:</strong> {new Date(selectedOrder.contractAcceptedAt).toLocaleString('pt-BR')}</p>
                  <p><strong>IP do Dispositivo:</strong> {selectedOrder.contractAcceptedIp}</p>
                  <p><strong>Status Termos:</strong> Concordou eletronicamente com os termos de licenciamento.</p>
                </div>
              </div>
            )}

            {/* Comprovante View */}
            {selectedOrder.comprovanteFile ? (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>Comprovante de Pagamento</h4>
                <div style={{ marginTop: '0.5rem' }}>
                  {selectedOrder.comprovanteFile.startsWith('data:image') ? (
                    <img 
                      src={selectedOrder.comprovanteFile} 
                      alt="Comprovante" 
                      style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '4px', background: 'white' }} 
                    />
                  ) : (
                    <a href={selectedOrder.comprovanteFile} download={selectedOrder.comprovanteName || "comprovante"} className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Download size={14} />
                      <span>Baixar Comprovante PDF ({selectedOrder.comprovanteName || "Arquivo"})</span>
                    </a>
                  )}
                </div>
              </div>
            ) : selectedOrder.paymentType === 'mercado_pago' ? (
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>Comprovante</h4>
                <p style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>✓ Transação automática liquidada pelo Mercado Pago.</p>
              </div>
            ) : null}

            {/* Status change actions */}
            <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
              <h4 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '0.95rem' }}>Alterar Status da Solicitação</h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select 
                  style={{ ...inputStyle, width: '220px' }} 
                  value={selectedOrder.status}
                  onChange={e => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}
                >
                  <option value="Aguardando pagamento">Aguardando pagamento</option>
                  <option value="Em análise">Em análise</option>
                  <option value="Pagamento aprovado">Pagamento aprovado</option>
                  <option value="Projeto iniciado">Projeto iniciado</option>
                  <option value="Em desenvolvimento">Em desenvolvimento</option>
                  <option value="Finalizado">Finalizado</option>
                </select>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                  Nota: Alterar o status enviará automaticamente um e-mail de aviso ao cliente.
                </span>
              </div>
            </div>

            {/* Internal Notes */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>Observações Internas (Somente Visível para TF Hub)</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '0.5rem' }}>
                <textarea 
                  rows="3" 
                  style={inputStyle} 
                  placeholder="Escreva observações internas sobre este projeto (não exibidas na área do cliente)..."
                  value={internalNotes}
                  onChange={e => setInternalNotes(e.target.value)}
                />
                <button 
                  className="btn btn-secondary btn-sm" 
                  style={{ alignSelf: 'flex-start' }}
                  onClick={handleSaveInternalNotes}
                >
                  Salvar Observações
                </button>
              </div>
            </div>

            {/* Support Message Wall (Chat) */}
            <div>
              <h4 style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>Chat de Suporte com o Cliente</h4>
              
              <div className={styles.chatBox}>
                <div className={styles.messageList}>
                  {selectedOrder.messages && selectedOrder.messages.length > 0 ? (
                    selectedOrder.messages.map((msg, idx) => (
                      <div 
                        key={idx} 
                        className={`${styles.messageItem} ${msg.sender === 'admin' ? styles.messageItemAdmin : styles.messageItemClient}`}
                      >
                        <strong>{msg.senderName}:</strong>
                        <p style={{ margin: '4px 0 0' }}>{msg.text}</p>
                        <span className={styles.messageMeta}>
                          {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', margin: 'auto' }}>
                      Nenhuma mensagem enviada ainda.
                    </p>
                  )}
                </div>

                <form className={styles.chatForm} onSubmit={handleSendAdminReply}>
                  <input 
                    type="text" 
                    placeholder="Digite sua mensagem para o cliente..." 
                    className={styles.chatInput}
                    value={adminReply}
                    onChange={e => setAdminReply(e.target.value)}
                  />
                  <button type="submit" className={styles.chatSendBtn}>
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={confirmState.open}
        title="Excluir registro"
        description="Esta ação não pode ser desfeita. Tem certeza que deseja excluir este registro?"
        confirmText="Sim, excluir"
        loading={confirmState.loading}
        onConfirm={confirmDelete}
        onClose={() => setConfirmState({ open: false, key: null, id: null, loading: false })}
      />
    </div>
  );
}
