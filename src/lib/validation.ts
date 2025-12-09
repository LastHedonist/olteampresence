import { z } from 'zod';

// Notes validation schema with length limits
export const notesSchema = z
  .string()
  .max(200, { message: 'Notas devem ter no máximo 200 caracteres' })
  .optional()
  .nullable()
  .transform((val) => {
    if (!val) return null;
    // Trim whitespace and sanitize
    return sanitizeText(val.trim());
  });

// Sanitize text to prevent XSS and remove potentially harmful content
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  return text
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script-like patterns
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    // Remove null bytes
    .replace(/\0/g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

// Validate notes input
export function validateNotes(notes: string | null | undefined): { 
  isValid: boolean; 
  sanitized: string | null; 
  error?: string;
} {
  try {
    const result = notesSchema.parse(notes);
    return { isValid: true, sanitized: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        isValid: false, 
        sanitized: null, 
        error: error.errors[0]?.message || 'Entrada inválida'
      };
    }
    return { isValid: false, sanitized: null, error: 'Erro de validação' };
  }
}
