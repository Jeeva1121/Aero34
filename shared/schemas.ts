import { z } from 'zod';

export const RouteSchema = z.object({
  id: z.string(),
  slug: z.string(),
  originCity: z.string(),
  originCode: z.string().length(3),
  destCity: z.string(),
  destCode: z.string().length(3),
  region: z.enum(['Transatlantic', 'Transpacific', 'Eurasia', 'Alpine-Gulf']),
  blockTime: z.string(),
  blockMinutes: z.number().int().positive(),
  distanceKm: z.number().int().positive(),
  aircraft: z.string(),
  cabinLayout: z.string(),
  totalSeats: z.number().int().positive(),
  seatsLeftThisMonth: z.number().int().nonnegative(),
  coordinates: z.object({
    origin: z.tuple([z.number(), z.number()]),
    dest: z.tuple([z.number(), z.number()]),
  }),
  heroImage: z.string(),
  overview: z.string(),
  altitudeFeet: z.number().int(),
});

export type Route = z.infer<typeof RouteSchema>;

export const AvailabilityDaySchema = z.object({
  date: z.string(), // YYYY-MM-DD
  seatsLeft: z.number().int().nonnegative(),
  status: z.enum(['available', 'limited', 'full']),
});

export const AvailabilityResponseSchema = z.object({
  routeId: z.string(),
  month: z.string(), // YYYY-MM
  days: z.array(AvailabilityDaySchema),
});

export type AvailabilityResponse = z.infer<typeof AvailabilityResponseSchema>;

export const CreateRequestSchema = z.object({
  routeId: z.string().min(1, 'Route selection is required'),
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80, 'Name must be under 80 characters'),
  email: z.string().trim().email('Valid contact email is required').max(100),
  dates: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Valid departure date (YYYY-MM-DD) is required'),
  partySize: z.coerce.number().int().min(1, 'Party size must be at least 1').max(12, 'Maximum charter party is 12'),
  note: z.string().trim().max(400, 'Notes must be under 400 characters').optional().default(''),
  idempotencyKey: z.string().min(10, 'Idempotency key missing'),
  honeypot: z.string().max(0, 'Bot submission rejected').optional(),
});

export type CreateRequestInput = z.infer<typeof CreateRequestSchema>;

export const RequestStatusEnum = z.enum(['Received', 'Confirming', 'Held', 'Declined']);
export type RequestStatus = z.infer<typeof RequestStatusEnum>;

export const RequestRecordSchema = z.object({
  ref: z.string(),
  routeId: z.string(),
  routeTitle: z.string(),
  name: z.string(),
  email: z.string(),
  dates: z.string(),
  partySize: z.number(),
  note: z.string(),
  status: RequestStatusEnum,
  createdAt: z.string(),
});

export type RequestRecord = z.infer<typeof RequestRecordSchema>;

export const UpdateStatusSchema = z.object({
  status: RequestStatusEnum,
  note: z.string().max(200).optional(),
});

export type UpdateStatusInput = z.infer<typeof UpdateStatusSchema>;

export const AdminLoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export type AdminLoginInput = z.infer<typeof AdminLoginSchema>;

export const ShortlistToggleSchema = z.object({
  routeId: z.string().min(1),
});

export type ShortlistToggleInput = z.infer<typeof ShortlistToggleSchema>;
