/**
 * cloudDbService.js
 * Serviço de sincronização em nuvem em tempo real para a Plataforma TF Hub.
 * Permite persistência entre múltiplos dispositivos (celular, computador, navegadores diferentes)
 * com fallback transparente para localStorage e sincronização bidirecional automática.
 */

const CLOUD_SYNC_ENDPOINT = 'https://tfhub-platform-sync-default-rtdb.firebaseio.com';

const SYNCED_KEYS = ['orders', 'quotes', 'users', 'certificates'];

class CloudDbService {
  constructor() {
    this.isSyncing = false;
    this.syncDebounceTimers = {};
    this.initAutoSync();
  }

  initAutoSync() {
    // Sincronizar na inicialização
    if (typeof window !== 'undefined') {
      setTimeout(() => this.syncAll(), 800);

      // Sincronizar quando a janela/aba ganhar foco novamente
      window.addEventListener('focus', () => {
        this.syncAll();
      });

      // Sincronizar periodicamente a cada 30 segundos
      setInterval(() => {
        this.syncAll();
      }, 30000);
    }
  }

  /**
   * Puxa e mescla dados da nuvem para o localStorage local
   */
  async syncAll() {
    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      for (const key of SYNCED_KEYS) {
        await this.pullAndMerge(key);
      }
      
      // Notificar componentes que os dados da nuvem foram atualizados
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tf_order_updated'));
        window.dispatchEvent(new CustomEvent('tf_cloud_synced'));
      }
    } catch (err) {
      console.warn('[CloudDbService] Falha temporária ao sincronizar nuvem (modo offline ativo):', err);
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Puxa os dados de uma chave específica e faz o merge inteligente com o localStorage
   */
  async pullAndMerge(key) {
    try {
      const storageKey = key === 'users' ? 'tf_users' : `tf_${key}`;
      const localData = JSON.parse(localStorage.getItem(storageKey)) || [];

      const response = await fetch(`${CLOUD_SYNC_ENDPOINT}/${key}.json`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) return;

      const remoteData = await response.json();
      if (!remoteData) {
        // Se a nuvem estiver vazia e tivermos dados locais, enviamos para a nuvem
        if (Array.isArray(localData) && localData.length > 0) {
          await this.pushToCloudDirect(key, localData);
        }
        return;
      }

      let remoteList = [];
      if (Array.isArray(remoteData)) {
        remoteList = remoteData.filter(Boolean);
      } else if (typeof remoteData === 'object') {
        remoteList = Object.values(remoteData).filter(Boolean);
      }

      // Merge inteligente preservando dados mais recentes e evitando duplicatas por ID
      const mergedMap = new Map();

      // Inserir primeiro os dados remotos
      remoteList.forEach(item => {
        if (item && (item.id || item.email)) {
          const idKey = item.id || item.email;
          mergedMap.set(idKey, item);
        }
      });

      // Mesclar dados locais
      if (Array.isArray(localData)) {
        localData.forEach(localItem => {
          if (localItem && (localItem.id || localItem.email)) {
            const idKey = localItem.id || localItem.email;
            if (!mergedMap.has(idKey)) {
              mergedMap.set(idKey, localItem);
            } else {
              // Se existir em ambos, mesclar atualizações mais recentes (como mensagens ou status)
              const existing = mergedMap.get(idKey);
              const isLocalNewer = localItem.updatedAt || localItem.createdAt || 0;
              const isRemoteNewer = existing.updatedAt || existing.createdAt || 0;
              
              if (isLocalNewer >= isRemoteNewer) {
                mergedMap.set(idKey, { ...existing, ...localItem });
              }
            }
          }
        });
      }

      const mergedList = Array.from(mergedMap.values());
      localStorage.setItem(storageKey, JSON.stringify(mergedList));

      // Se houver novos itens locais que não estavam na nuvem, atualizar a nuvem
      if (mergedList.length > remoteList.length) {
        this.pushToCloud(key, mergedList);
      }
    } catch (err) {
      console.warn(`[CloudDbService] Erro ao sincronizar ${key}:`, err);
    }
  }

  /**
   * Envia uma coleção inteira para a nuvem com debounce
   */
  pushToCloud(key, data) {
    if (!SYNCED_KEYS.includes(key)) return;

    if (this.syncDebounceTimers[key]) {
      clearTimeout(this.syncDebounceTimers[key]);
    }

    this.syncDebounceTimers[key] = setTimeout(() => {
      this.pushToCloudDirect(key, data);
    }, 400);
  }

  /**
   * Executa a requisição PUT na nuvem
   */
  async pushToCloudDirect(key, data) {
    try {
      await fetch(`${CLOUD_SYNC_ENDPOINT}/${key}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.warn(`[CloudDbService] Falha ao enviar ${key} para nuvem:`, err);
    }
  }

  /**
   * Sincronização prioritária quando o usuário efetua login com email
   */
  async syncOnLogin(email) {
    if (!email) return;
    const cleanEmail = email.trim().toLowerCase();

    try {
      // Puxa orders e users imediatamente
      await this.pullAndMerge('orders');
      await this.pullAndMerge('quotes');
      await this.pullAndMerge('users');

      // Notificar componentes que os dados da nuvem foram atualizados
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('tf_order_updated'));
        window.dispatchEvent(new CustomEvent('tf_cloud_synced'));
      }
    } catch (err) {
      console.warn('[CloudDbService] Erro no syncOnLogin:', err);
    }
  }
}

export const cloudDbService = new CloudDbService();
