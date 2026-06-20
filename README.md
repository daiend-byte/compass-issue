# 先生一覧 (Facilitator List)

先生（facilitator）の一覧を表示する Web フロントエンド課題の実装です。

## 動作環境

- Node.js 20 以上
- パッケージマネージャ: pnpm（`npm` / `yarn` でも可）

## セットアップ・起動手順

```bash
# 1. 依存関係のインストール
pnpm install

# 2. 開発サーバ起動（http://localhost:5173 が開きます）
pnpm dev

# 3. 本番ビルド / プレビュー
pnpm build
pnpm preview

# その他
pnpm test          # テスト（Vitest）
pnpm lint          # 静的解析（Oxlint）
pnpm format        # フォーマット（Oxfmt）
```

> **API への CORS について**
> 対象 API は CORS ヘッダを返さないため、ブラウザから直接アクセスできません。
> 本アプリは同一オリジンの `/api` を呼び出し、Vite の dev/preview server が実 API
> （`https://frontend-assessment-...run.app`）へサーバ間で中継することで回避しています
> （設定は `vite.config.ts` の `server.proxy` / `preview.proxy`）。
> そのため `pnpm dev` または `pnpm preview` 上で動作させてください。

## 技術スタックと選定理由

| 領域           | 採用技術                          | 選定理由                                                                                                                       |
| -------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| ビルド / Dev   | Vite + React 19 + TypeScript      | 単一画面のため SSR は不要。高速な HMR と薄い設定で開発できる Vite の SPA 構成を採用。                                          |
| サーバ状態管理 | TanStack Query                    | キャッシュ・ローディング・エラー・リトライを宣言的に扱える。検索/ソート/ページの条件をクエリキーに含めることで再取得を自動化。 |
| 再描画最適化   | React Compiler                    | コンポーネント / フックを自動メモ化し、手動の `memo` / `useMemo` / `useCallback` を最小化しつつ再描画を抑制。                  |
| スタイル       | Tailwind CSS v4                   | デザイン値をユーティリティで直接表現。`@theme` でデザイントークンを定義。                                                      |
| UI 部品        | shadcn/ui 方式（Radix UI ＋ CVA） | アクセシブルなプリミティブを自前で所有・カスタムできる。Dialog はフォーカストラップ等を Radix に委譲。                         |
| 実行時検証     | Zod                               | API レスポンスをスキーマ検証し、型安全性を実行時にも担保。                                                                     |
| テスト         | Vitest + Testing Library + MSW    | ロジックの単体テストと、API をモックした画面の結合テストを実施。                                                               |
| Lint / Format  | Oxlint + Oxfmt                    | Rust 製で高速な静的解析・整形。                                                                                                |

## アーキテクチャ

### データ取得はサーバ駆動

検索・ソート・ページネーションをすべて API に委譲し、`totalCount` からページ数を算出します。
API が部分一致検索・ソート・ページングを備えているため、クライアントで同等のロジックを二重実装せず、
仕様を素直に満たせます。

### ディレクトリ構成

```
src/
  main.tsx                       # エントリ（QueryClientProvider 設置）
  App.tsx
  lib/                           # 横断的な部品
    http.ts                      # fetch ラッパ（ApiError へ正規化）
    queryClient.ts               # QueryClient 設定
    utils.ts                     # cn()（clsx + tailwind-merge）
  components/                    # 共通コンポーネント（ui のみサブディレクトリ）
    ui/                          # Button / Input / Dialog（shadcn 方式）
    Header.tsx / PageTitle.tsx
    CenteredLoader.tsx / ErrorDialog.tsx
  features/facilitators/         # 先生一覧の機能モジュール
    types.ts / constants.ts
    api/                         # schema.ts（Zod）/ facilitators.ts（取得）
    hooks/                       # useFacilitators / useFacilitatorListState / useDebouncedValue
    components/                  # 画面・テーブル・行・検索・ソートヘッダ・ページャ・空表示
  test/                          # setup / MSW ハンドラ / 描画ヘルパ
```

## テスト

```bash
pnpm test
```

- 単体: URL 組み立て（空検索の除外）、Zod パース失敗時の挙動、UI 状態（ソート切替・ページリセット）。
- 結合（MSW で API をモック）: 読み込み→一覧表示、ページ送り、部分一致検索、ソート、空表示、
  通信エラー→ダイアログ→リトライ復帰。
