import { ApiError, getJson } from '@/lib/http';
import type { FacilitatorQuery, FacilitatorsResult } from '../types';
import { facilitatorsResponseSchema } from './schema';

const ENDPOINT = '/api/facilitators';

/** クエリ条件から API の URL を組み立てる。空の検索語は付与しない。 */
export function buildFacilitatorsUrl(query: FacilitatorQuery): string {
  const params = new URLSearchParams({
    page: String(query.page),
    limit: String(query.limit),
    sort: query.sort,
    order: query.order,
  });

  const search = query.search.trim();
  if (search) {
    params.set('search', search);
  }

  return `${ENDPOINT}?${params.toString()}`;
}

/** 先生一覧を取得し、Zod でレスポンス形を検証して返す。 */
export async function fetchFacilitators(
  query: FacilitatorQuery,
  signal?: AbortSignal,
): Promise<FacilitatorsResult> {
  const raw = await getJson(buildFacilitatorsUrl(query), signal);
  const parsed = facilitatorsResponseSchema.safeParse(raw);
  if (!parsed.success) {
    throw new ApiError('レスポンスの形式が不正です');
  }
  return parsed.data;
}
