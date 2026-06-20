import { createFileRoute } from '@tanstack/react-router';
import { FacilitatorListPage } from '@/features/facilitators/components/FacilitatorListPage';
import { facilitatorsSearchSchema } from '@/features/facilitators/searchSchema';

export const Route = createFileRoute('/p/facilitators')({
  validateSearch: facilitatorsSearchSchema,
  component: FacilitatorListPage,
});
