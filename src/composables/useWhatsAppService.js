// composables/useWhatsAppService.js
// Composable que usa serviços SOLID para WhatsApp

import { ref, computed, onMounted } from 'vue';
import { WhatsAppService } from '../services/WhatsAppService.js';
import { WhatsAppLinkGenerator } from '../services/WhatsAppLinkGenerator.js';
import { LocalStorageService } from '../services/LocalStorageService.js';
import { PhoneValidator } from '../validators/PhoneValidator.js';

/**
 * Hook reativo que encapsula serviços SOLID para WhatsApp
 * Single Responsibility: Apenas gerencia estado reativo do WhatsApp
 */
export const useWhatsAppService = () => {
  // Injeção de dependências (Dependency Inversion)
  const linkGenerator = new WhatsAppLinkGenerator();
  const storage = new LocalStorageService();
  const whatsappService = new WhatsAppService(linkGenerator, storage);
  const phoneValidator = new PhoneValidator();
  
  // Estado reativo
  const phone = ref('');
  const message = ref('');
  const generatedLink = ref('');
  const errors = ref({ phone: '', general: '' });
  const recentLinks = ref([]);
  const isLoading = ref(false);
  const copyButtonText = ref('Copiar Link');
  
  // Computados
  const isValidForm = computed(() => {
    return phone.value && !errors.value.phone && !isLoading.value;
  });
  
  const hasHistory = computed(() => {
    return recentLinks.value.length > 0;
  });
  
  // Métodos pequenos (< 20 linhas cada)
  const formatPhone = (event) => {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    
    phone.value = linkGenerator.formatPhone(value);
  };
  
  const validatePhone = () => {
    if (!phone.value) {
      errors.value.phone = '';
      return;
    }
    
    if (!phoneValidator.validate(phone.value)) {
      errors.value.phone = phoneValidator.getErrorMessage();
    } else {
      errors.value.phone = '';
    }
  };
  
  const generateLink = async () => {
    if (!isValidForm.value) return;
    
    isLoading.value = true;
    errors.value.general = '';
    
    try {
      const result = await whatsappService.generateAndSave({
        phone: phone.value,
        message: message.value
      });
      
      generatedLink.value = result.link;
      await loadRecentLinks();
      
    } catch (error) {
      errors.value.general = error.message;
      console.error('Error generating link:', error);
    } finally {
      isLoading.value = false;
    }
  };
  
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink.value);
      copyButtonText.value = 'Copiado! ✓';
      setTimeout(() => {
        copyButtonText.value = 'Copiar Link';
      }, 2000);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };
  
  const copyHistoryLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch (error) {
      console.error('Error copying history link:', error);
    }
  };
  
  const loadRecentLinks = async () => {
    try {
      recentLinks.value = await whatsappService.getRecentLinks(5);
    } catch (error) {
      console.error('Error loading recent links:', error);
      recentLinks.value = [];
    }
  };
  
  const loadLastUsed = async () => {
    try {
      const lastUsed = await whatsappService.getLastUsed();
      phone.value = lastUsed.phone || '';
      message.value = lastUsed.message || '';
    } catch (error) {
      console.error('Error loading last used:', error);
    }
  };
  
  const clearHistory = async () => {
    try {
      await whatsappService.clearHistory();
      await loadRecentLinks();
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };
  
  // Carregar dados ao montar
  onMounted(async () => {
    await Promise.all([
      loadRecentLinks(),
      loadLastUsed()
    ]);
  });
  
  return {
    // Estado
    phone,
    message,
    generatedLink,
    errors,
    recentLinks,
    isLoading,
    copyButtonText,
    
    // Computados
    isValidForm,
    hasHistory,
    
    // Métodos
    formatPhone,
    validatePhone,
    generateLink,
    copyLink,
    copyHistoryLink,
    loadRecentLinks,
    clearHistory
  };
};
