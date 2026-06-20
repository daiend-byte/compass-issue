import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

export const router = createRouter({ routeTree });

export { facilitatorsSearchSchema } from '@/features/facilitators/searchSchema';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
