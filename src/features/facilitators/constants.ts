import type { SortKey, SortOrder } from './types';

/** 1 ページあたりの表示件数（仕様: 20 件）。 */
export const PER_PAGE = 20;

export const DEFAULT_SORT: SortKey = 'name';
export const DEFAULT_ORDER: SortOrder = 'asc';

/** 検索入力のデバウンス時間（ms）。 */
export const SEARCH_DEBOUNCE_MS = 300;
