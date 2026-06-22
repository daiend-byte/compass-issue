import { useNavigate, useSearch } from '@tanstack/react-router';
import { DEFAULT_ORDER, DEFAULT_SORT, PER_PAGE } from '../constants';
import type { FacilitatorQuery, SortKey, SortOrder } from '../types';

export interface FacilitatorListState {
  /** API へ渡すクエリパラメータ。 */
  query: FacilitatorQuery;
  searchInput: string;
  setSearchInput: (value: string) => void;
  sort: SortKey;
  order: SortOrder;
  toggleSort: (key: SortKey) => void;
  page: number;
  setPage: (page: number) => void;
}

/**
 * 一覧画面の UI 状態（検索語・ソート・ページ）を URL search params と同期して管理するフック。
 * サーバ状態（取得結果）とは責務を分離している。
 */
export function useFacilitatorListState(): FacilitatorListState {
  const {
    search = '',
    sort = DEFAULT_SORT,
    order = DEFAULT_ORDER,
    page = 1,
  } = useSearch({ from: '/p/facilitators' });
  const navigate = useNavigate({ from: '/p/facilitators' });

  // Enter 確定時に search と page=1 を同時にコミットする。trim は URL 書き込み時にのみ行う。
  const setSearchInput = (value: string) => {
    const trimmed = value.trim();
    navigate({ search: (prev) => ({ ...prev, search: trimmed || undefined, page: 1 }) });
  };

  const toggleSort = (key: SortKey) => {
    // sort/order の変化と同じ navigate でページをリセットし、余分なリクエストを防ぐ。
    navigate({
      search: (prev) => ({
        ...prev,
        sort: key,
        order: key === sort ? (order === 'asc' ? 'desc' : 'asc') : 'asc',
        page: 1,
      }),
    });
  };

  const setPage = (newPage: number) => {
    navigate({ search: (prev) => ({ ...prev, page: newPage }) });
  };

  const query: FacilitatorQuery = {
    page,
    limit: PER_PAGE,
    sort,
    order,
    search: search,
  };

  return {
    query,
    searchInput: search,
    setSearchInput,
    sort,
    order,
    toggleSort,
    page,
    setPage,
  };
}
