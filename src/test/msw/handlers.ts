import { http, HttpResponse } from 'msw';
import type { Facilitator } from '@/features/facilitators/types';

/** テスト用の固定データ（25 件 = 2 ページ）。 */
export const FACILITATORS: Facilitator[] = Array.from({ length: 25 }, (_, index) => {
  const n = index + 1;
  const pad = String(n).padStart(2, '0');
  return { id: n, name: `先生${pad}`, loginId: `facilitator_${pad}` };
});

const ENDPOINT = '*/api/facilitators';

/** 実 API と同じ挙動（search 部分一致 OR / sort / order / page / limit）を再現する。 */
export const handlers = [
  http.get(ENDPOINT, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const limit = Number(url.searchParams.get('limit') ?? '20');
    const sort = url.searchParams.get('sort') === 'loginId' ? 'loginId' : 'name';
    const order = url.searchParams.get('order') === 'desc' ? 'desc' : 'asc';
    const search = (url.searchParams.get('search') ?? '').toLowerCase();

    let rows = FACILITATORS.filter(
      (row) =>
        search === '' ||
        row.name.toLowerCase().includes(search) ||
        row.loginId.toLowerCase().includes(search),
    );

    rows = [...rows].sort((a, b) => {
      const compared = a[sort].localeCompare(b[sort], 'ja');
      return order === 'asc' ? compared : -compared;
    });

    const totalCount = rows.length;
    const startIndex = (page - 1) * limit;
    const data = rows.slice(startIndex, startIndex + limit);

    return HttpResponse.json({ data, totalCount });
  }),
];

/** 通信エラーを再現するハンドラ。 */
export const errorHandler = http.get(ENDPOINT, () =>
  HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 }),
);
