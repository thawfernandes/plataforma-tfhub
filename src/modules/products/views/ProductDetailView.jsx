import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { mockDb } from '../../../services/mockDb';
import { paymentService } from '../../../services/paymentService';
import { emailService } from '../../../services/emailService';
import { 
  ArrowLeft, 
  CheckCircle2, 
  HelpCircle, 
  Info, 
  Lock, 
  UploadCloud, 
  X, 
  ChevronRight, 
  Copy, 
  Check,
  FileText
} from 'lucide-react';
import styles from './ProductDetailView.module.css';

export default function ProductDetailView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // Wizard States
  const [currentStep, setCurrentStep] = useState(1);
  const [clientForm, setClientForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferredContact: 'site'
  });
  const [contractAccepted, setContractAccepted] = useState(false);
  const [comprovante, setComprovante] = useState(null);
  const [comprovanteName, setComprovanteName] = useState('');
  const [comprovanteType, setComprovanteType] = useState('');
  const [uploading, setUploading] = useState(false);
  
  const [pixResponse, setPixResponse] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const [webhookSimulated, setWebhookSimulated] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Load product data
  useEffect(() => {
    const list = mockDb.get('products') || [];
    const found = list.find(p => p.slug === slug);
    if (found) {
      setProduct(found);
    }
    setLoading(false);
  }, [slug]);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setClientForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <p>Carregando detalhes do produto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>Produto não encontrado</h2>
        <p style={{ margin: '1rem 0 2rem', color: 'var(--text-secondary)' }}>
          O produto que você está tentando acessar não está disponível no momento.
        </p>
        <Link to="/produtos" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Voltar para Produtos</span>
        </Link>
      </div>
    );
  }

  const price = product.promoPrice || product.price;

  // Handle Tab Switch
  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className={styles.tabPanel}>
            <p style={{ whiteSpace: 'pre-line' }}>{product.metadata?.fullDescription || product.description}</p>
          </div>
        );
      case 'features':
        const featuresList = product.metadata?.features ? product.metadata.features.split('\n') : [];
        return (
          <div className={styles.tabPanel}>
            {featuresList.length === 0 ? (
              <p>Nenhuma funcionalidade especificada.</p>
            ) : (
              <ul>
                {featuresList.map((f, idx) => <li key={idx}>{f}</li>)}
              </ul>
            )}
          </div>
        );
      case 'requirements':
        const reqsList = product.metadata?.requirements ? product.metadata.requirements.split('\n') : [];
        return (
          <div className={styles.tabPanel}>
            {reqsList.length === 0 ? (
              <p>Nenhum requisito especificado.</p>
            ) : (
              <ul>
                {reqsList.map((r, idx) => <li key={idx}>{r}</li>)}
              </ul>
            )}
          </div>
        );
      case 'faqs':
        const faqsRaw = product.metadata?.faqs ? product.metadata.faqs.split('\n') : [];
        return (
          <div className={styles.tabPanel}>
            {faqsRaw.length === 0 ? (
              <p>Perguntas frequentes indisponíveis.</p>
            ) : (
              faqsRaw.map((faqLine, idx) => {
                const parts = faqLine.split('|');
                return (
                  <div key={idx} className={styles.faqItem}>
                    <h4 className={styles.faqQuestion}>{parts[0]?.trim()}</h4>
                    <p className={styles.faqAnswer}>{parts[1]?.trim()}</p>
                  </div>
                );
              })
            )}
          </div>
        );
      case 'futureVersions':
        const futureList = product.metadata?.futureVersions ? product.metadata.futureVersions.split('\n') : [];
        return (
          <div className={styles.tabPanel}>
            {futureList.length === 0 ? (
              <p>Sem informações de atualizações futuras.</p>
            ) : (
              <ul>
                {futureList.map((fv, idx) => <li key={idx}>{fv}</li>)}
              </ul>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  // Open checkout Wizard
  const handleStartCheckout = () => {
    setIsWizardOpen(true);
    setCurrentStep(1);
    setErrorMsg('');
    setWebhookSimulated(false);
    setComprovante(null);
    setComprovanteName('');
    setContractAccepted(false);
  };

  // Step 1 validation and payment init
  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (!clientForm.name || !clientForm.email || !clientForm.phone) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setErrorMsg('');

    // If client prefers WhatsApp, redirect and capture lead in database
    if (clientForm.preferredContact === 'whatsapp') {
      saveLeadOrder('whatsapp');
      // Step logic handles modal closed manually or showing contact representatives
    }

    // Initialize payment response based on whether Mercado Pago is active
    const response = paymentService.createPayment(product, clientForm);
    setPixResponse(response);
    setCurrentStep(2);
  };

  // Save lead in DB (for WhatsApp checkout or tracking)
  const saveLeadOrder = (preferredContact) => {
    const orders = mockDb.get('orders') || [];
    const newLead = {
      id: `ord_${Date.now()}`,
      userId: user ? user.id : 'user_client',
      clientName: clientForm.name,
      clientEmail: clientForm.email,
      clientPhone: clientForm.phone,
      preferredContact: preferredContact,
      items: [{
        id: product.id,
        name: product.name,
        price: product.price,
        promoPrice: product.promoPrice,
        type: product.type
      }],
      total: price,
      status: 'Aguardando pagamento',
      contractAccepted: false,
      timeline: [
        { title: 'Solicitação iniciada', date: new Date().toISOString(), description: `Demonstrou interesse no produto via ${preferredContact === 'whatsapp' ? 'WhatsApp' : 'site'}.` }
      ],
      messages: [],
      notes: 'Contato preferencial por WhatsApp. Aguardando interação externa.',
      createdAt: new Date().toISOString()
    };
    orders.unshift(newLead);
    mockDb.save('orders', orders);
    emailService.sendNewOrderEmail(newLead);
  };

  // Copy PIX Copy and Paste key
  const handleCopyPix = () => {
    const key = pixResponse?.copiaCola || 'tfhubdesign@gmail.com';
    navigator.clipboard.writeText(key);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  // Handle file upload Base64 conversion
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowed.includes(file.type)) {
      setErrorMsg('Formato de arquivo inválido. Envie apenas PDF, PNG ou JPG.');
      return;
    }

    setUploading(true);
    setErrorMsg('');

    const reader = new FileReader();
    reader.onloadend = () => {
      setComprovante(reader.result); // Base64 encoding
      setComprovanteName(file.name);
      setComprovanteType(file.type);
      setUploading(false);
    };
    reader.onerror = () => {
      setErrorMsg('Erro ao ler o arquivo comprovante.');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Simulate Mercado Pago Automatic webhook confirmation
  const handleSimulateWebhook = () => {
    setWebhookSimulated(true);
    // Instantly confirm
    alert('Simulação do Mercado Pago: Pagamento aprovado via Webhook com sucesso! Você pode avançar para a finalização.');
  };

  // Complete Order Checkout
  const handleCompleteOrder = () => {
    if (!webhookSimulated && !comprovante) {
      setErrorMsg('Por favor, faça o upload do seu comprovante de pagamento para continuar.');
      return;
    }

    setErrorMsg('');
    setUploading(true);

    const allOrders = mockDb.get('orders') || [];
    const settings = mockDb.get('settings') || {};

    const newOrder = {
      id: `ord_${Date.now()}`,
      userId: user ? user.id : 'user_client',
      clientName: clientForm.name,
      clientEmail: clientForm.email,
      clientPhone: clientForm.phone,
      preferredContact: clientForm.preferredContact,
      items: [{
        id: product.id,
        name: product.name,
        price: product.price,
        promoPrice: product.promoPrice,
        type: product.type,
        metadata: {
          downloadUrl: product.metadata?.downloadUrl
        }
      }],
      total: price,
      status: webhookSimulated ? 'Pagamento aprovado' : 'Em análise',
      comprovanteFile: comprovante,
      comprovanteName: comprovanteName,
      contractAccepted: true,
      contractAcceptedAt: new Date().toISOString(),
      contractAcceptedIp: '186.230.22.45',
      contractTextVersion: settings.contractText || '',
      timeline: [
        { title: 'Solicitação criada', date: new Date().toISOString(), description: `Solicitação para adquirir o produto ${product.name}.` },
        { title: 'Contrato aceito', date: new Date().toISOString(), description: 'Contrato de Prestação de Serviços aceito eletronicamente.' }
      ],
      messages: [],
      notes: '',
      paymentType: pixResponse?.type || 'manual',
      createdAt: new Date().toISOString()
    };

    if (webhookSimulated) {
      newOrder.timeline.push({
        title: 'Pagamento aprovado',
        date: new Date().toISOString(),
        description: `Pagamento via PIX de R$ ${newOrder.total.toFixed(2)} confirmado automaticamente.`
      });
    } else if (comprovante) {
      newOrder.timeline.push({
        title: 'Comprovante enviado',
        date: new Date().toISOString(),
        description: `Comprovante "${comprovanteName}" enviado para análise.`
      });
    }

    allOrders.unshift(newOrder);
    mockDb.save('orders', allOrders);

    // Send email notifications
    emailService.sendNewOrderEmail(newOrder);
    emailService.sendOrderReceivedEmail(newOrder);
    if (webhookSimulated) {
      emailService.sendPaymentApprovedEmail(newOrder);
    }

    setUploading(false);
    // Advance to the confirmation/WhatsApp step (step 5)
    setCurrentStep(5);
  };

  // Prefilled WhatsApp message url helper
  const getWhatsAppLink = (number) => {
    const text = encodeURIComponent(
      `Olá! Me chamo ${clientForm.name} e acabei de adquirir o ${product.name} pela TF Hub. Já realizei o pagamento e estou aguardando a entrega e personalização. Podemos prosseguir?`
    );
    return `https://wa.me/${number}?text=${text}`;
  };

  return (
    <div className={styles.detailContainer + " container"}>
      <Link to="/produtos" className={styles.backLink}>
        <ArrowLeft size={18} />
        <span>Voltar para Produtos</span>
      </Link>

      <div className={styles.productHeader}>
        <div className={styles.imageGallery}>
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className={styles.mainImage} 
          />
        </div>

        <div>
          <span className={styles.badge}>{product.type === 'system' ? 'Sistema' : 'Produto'}</span>
          <h1 className={styles.productName}>{product.name}</h1>
          <p className={styles.shortDesc}>{product.description}</p>

          <div className={styles.priceBox}>
            <span className={styles.priceLabel}>Investimento:</span>
            {product.promoPrice ? (
              <>
                <span className={styles.promoPrice}>R$ {product.promoPrice.toFixed(2)}</span>
                <span className={styles.oldPrice}>R$ {product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className={styles.regularPrice}>R$ {product.price.toFixed(2)}</span>
            )}
          </div>

          <button className={styles.ctaBtn + " btn btn-primary"} onClick={handleStartCheckout}>
            <Lock size={18} />
            <span>Quero Adquirir</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabList}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'description' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Descrição
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'features' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('features')}
          >
            Funcionalidades
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'requirements' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('requirements')}
          >
            Requisitos do Sistema
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'faqs' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('faqs')}
          >
            Perguntas Frequentes
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'futureVersions' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('futureVersions')}
          >
            Melhorias Futuras
          </button>
        </div>

        <div style={{ minHeight: '150px' }}>
          {renderTabContent()}
        </div>
      </div>

      {/* Purchase Wizard Modal */}
      {isWizardOpen && (
        <div className={styles.wizardBackdrop}>
          <div className={styles.wizardModal}>
            <div className={styles.wizardHeader}>
              <h3 className={styles.wizardTitle}>Adquirir {product.name}</h3>
              <button className={styles.closeBtn} onClick={() => setIsWizardOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Stepper progress */}
            {clientForm.preferredContact === 'site' && (
              <div className={styles.progressBar}>
                <div className={`${styles.stepIndicator} ${currentStep >= 1 ? styles.stepIndicatorActive : ''} ${currentStep > 1 ? styles.stepIndicatorDone : ''}`}>
                  <span className={styles.stepNumber}>1</span>
                  <span>Dados</span>
                </div>
                <div className={`${styles.stepIndicator} ${currentStep >= 2 ? styles.stepIndicatorActive : ''} ${currentStep > 2 ? styles.stepIndicatorDone : ''}`}>
                  <span className={styles.stepNumber}>2</span>
                  <span>Contrato</span>
                </div>
                <div className={`${styles.stepIndicator} ${currentStep >= 3 ? styles.stepIndicatorActive : ''} ${currentStep > 3 ? styles.stepIndicatorDone : ''}`}>
                  <span className={styles.stepNumber}>3</span>
                  <span>PIX</span>
                </div>
                <div className={`${styles.stepIndicator} ${currentStep >= 4 ? styles.stepIndicatorActive : ''} ${currentStep > 4 ? styles.stepIndicatorDone : ''}`}>
                  <span className={styles.stepNumber}>4</span>
                  <span>Comprovante</span>
                </div>
                <div className={`${styles.stepIndicator} ${currentStep >= 5 ? styles.stepIndicatorActive : ''}`}>
                  <span className={styles.stepNumber}>5</span>
                  <span>Conclusão</span>
                </div>
              </div>
            )}

            <div className={styles.wizardBody}>
              {errorMsg && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.9rem', fontWeight: 600 }}>
                  {errorMsg}
                </div>
              )}

              {/* STEP 1: Client Data Form */}
              {currentStep === 1 && (
                <form onSubmit={handleStep1Submit}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Nome Completo</label>
                    <input 
                      type="text" 
                      required 
                      className={styles.input}
                      value={clientForm.name}
                      onChange={(e) => setClientForm({...clientForm, name: e.target.value})}
                      placeholder="Ex: João Silva" 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>E-mail de Contato</label>
                    <input 
                      type="email" 
                      required 
                      className={styles.input}
                      value={clientForm.email}
                      onChange={(e) => setClientForm({...clientForm, email: e.target.value})}
                      placeholder="Ex: joao@gmail.com" 
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>WhatsApp / Celular</label>
                    <input 
                      type="text" 
                      required 
                      className={styles.input}
                      value={clientForm.phone}
                      onChange={(e) => setClientForm({...clientForm, phone: e.target.value})}
                      placeholder="Ex: (62) 99999-9999" 
                    />
                  </div>

                  <div className={styles.formGroup} style={{ marginTop: '1.5rem' }}>
                    <label className={styles.label}>Como prefere continuar o atendimento?</label>
                    <div className={styles.radioGrid}>
                      <div 
                        className={`${styles.radioCard} ${clientForm.preferredContact === 'site' ? styles.radioCardActive : ''}`}
                        onClick={() => setClientForm({...clientForm, preferredContact: 'site'})}
                      >
                        <input 
                          type="radio" 
                          checked={clientForm.preferredContact === 'site'} 
                          onChange={() => {}} 
                          style={{ accentColor: 'var(--primary)', marginTop: '3px' }}
                        />
                        <div>
                          <div className={styles.radioTitle}>Quero finalizar tudo pelo site (Mais rápido)</div>
                          <div className={styles.radioDesc}>Assine o contrato digital e envie o PIX por aqui mesmo.</div>
                        </div>
                      </div>

                      <div 
                        className={`${styles.radioCard} ${clientForm.preferredContact === 'whatsapp' ? styles.radioCardActive : ''}`}
                        onClick={() => setClientForm({...clientForm, preferredContact: 'whatsapp'})}
                      >
                        <input 
                          type="radio" 
                          checked={clientForm.preferredContact === 'whatsapp'} 
                          onChange={() => {}} 
                          style={{ accentColor: 'var(--primary)', marginTop: '3px' }}
                        />
                        <div>
                          <div className={styles.radioTitle}>Prefiro conversar pelo WhatsApp</div>
                          <div className={styles.radioDesc}>Nossa equipe finalizará a contratação diretamente com você.</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {clientForm.preferredContact === 'whatsapp' && clientForm.name && clientForm.email && clientForm.phone && (
                    <div className={styles.representativeGrid}>
                      <a 
                        href={getWhatsAppLink('5562999035313')} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={styles.repCard}
                        onClick={() => setIsWizardOpen(false)}
                      >
                        <span className={styles.repName}>Conversar com Thawanny</span>
                        <span className={styles.whatsappBtn}>Chamar no WhatsApp</span>
                      </a>
                      <a 
                        href={getWhatsAppLink('5561999425106')} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={styles.repCard}
                        onClick={() => setIsWizardOpen(false)}
                      >
                        <span className={styles.repName}>Conversar com Fabiana</span>
                        <span className={styles.whatsappBtn}>Chamar no WhatsApp</span>
                      </a>
                    </div>
                  )}

                  {clientForm.preferredContact === 'site' && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                      <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>Avançar</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </form>
              )}

              {/* STEP 2: Contract Agreement */}
              {currentStep === 2 && (
                <div>
                  <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: 800 }}>Contrato de Licenciamento</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                    Leia atentamente o contrato abaixo antes de prosseguir com a aquisição da licença.
                  </p>

                  <div className={styles.contractText}>
                    {mockDb.get('settings')?.contractText}
                  </div>

                  <label className={styles.checkboxContainer}>
                    <input 
                      type="checkbox" 
                      className={styles.checkbox}
                      checked={contractAccepted}
                      onChange={(e) => setContractAccepted(e.target.checked)}
                    />
                    <span>Li e concordo com os termos descritos acima.</span>
                  </label>

                  <div className={styles.wizardFooter} style={{ borderTop: 'none', padding: '2rem 0 0', background: 'transparent' }}>
                    <button className="btn btn-secondary" onClick={() => setCurrentStep(1)}>Voltar</button>
                    <button 
                      className="btn btn-primary" 
                      disabled={!contractAccepted}
                      onClick={() => setCurrentStep(3)}
                    >
                      Avançar
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PIX payment instructions */}
              {currentStep === 3 && (
                <div>
                  <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                    {pixResponse?.type === 'mercado_pago' ? 'Pagamento PIX automático (Mercado Pago)' : 'Pagamento via PIX manual'}
                  </h4>

                  <div className={styles.paymentNotice}>
                    <strong>Pagamento único:</strong><br/>
                    O {product.name} é um software pronto para uso. Após a confirmação do seu pagamento, a equipe TF Hub entrará em contato pelo WhatsApp para personalizar e entregar o sistema.
                    <strong style={{ display: 'block', marginTop: '0.5rem', color: 'var(--accent)' }}>
                      Valor total: R$ {price.toFixed(2).replace('.', ',')}/mês
                    </strong>
                  </div>

                  {pixResponse?.type === 'mercado_pago' ? (
                    <div className={styles.pixBox}>
                      <img src={pixResponse.qrCodeUrl} alt="QR Code PIX" className={styles.pixQr} />
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Escaneie o QR Code PIX acima ou copie o código Pix Copia e Cola abaixo:</p>
                      
                      <div className={styles.pixKeyBox}>
                        {pixResponse.copiaCola}
                      </div>

                      <button className="btn btn-secondary btn-sm" onClick={handleCopyPix}>
                        {copiado ? <Check size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
                        <span>{copiado ? 'Copiado!' : 'Copiar Código PIX'}</span>
                      </button>

                      {/* Mock webhook confirm button */}
                      <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', width: '100%' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Deseja simular a aprovação instantânea da API do Mercado Pago?</p>
                        <button className={styles.webhookSimBtn} onClick={handleSimulateWebhook}>
                          Simular Confirmação Webhook
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.pixBox}>
                      <div style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>📱</div>
                      <strong>Chave PIX (E-mail):</strong>
                      <div className={styles.pixKeyBox}>
                        {pixResponse?.pixKey || 'tfhubdesign@gmail.com'}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Beneficiário: TF Hub</p>

                      <button className="btn btn-secondary btn-sm" onClick={handleCopyPix}>
                        {copiado ? <Check size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
                        <span>{copiado ? 'Copiado!' : 'Copiar Chave PIX'}</span>
                      </button>
                    </div>
                  )}

                  <div className={styles.wizardFooter} style={{ borderTop: 'none', padding: '1rem 0 0', background: 'transparent' }}>
                    <button className="btn btn-secondary" onClick={() => setCurrentStep(2)}>Voltar</button>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => setCurrentStep(4)}
                    >
                      {webhookSimulated ? 'Ir para Finalização' : 'Próximo Passo'}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Receipt Upload and Completion */}
              {currentStep === 4 && (
                <div>
                  <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: 800 }}>Confirmação do Pagamento</h4>
                  
                  {webhookSimulated ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                      <div style={{ fontSize: '3.5rem', color: 'var(--success)', marginBottom: '1rem' }}>🎉</div>
                      <h4 style={{ color: 'var(--success)', fontWeight: 'bold' }}>Pagamento Confirmado!</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: '1.6' }}>
                        O pagamento foi processado com sucesso. Clique em "Finalizar" para prosseguir.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                        Envie o comprovante do PIX para confirmarmos o pagamento e iniciarmos a entrega do sistema.
                      </p>

                      <label className={styles.fileUploadZone}>
                        <input 
                          type="file" 
                          accept=".pdf,.png,.jpg,.jpeg" 
                          style={{ display: 'none' }} 
                          onChange={handleFileChange}
                        />
                        <UploadCloud size={36} className={styles.uploadIcon} />
                        <strong>Clique para selecionar ou arraste o comprovante</strong>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Formatos aceitos: PDF, PNG, JPG ou JPEG
                        </span>
                      </label>

                      {comprovanteName && (
                        <div className={styles.uploadedFileBar}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FileText size={16} style={{ color: 'var(--primary)' }} />
                            <span style={{ fontWeight: 600 }}>{comprovanteName}</span>
                          </div>
                          <button className={styles.removeFileBtn} onClick={() => { setComprovante(null); setComprovanteName(''); }}>
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className={styles.wizardFooter} style={{ borderTop: 'none', padding: '2rem 0 0', background: 'transparent' }}>
                    <button className="btn btn-secondary" onClick={() => setCurrentStep(3)}>Voltar</button>
                    <button 
                      className="btn btn-primary" 
                      disabled={uploading || (!webhookSimulated && !comprovante)}
                      onClick={handleCompleteOrder}
                    >
                      {uploading ? 'Enviando...' : 'Finalizar Pedido'}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: Success + WhatsApp redirect */}
              {currentStep === 5 && (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                  <h4 style={{ color: 'var(--success)', fontWeight: 800, fontSize: '1.2rem', marginBottom: '0.75rem' }}>
                    Pedido recebido com sucesso!
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                    Recebemos sua solicitação de <strong>{product.name}</strong>.
                    Nossa equipe irá verificar o pagamento, personalizar e entregar o sistema diretamente pelo WhatsApp.
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '2rem' }}>
                    Clique abaixo para já entrar em contato conosco e agilizar a entrega:
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '340px', margin: '0 auto' }}>
                    <a
                      href={getWhatsAppLink('5562999035313')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#25d366', borderColor: '#25d366', color: '#fff', fontWeight: 700, fontSize: '1rem', padding: '0.9rem 1.5rem', borderRadius: '12px' }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Falar com Thawanny
                    </a>
                    <a
                      href={getWhatsAppLink('5561999425106')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#25d366', borderColor: '#25d366', color: '#fff', fontWeight: 700, fontSize: '1rem', padding: '0.9rem 1.5rem', borderRadius: '12px' }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Falar com Fabiana
                    </a>
                  </div>

                  <button
                    className="btn btn-secondary"
                    style={{ marginTop: '1.5rem', width: '100%' }}
                    onClick={() => setIsWizardOpen(false)}
                  >
                    Fechar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
