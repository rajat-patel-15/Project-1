import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid academic email address'),
  password: z.string().min(4, 'Password must be at least 4 characters long'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid college email'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  department: z.string().min(2, 'Please specify your academic department'),
  studentId: z.string().min(3, 'Please provide your Student ID / Roll Number'),
  role: z.enum(['STUDENT', 'ADMIN']).default('STUDENT'),
});

export const recyclingLogSchema = z.object({
  wasteType: z.enum(['PLASTIC', 'PAPER', 'GLASS', 'METAL', 'E_WASTE', 'OTHER'], {
    errorMap: () => ({ message: 'Please select a valid waste category' }),
  }),
  quantityBracket: z.enum(['<100g', '100-500g', '500g-1kg', '1-5kg', '>5kg'], {
    errorMap: () => ({ message: 'Please select a quantity bracket' }),
  }),
  location: z.string().min(2, 'Location description must be at least 2 characters long'),
  binStationId: z.string().nullable().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD').optional(),
  notes: z.string().max(300, 'Notes cannot exceed 300 characters').optional(),
});

export const challengeCreateSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  rewardPoints: z.number().int().min(10, 'Reward points must be at least 10').max(1000, 'Reward points maximum is 1000'),
  deadline: z.string().min(10, 'Please set a valid deadline date'),
  category: z.enum(['PLASTIC', 'PAPER', 'GLASS', 'METAL', 'E_WASTE', 'OTHER', 'GENERAL']).default('GENERAL'),
});

export const qrVerificationSchema = z.object({
  qrCode: z.string().min(3, 'QR code or Station ID is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RecyclingLogInput = z.infer<typeof recyclingLogSchema>;
export type ChallengeCreateInput = z.infer<typeof challengeCreateSchema>;
export type QRVerificationInput = z.infer<typeof qrVerificationSchema>;
