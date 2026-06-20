import { useEffect, useRef } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { PER_PAGE, SEARCH_DEBOUNCE_MS } from '../constants';
import type { FacilitatorQuery, SortKey, SortOrder } from '../types';
import { useDebouncedValue } from './useDebouncedValue';

export interface FacilitatorListState {
  /** API へ渡すクエリ条件。 */
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
    sort = 'name',
    order = 'asc',
    page = 1,
  } = useSearch({ from: '/p/facilitators' });
  const navigate = useNavigate({ from: '/p/facilitators' });

  // API 呼び出しをデバウンス。trim して空白のみの検索語を除外。
  const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DEBOUNCE_MS);

  // 検索語デバウンス後にページを 1 にリセット。
  // prev ref で実際の値変化のみ検出し、マウント時（URL からの初期復元）はスキップする。
  const prevDebouncedSearch = useRef(debouncedSearch);
  useEffect(() => {
    if (prevDebouncedSearch.current === debouncedSearch) return;
    prevDebouncedSearch.current = debouncedSearch;
    navigate({ search: (prev) => ({ ...prev, page: 1 }), replace: true });
  }, [debouncedSearch, navigate]);

  const setSearchInput = (value: string) => {
    navigate({ search: (prev) => ({ ...prev, search: value }), replace: true });
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
      replace: true,
    });
  };

  const setPage = (newPage: number) => {
    navigate({ search: (prev) => ({ ...prev, page: newPage }), replace: true });
  };

  const query: FacilitatorQuery = {
    page,
    limit: PER_PAGE,
    sort,
    order,
    search: debouncedSearch,
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
