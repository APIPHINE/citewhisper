
import { z } from 'zod';

// Enhanced validation schemas with security in mind
export const quoteValidationSchema = z.object({
  quote_text: z.string()
    .min(10, 'Quote must be at least 10 characters')
    .max(5000, 'Quote must not exceed 5000 characters')
    .refine(text => !/<script|javascript:|data:|vbscript:/i.test(text), 
      'Quote contains potentially unsafe content'),
  author_name: z.string()
    .min(1, 'Author name is required')
    .max(200, 'Author name must not exceed 200 characters')
    .refine(name => !/[<>]/.test(name), 'Author name contains invalid characters'),
  date_original: z.string().optional(),
  quote_context: z.string()
    .max(2000, 'Context must not exceed 2000 characters')
    .optional()
    .refine(context => !context || !/<script|javascript:|data:|vbscript:/i.test(context), 
      'Context contains potentially unsafe content'),
  source_title: z.string().max(500, 'Source title too long').optional(),
  source_url: z.string()
    .url('Invalid URL format')
    .refine(url => {
      try {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
      } catch {
        return false;
      }
    }, 'Only HTTP and HTTPS URLs are allowed')
    .optional()
});

export const userProfileValidationSchema = z.object({
  full_name: z.string()
    .min(1, 'Full name is required')
    .max(100, 'Full name must not exceed 100 characters')
    .refine(name => !/[<>"]/.test(name), 'Name contains invalid characters'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must not exceed 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens, and underscores')
    .optional()
});

// Sanitization functions
export const sanitizeText = (text: string): string => {
  return text
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript protocol
    .replace(/data:/gi, '') // Remove data protocol
    .trim();
};

export const sanitizeUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    // Only allow HTTP and HTTPS protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Invalid protocol');
    }
    return parsed.toString();
  } catch {
    return '';
  }
};

// Rate limiting helper
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  
  constructor(private maxAttempts: number, private windowMs: number) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(identifier);
    
    if (!record || now > record.resetTime) {
      this.attempts.set(identifier, { count: 1, resetTime: now + this.windowMs });
      return true;
    }
    
    if (record.count >= this.maxAttempts) {
      return false;
    }
    
    record.count++;
    return true;
  }
  
  getRemainingTime(identifier: string): number {
    const record = this.attempts.get(identifier);
    if (!record) return 0;
    return Math.max(0, record.resetTime - Date.now());
  }
}

// Global rate limiters
export const quoteSubmissionLimiter = new RateLimiter(5, 60000); // 5 submissions per minute
export const adminActionLimiter = new RateLimiter(10, 60000); // 10 admin actions per minute
