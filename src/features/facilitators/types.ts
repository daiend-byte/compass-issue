export type { Facilitator, FacilitatorsResponse as FacilitatorsResult } from './api/schema';

export type SortKey = 'name' | 'loginId';
export type SortOrder = 'asc' | 'desc';

/** API へ送るクエリパラメータ。 */
export interface FacilitatorQuery {
  page: number;
  limit: number;
  sort: SortKey;
  order: SortOrder;
  search: string;
}
