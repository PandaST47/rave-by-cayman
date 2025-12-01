// lib/validation.ts

import { z } from 'zod';

export const registerSchema = z.object({
  login: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  login: z.string(),
  password: z.string(),
});

export const createTicketSchema = z.object({
  subject: z.string().min(5).max(200),
  category: z.string(),
  message: z.string().min(10),
});

export const bookingSchema = z.object({
  zoneId: z.string(),
  hours: z.number().min(1).max(24),
  startTime: z.string().datetime(),
});