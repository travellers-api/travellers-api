import { z } from 'zod';

export const addressMailZod = z.object({
  from: z.string(),
  to: z.string(),
  raw: z.string(),
});

export type AddressMail = z.infer<typeof addressMailZod>;
