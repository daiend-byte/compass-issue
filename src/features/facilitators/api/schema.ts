import { z } from 'zod';

export const facilitatorSchema = z.object({
  id: z.number(),
  name: z.string(),
  loginId: z.string(),
});

export const facilitatorsResponseSchema = z.object({
  data: z.array(facilitatorSchema),
  totalCount: z.number(),
});

export type Facilitator = z.infer<typeof facilitatorSchema>;
export type FacilitatorsResponse = z.infer<typeof facilitatorsResponseSchema>;
