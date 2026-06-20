import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { facilitatorsSearchSchema } from '@/router';
import { SEARCH_DEBOUNCE_MS } from '../constants';
import { useFacilitatorListState, type FacilitatorListState } from './useFacilitatorListState';

/**
 * RouterProvider 内でフックを呼び出し、その結果を ref 経由で取得するセットアップ。
 * TanStack Router のフック（useSearch / useNavigate）は RouterProvider が必須のため、
 * ルートコンポーネントとしてフックを実行する方式を採用している。
 */
async function createHookTestSetup(path = '/p/facilitators') {
  const resultRef = { current: null as FacilitatorListState | null };

  function HookCapture() {
    resultRef.current = useFacilitatorListState();
    return null;
  }

  const rootRoute = createRootRoute();
  const pRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/p',
  });
  const facilitatorsRoute = createRoute({
    getParentRoute: () => pRoute,
    path: '/facilitators',
    validateSearch: facilitatorsSearchSchema,
    component: HookCapture,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([pRoute.addChildren([facilitatorsRoute])]),
    history: createMemoryHistory({ initialEntries: [path] }),
  });

  await act(async () => {
    render(<RouterProvider router={router} />);
  });

  return resultRef;
}

describe('useFacilitatorListState', () => {
  it('初期状態は name 昇順・1 ページ目', async () => {
    const result = await createHookTestSetup();
    expect(result.current?.sort).toBe('name');
    expect(result.current?.order).toBe('asc');
    expect(result.current?.page).toBe(1);
  });

  it('URL にパラメータがある場合は復元する', async () => {
    const result = await createHookTestSetup(
      '/p/facilitators?sort=loginId&order=desc&page=3&search=tanaka',
    );
    expect(result.current?.sort).toBe('loginId');
    expect(result.current?.order).toBe('desc');
    expect(result.current?.page).toBe(3);
    expect(result.current?.searchInput).toBe('tanaka');
  });

  it('同じキーで toggleSort すると昇順⇄降順が切り替わる', async () => {
    const result = await createHookTestSetup();
    await act(async () => {
      result.current?.toggleSort('name');
    });
    expect(result.current?.order).toBe('desc');
    await act(async () => {
      result.current?.toggleSort('name');
    });
    expect(result.current?.order).toBe('asc');
  });

  it('別キーで toggleSort すると昇順で切り替わる', async () => {
    const result = await createHookTestSetup();
    await act(async () => {
      result.current?.toggleSort('name');
    }); // name desc
    await act(async () => {
      result.current?.toggleSort('loginId');
    });
    expect(result.current?.sort).toBe('loginId');
    expect(result.current?.order).toBe('asc');
  });

  it('ソート変更でページが 1 に同期的に戻る（余分なリクエストを防ぐ）', async () => {
    const result = await createHookTestSetup();
    await act(async () => {
      result.current?.setPage(3);
    });
    expect(result.current?.page).toBe(3);
    await act(async () => {
      result.current?.toggleSort('loginId');
    });
    expect(result.current?.page).toBe(1);
  });

  describe('検索入力 → ページリセット（デバウンス後）', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('デバウンス前はページが変わらない', async () => {
      const result = await createHookTestSetup();
      await act(async () => {
        result.current?.setPage(3);
      });
      await act(async () => {
        result.current?.setSearchInput('tanaka');
      });
      // デバウンス未経過のためページはまだ 3
      expect(result.current?.page).toBe(3);
      // API クエリの search もまだ空
      expect(result.current?.query.search).toBe('');
    });

    it('デバウンス後に検索語が確定するとページが 1 に戻る', async () => {
      const result = await createHookTestSetup();
      await act(async () => {
        result.current?.setPage(3);
      });
      await act(async () => {
        result.current?.setSearchInput('tanaka');
      });
      await act(async () => {
        vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
      });
      expect(result.current?.page).toBe(1);
      expect(result.current?.query.search).toBe('tanaka');
    });

    it('検索語が空白のみの場合は query.search が空になる（trim 済み）', async () => {
      const result = await createHookTestSetup();
      await act(async () => {
        result.current?.setSearchInput('   ');
      });
      await act(async () => {
        vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
      });
      expect(result.current?.query.search).toBe('');
    });
  });
});
