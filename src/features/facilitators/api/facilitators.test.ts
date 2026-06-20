import { describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/msw/server';
import { ApiError } from '@/lib/http';
import { buildFacilitatorsUrl, fetchFacilitators } from './facilitators';
import type { FacilitatorQuery } from '../types';

const baseQuery: FacilitatorQuery = {
  page: 1,
  limit: 20,
  sort: 'name',
  order: 'asc',
  search: '',
};

describe('buildFacilitatorsUrl', () => {
  it('page/limit/sort/order を必ず含める', () => {
    const url = buildFacilitatorsUrl(baseQuery);
    expect(url).toContain('page=1');
    expect(url).toContain('limit=20');
    expect(url).toContain('sort=name');
    expect(url).toContain('order=asc');
  });

  it('検索語が空のときは search を付与しない', () => {
    expect(buildFacilitatorsUrl(baseQuery)).not.toContain('search=');
  });

  it('検索語があるときは search を付与する', () => {
    const url = buildFacilitatorsUrl({ ...baseQuery, search: 'tanaka' });
    expect(url).toContain('search=tanaka');
  });
});

describe('fetchFacilitators', () => {
  it('正常レスポンスをパースして返す', async () => {
    const result = await fetchFacilitators(baseQuery);
    expect(result.totalCount).toBe(25);
    expect(result.data).toHaveLength(20);
  });

  it('レスポンス形が不正なら ApiError を投げる', async () => {
    server.use(http.get('*/api/facilitators', () => HttpResponse.json({ foo: 'bar' })));
    await expect(fetchFacilitators(baseQuery)).rejects.toBeInstanceOf(ApiError);
  });

  it('HTTP エラー時は ApiError を投げる', async () => {
    server.use(
      http.get('*/api/facilitators', () => HttpResponse.json({ error: 'boom' }, { status: 500 })),
    );
    await expect(fetchFacilitators(baseQuery)).rejects.toBeInstanceOf(ApiError);
  });
});
