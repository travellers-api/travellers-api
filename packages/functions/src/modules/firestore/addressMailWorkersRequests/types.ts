import { z } from 'zod';

export const addressMailWorkersRequestZod = z.object({
  from: z.string(),
  to: z.string(),
  raw: z.string(),
});

export type AddressMailWorkersRequest = z.infer<typeof addressMailWorkersRequestZod>;
