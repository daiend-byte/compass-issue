import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router';
import { act, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routeTree } from '@/routeTree.gen';
import { server } from '@/test/msw/server';
import { errorHandler } from '@/test/msw/handlers';

async function renderPage(path = '/p/facilitators') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: Infinity } },
  });
  const history = createMemoryHistory({ initialEntries: [path] });
  const router = createRouter({ routeTree, history });
  await act(async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    );
  });
}

describe('FacilitatorListPage', () => {
  it('読み込み後に一覧と総件数を表示する', async () => {
    await renderPage();

    expect(await screen.findByText('先生01')).toBeInTheDocument();
    expect(screen.getByText('facilitator_01')).toBeInTheDocument();
    expect(screen.getByText('25件中 1〜20件を表示')).toBeInTheDocument();
  });

  it('次のページに切り替えると 2 ページ目を表示する', async () => {
    const user = userEvent.setup();
    await renderPage();
    await screen.findByText('先生01');

    await user.click(screen.getByRole('button', { name: '次のページ' }));

    expect(await screen.findByText('先生21')).toBeInTheDocument();
    expect(screen.queryByText('先生01')).not.toBeInTheDocument();
    expect(screen.getByText('25件中 21〜25件を表示')).toBeInTheDocument();
  });

  it('検索で部分一致の絞り込みができる', async () => {
    const user = userEvent.setup();
    await renderPage();
    await screen.findByText('先生01');

    await user.type(
      screen.getByRole('searchbox', { name: '名前、ログインIDで検索' }),
      'facilitator_2',
    );
    await user.keyboard('{Enter}');

    // facilitator_20〜25 の 6 件にしぼられる
    expect(await screen.findByText('先生20')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText('先生01')).not.toBeInTheDocument());
    expect(screen.getByText('6件中 1〜6件を表示')).toBeInTheDocument();
  });

  it('名前ヘッダのクリックで降順に並び替えできる', async () => {
    const user = userEvent.setup();
    await renderPage();
    await screen.findByText('先生01');

    await user.click(screen.getByRole('button', { name: /名前で並び替え/ }));

    // 降順 1 ページ目の先頭は 先生25
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(within(rows[1]).getByText('先生25')).toBeInTheDocument();
    });
  });

  it('該当データが無いときは空メッセージを表示する', async () => {
    const user = userEvent.setup();
    await renderPage();
    await screen.findByText('先生01');

    await user.type(
      screen.getByRole('searchbox', { name: '名前、ログインIDで検索' }),
      'zzzznomatch',
    );
    await user.keyboard('{Enter}');

    expect(await screen.findByText('該当するデータがありません。')).toBeInTheDocument();
  });

  it('通信エラー時にダイアログを表示し、リトライで復帰する', async () => {
    const user = userEvent.setup();
    server.use(errorHandler);

    await renderPage();

    expect(await screen.findByText('通信エラーが発生しました。')).toBeInTheDocument();

    // 成功ハンドラに戻してリトライ
    server.resetHandlers();
    await user.click(screen.getByRole('button', { name: 'リトライ' }));

    expect(await screen.findByText('先生01')).toBeInTheDocument();
    expect(screen.queryByText('通信エラーが発生しました。')).not.toBeInTheDocument();
  });
});
