// composables/useWhatsAppState.js
// Estado reativo para WhatsApp com localStorage seguindo Clean Code

import { ref, computed } from 'vue';
import { useLocalStorage } from './useLocalStorage.js';

/**
 * Hook para gerenciar estado do WhatsApp
 * @returns {Object} - Estado e funções do WhatsApp
 */
export const useWhatsAppState = () => {
  // Estado persistido no localStorage
  const { value: lastPhone, setValue: setLastPhone } = useLocalStorage('inkpage_last_phone', '');
  const { value: lastMessage, setValue: setLastMessage } = useLocalStorage('inkpage_last_message', '');
  const { value: generatedLinks, setValue: setGeneratedLinks } = useLocalStorage('inkpage_generated_links', []);

  // Estado reativo local
  const currentPhone = ref(lastPhone.value || '');
  const currentMessage = ref(lastMessage.value || '');
  const currentLink = ref('');
  const errors = ref({ phone: '' });

  // Computados
  const hasHistory = computed(() => generatedLinks.value.length > 0);
  
  const recentLinks = computed(() => 
    generatedLinks.value.slice(-5).reverse() // Últimos 5 links
  );

  // Métodos pequenos (< 20 linhas cada)
  const saveToHistory = (link, phone, message) => {
    const newLink = {
      id: Date.now(),
      url: link,
      phone: phone,
      message: message,
      createdAt: new Date().toISOString(),
      type: 'whatsapp'
    };

    const updatedLinks = [...generatedLinks.value, newLink];
    setGeneratedLinks(updatedLinks);
  };

  const clearHistory = () => {
    setGeneratedLinks([]);
  };

  const loadLastUsed = () => {
    currentPhone.value = lastPhone.value || '';
    currentMessage.value = lastMessage.value || '';
  };

  const updateLastUsed = (phone, message) => {
    setLastPhone(phone);
    setLastMessage(message);
  };

  const removeFromHistory = (linkId) => {
    const updatedLinks = generatedLinks.value.filter(link => link.id !== linkId);
    setGeneratedLinks(updatedLinks);
  };

  return {
    // Estado
    currentPhone,
    currentMessage,
    currentLink,
    errors,
    lastPhone,
    lastMessage,
    generatedLinks,
    
    // Computados
    hasHistory,
    recentLinks,
    
    // Métodos
    saveToHistory,
    clearHistory,
    loadLastUsed,
    updateLastUsed,
    removeFromHistory
  };
};
