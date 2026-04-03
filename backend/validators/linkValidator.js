// backend/validators/linkValidator.js
// Validador de links seguindo Clean Code (< 80 linhas)

import { ValidationError, ConflictError } from '../middleware/errorHandler.js';
import { storageService } from '../services/JsonStorageService.js';

/**
 * Valida uma URL
 */
export const validateUrl = (url) => {
  if (!url || typeof url !== 'string') {
    throw new ValidationError('URL is required');
  }

  const trimmedUrl = url.trim();
  
  if (trimmedUrl.length === 0) {
    throw new ValidationError('URL cannot be empty');
  }

  if (trimmedUrl.length > 2048) {
    throw new ValidationError('URL is too long (max 2048 characters)');
  }

  const urlPattern = /^https?:\/\/.+/i;
  if (!urlPattern.test(trimmedUrl)) {
    throw new ValidationError('URL must start with http:// or https://');
  }

  try {
    new URL(trimmedUrl);
  } catch {
    throw new ValidationError('Invalid URL format');
  }

  return trimmedUrl;
};

/**
 * Valida um slug
 */
export const validateSlug = (slug) => {
  if (!slug || typeof slug !== 'string') {
    throw new ValidationError('Slug is required');
  }

  const trimmedSlug = slug.trim().toLowerCase();
  
  if (trimmedSlug.length === 0) {
    throw new ValidationError('Slug cannot be empty');
  }

  if (trimmedSlug.length < 3) {
    throw new ValidationError('Slug must be at least 3 characters long');
  }

  if (trimmedSlug.length > 50) {
    throw new ValidationError('Slug must be at most 50 characters long');
  }

  const slugPattern = /^[a-z0-9_-]+$/;
  if (!slugPattern.test(trimmedSlug)) {
    throw new ValidationError('Slug can only contain lowercase letters, numbers, hyphens, and underscores');
  }

  // Verificar slugs reservados
  const reservedSlugs = ['admin', 'api', 'health', 'test', 'www', 'mail', 'ftp'];
  if (reservedSlugs.includes(trimmedSlug)) {
    throw new ValidationError(`Slug "${trimmedSlug}" is reserved`);
  }

  return trimmedSlug;
};

/**
 * Verifica se um slug já existe
 */
export const checkSlugExists = async (slug) => {
  const existing = await storageService.findOne(
    'links.json',
    link => link.slug === slug
  );
  
  if (existing) {
    throw new ConflictError(`Slug "${slug}" is already in use`);
  }
};

/**
 * Gera um slug aleatório
 */
export const generateRandomSlug = async () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const length = 8;
  
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    let slug = '';
    for (let i = 0; i < length; i++) {
      slug += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    const existing = await storageService.findOne(
      'links.json',
      link => link.slug === slug
    );
    
    if (!existing) {
      return slug;
    }
    
    attempts++;
  }
  
  // Fallback: usar timestamp
  return `link-${Date.now().toString(36)}`;
};

/**
 * Valida dados completos de criação de link
 */
export const validateLinkCreation = async (data) => {
  const errors = [];
  
  try {
    var url = validateUrl(data.url);
  } catch (error) {
    errors.push(error.message);
  }
  
  let slug;
  if (data.slug) {
    try {
      slug = validateSlug(data.slug);
      await checkSlugExists(slug);
    } catch (error) {
      errors.push(error.message);
    }
  } else {
    slug = await generateRandomSlug();
  }
  
  if (errors.length > 0) {
    throw new ValidationError('Validation failed', errors);
  }
  
  return { url, slug };
};
