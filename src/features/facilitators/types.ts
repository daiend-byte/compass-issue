export type { Facilitator, FacilitatorsResponse as FacilitatorsResult } from './api/schema';

export type SortKey = 'name' | 'loginId';
export type SortOrder = 'asc' | 'desc';

/** API へ送るクエリ条件。 */
export interface FacilitatorQuery {
  page: number;
  limit: number;
  sort: SortKey;
  order: SortOrder;
  search: string;
}
