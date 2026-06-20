import { z } from 'zod';

export const facilitatorsSearchSchema = z.object({
  search: z.string().optional(),
  sort: z.enum(['name', 'loginId']).optional().catch(undefined),
  order: z.enum(['asc', 'desc']).optional().catch(undefined),
  page: z.coerce.number().int().positive().optional().catch(undefined),
});
