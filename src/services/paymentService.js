import { mockDb } from './mockDb';
import { emailService } from './emailService';

export const paymentService = {
  checkConfiguration() {
    const settings = mockDb.get('settings') || {};
    return !!(settings.mercadoPagoAccessToken || settings.mercadoPagoPublicKey);
  },

  createPayment(product, clientData) {
    const isConfigured = this.checkConfiguration();
    const price = product.promoPrice || product.price;

    if (isConfigured) {
      const paymentId = `mp_pay_${Date.now()}`;
      return {
        type: 'mercado_pago',
        paymentId,
        amount: price,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021226870014br.gov.bcb.pix2565tfhubdesign@gmail.com5204000053039865406${price.toFixed(2)}5802BR5906TF_HUB6009SAO_PAULO62070503***6304MOCK`,
        copiaCola: `00020101021226870014br.gov.bcb.pix2565tfhubdesign@gmail.com5204000053039865406${price.toFixed(2)}5802BR5906TF_HUB6009SAO_PAULO62070503***6304MOCK`
      };
    } else {
      return {
        type: 'manual',
        amount: price,
        pixKey: 'tfhubdesign@gmail.com',
        beneficiary: 'TF Hub'
      };
    }
  },

  simulateWebhook(orderId) {
    const orders = mockDb.get('orders') || [];
    const orderIdx = orders.findIndex(o => o.id === orderId);

    if (orderIdx !== -1) {
      const order = orders[orderIdx];
      if (order.status === 'Aguardando pagamento' || order.status === 'Em análise') {
        const oldStatus = order.status;
        order.status = 'Pagamento aprovado';
        
        // Add to timeline
        order.timeline.push({
          title: 'Pagamento aprovado',
          date: new Date().toISOString(),
          description: `O pagamento automático via PIX de R$ ${order.total.toFixed(2)} foi confirmado e aprovado com sucesso.`
        });

        // Add to messages/support wall
        order.messages.push({
          sender: 'admin',
          senderName: 'TF Hub Sistema',
          text: 'Pagamento confirmado! Seu pedido está agora em fase de liberação ou desenvolvimento.',
          timestamp: new Date().toISOString()
        });

        orders[orderIdx] = order;
        mockDb.save('orders', orders);

        // Dispatch email notification
        emailService.sendPaymentApprovedEmail(order);

        // Trigger custom UI event to reload details view
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('tf_order_updated', { detail: { orderId, status: 'Pagamento aprovado' } }));
        }
      }
    }
  }
};
