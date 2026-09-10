import { mockDb } from './mockDb';

export const emailService = {
  async sendEmail({ to, subject, html }) {
    const settings = mockDb.get('settings') || {};
    const apiKey = settings.resendApiKey;
    const sender = settings.resendSenderEmail || 'noreply@tfhub.com.br';

    console.log(`%c[E-mail Simulado] Para: ${to}\nAssunto: ${subject}`, 'color: #7c3aed; font-weight: bold; font-size: 1.1em;');
    console.log('Conteúdo HTML:\n', html);

    if (apiKey) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: sender,
            to: [to],
            subject,
            html
          })
        });
        const data = await response.json();
        console.log('[Resend Email Response]', data);
        return data;
      } catch (err) {
        console.error('[Resend Email Error]', err);
      }
    }

    // Simulated email log in localStorage for Admin view
    const emailLogs = JSON.parse(localStorage.getItem('tf_email_logs')) || [];
    emailLogs.unshift({
      id: `mail_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      to,
      subject,
      html,
      sentAt: new Date().toISOString()
    });
    localStorage.setItem('tf_email_logs', JSON.stringify(emailLogs.slice(0, 50))); // Keep last 50

    // Show simulated toast on window if available
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('tf_email_sent', { detail: { to, subject } });
      window.dispatchEvent(event);
    }

    return { mockSent: true };
  },

  getBaseUrl() {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const pathname = window.location.pathname.endsWith('/') 
        ? window.location.pathname 
        : window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
      return `${origin}${pathname}`;
    }
    return 'https://thawfernandes.github.io/plataforma-tfhub/';
  },

  sendNewOrderEmail(order) {
    const adminEmail = 'tfhubdesign@gmail.com';
    const adminLink = `${this.getBaseUrl()}#/admin/pedidos`;
    const html = `
      <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #7c3aed; margin-top: 0;">Nova solicitação de compra recebida!</h2>
        <p>Olá, equipe TF Hub,</p>
        <p>Existe uma nova compra aguardando análise no sistema.</p>
        <table style="border-collapse: collapse; width: 100%; margin-top: 15px;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; width: 120px;">Cliente:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${order.clientName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">E-mail:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${order.clientEmail}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">WhatsApp:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${order.clientPhone}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Produto:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${order.items[0]?.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Valor:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">R$ ${order.total.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Atendimento:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${order.preferredContact === 'whatsapp' ? 'Finalizar por WhatsApp' : 'Finalizar pelo site'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Método:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${order.paymentType === 'mercado_pago' ? 'Mercado Pago PIX (Automático)' : 'PIX Manual + Comprovante'}</td>
          </tr>
        </table>
        <p style="margin-top: 25px;">
          <a href="${adminLink}" style="background-color: #7c3aed; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Abrir Solicitação no Painel</a>
        </p>
      </div>
    `;
    return this.sendEmail({ to: adminEmail, subject: `Nova Solicitação - ${order.clientName} (${order.items[0]?.name})`, html });
  },

  sendOrderReceivedEmail(order) {
    const clientLink = `${this.getBaseUrl()}#/cliente`;
    const html = `
      <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #7c3aed; margin-top: 0;">Recebemos sua solicitação, ${order.clientName}!</h2>
        <p>Obrigado por escolher a TF Hub.</p>
        <p>Sua solicitação para adquirir o produto <strong>${order.items[0]?.name}</strong> foi registrada com sucesso.</p>
        <p><strong>Detalhes do pedido:</strong></p>
        <ul>
          <li>Pedido ID: ${order.id}</li>
          <li>Valor total: R$ ${order.total.toFixed(2)}</li>
          <li>Status atual: <strong>${order.status}</strong></li>
        </ul>
        <p>Você pode acompanhar o progresso em tempo real, ver o contrato digital e enviar mensagens na sua <a href="${clientLink}">Área do Cliente</a>.</p>
        <p>Abraços,<br/>Equipe TF Hub</p>
      </div>
    `;
    return this.sendEmail({ to: order.clientEmail, subject: `Solicitação Registrada: ${order.items[0]?.name}`, html });
  },

  sendPaymentApprovedEmail(order) {
    const clientLink = `${this.getBaseUrl()}#/cliente`;
    const html = `
      <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #10b981; margin-top: 0;">Seu pagamento foi confirmado! 🎉</h2>
        <p>Olá, ${order.clientName},</p>
        <p>Confirmamos o recebimento do seu pagamento para o produto <strong>${order.items[0]?.name}</strong>.</p>
        <p><strong>O que acontece agora?</strong></p>
        <ul>
          <li>Se o produto for digital ou sistema, o download já está liberado na sua <a href="${clientLink}">Área do Cliente</a>!</li>
          <li>Se for um projeto sob desenvolvimento, nossa equipe dará início à produção imediatamente.</li>
        </ul>
        <p>Acesse o painel para realizar downloads ou enviar mensagens diretamente para nossa equipe.</p>
        <p>Abraços,<br/>Equipe TF Hub</p>
      </div>
    `;
    return this.sendEmail({ to: order.clientEmail, subject: `Pagamento Confirmado: ${order.items[0]?.name}`, html });
  },

  sendStatusUpdatedEmail(order, oldStatus) {
    const clientLink = `${this.getBaseUrl()}#/cliente`;
    const html = `
      <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #7c3aed; margin-top: 0;">Atualização no seu pedido!</h2>
        <p>Olá, ${order.clientName},</p>
        <p>O status do seu pedido para <strong>${order.items[0]?.name}</strong> foi alterado.</p>
        <p style="font-size: 1.1em; background: #f3f4f6; padding: 12px; border-radius: 5px; display: inline-block;">
          Status anterior: <span style="text-decoration: line-through; color: #6b7280;">${oldStatus}</span><br/>
          <strong>Novo status: <span style="color: #7c3aed;">${order.status}</span></strong>
        </p>
        <p>Acompanhe todos os detalhes do projeto e a linha do tempo completa na sua <a href="${clientLink}">Área do Cliente</a>.</p>
        <p>Abraços,<br/>Equipe TF Hub</p>
      </div>
    `;
    return this.sendEmail({ to: order.clientEmail, subject: `Status Atualizado: ${order.items[0]?.name} (${order.status})`, html });
  }
};
