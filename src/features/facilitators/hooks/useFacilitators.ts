import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchFacilitators } from '../api/facilitators';
import type { FacilitatorQuery } from '../types';

/**
 * 先生一覧のサーバ状態フック。
 * クエリ条件をキーに含めるため、検索/ソート/ページ変更で自動的に再取得される。
 * `keepPreviousData` により、再取得中も前回データを保持してちらつきを防ぐ。
 */
export function useFacilitators(query: FacilitatorQuery) {
  return useQuery({
    queryKey: ['facilitators', query],
    queryFn: ({ signal }) => fetchFacilitators(query, signal),
    placeholderData: keepPreviousData,
  });
}
