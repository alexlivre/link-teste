// utils/whatsapp.js
// Utilitários para WhatsApp seguindo Clean Code (< 20 linhas por função)

/**
 * Limpa número de telefone removendo caracteres não numéricos
 * @param {string} rawPhone - Telefone bruto
 * @returns {string} Telefone limpo
 */
export const cleanPhoneNumber = (rawPhone) => {
  if (!rawPhone) return '';
  
  return rawPhone
    .replace(/\D/g, '')
    .replace(/^55/, '')
    .slice(0, 11);
};

/**
 * Valida telefone brasileiro (celular ou fixo)
 * @param {string} phone - Telefone para validar
 * @returns {boolean} Válido ou inválido
 */
export const validateBrazilianPhone = (phone) => {
  const cleanPhone = cleanPhoneNumber(phone);
  
  // Celular: XX XXXXX-XXXX (11 dígitos)
  // Fixo: XX XXXX-XXXX (10 dígitos)
  const cellphonePattern = /^[1-9]{2}[9][0-9]{8}$/;
  const landlinePattern = /^[1-9]{2}[0-9]{8}$/;
  
  return cellphonePattern.test(cleanPhone) || landlinePattern.test(cleanPhone);
};

/**
 * Codifica mensagem para URL do WhatsApp
 * @param {string} message - Mensagem para codificar
 * @returns {string} Mensagem codificada
 */
export const encodeWhatsAppMessage = (message) => {
  if (!message) return '';
  
  return encodeURIComponent(message);
};

/**
 * Gera link completo do WhatsApp
 * @param {string} phone - Telefone
 * @param {string} message - Mensagem (opcional)
 * @returns {string} Link wa.me
 */
export const generateWhatsAppLink = (phone, message = '') => {
  const cleanPhone = cleanPhoneNumber(phone);
  
  if (!validateBrazilianPhone(phone)) {
    throw new Error('Telefone brasileiro inválido');
  }
  
  const encodedMessage = encodeWhatsAppMessage(message);
  const fullPhone = `55${cleanPhone}`;
  
  return `https://wa.me/${fullPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
};
