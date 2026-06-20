# 職能課題

## 動作環境

- Node.js 20 以上
- パッケージマネージャ: pnpm

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

### ディレクトリ構成

```
src/
  main.tsx                       # エントリ（QueryClientProvider + RouterProvider）
  router.ts                      # TanStack Router インスタンス
  routeTree.gen.ts               # ルートツリー（自動生成）
  routes/
    __root.tsx                   # ルートレイアウト
    index.tsx                    # / → /p/facilitators へリダイレクト
    p/
      facilitators.tsx           # /p/facilitators ルート（URL 検索パラメータ検証）
  lib/                           # 横断的な部品
    http.ts                      # fetch ラッパ（ApiError へ正規化）
    queryClient.ts               # QueryClient 設定
    utils.ts                     # cn()（clsx + tailwind-merge）
  components/                    # 共通コンポーネント（ui のみサブディレクトリ）
    ui/                          # Button / Input / Dialog（shadcn 方式）
    Header.tsx / PageTitle.tsx
    CenteredLoader.tsx / ErrorDialog.tsx
  features/facilitators/         # 先生一覧の機能モジュール
    types.ts / constants.ts / searchSchema.ts
    api/                         # schema.ts（Zod）/ facilitators.ts（取得）
    hooks/                       # useFacilitators / useFacilitatorListState / useDebouncedValue
    components/                  # 画面・テーブル・行・検索・ソートヘッダ・ページャ・空表示
  test/                          # setup / MSW ハンドラ / 描画ヘルパ
```

## アーキテクチャ

### 技術スタック

| 役割 | ライブラリ |
|------|-----------|
| UI フレームワーク | React 19 |
| ビルドツール | Vite |
| ルーティング | TanStack Router（ファイルベース） |
| サーバ状態管理 | TanStack Query |
| スキーマ検証 | Zod |
| スタイリング | Tailwind CSS + shadcn/ui |
| テスト | Vitest + Testing Library + MSW |

### レイヤー構成と責務

```
main.tsx
  └─ QueryClientProvider        # TanStack Query のキャッシュ共有
       └─ RouterProvider        # URL に基づくルーティング
            └─ routes/          # ルート定義（ファイル = URL パス）
                 └─ features/   # 機能ごとのモジュール
                      ├─ api/         # fetch・Zod パース
                      ├─ hooks/       # UI 状態 / サーバ状態
                      └─ components/  # 画面・部品
```

- `routes/` はルート定義のみを持ち、実装は `features/` に委譲する
- `lib/` には複数の機能をまたぐ共通部品（fetch ラッパ・QueryClient・ユーティリティ）を置く
- `components/` には機能に依存しない共通 UI を置く

### 状態管理の設計

一覧画面の状態を URL search params と TanStack Query の 2 軸で管理し、責務を分離している。

#### UI 状態 → URL search params（`useFacilitatorListState`）

検索語・ソートキー・ソート方向・ページ番号をすべて URL に持たせる。

```
ユーザ操作（検索・ソート・ページ送り）
  → useNavigate で URL を更新
  → TanStack Router が URL をパース・検証
  → フックが useSearch で読み出して UI に反映
```

#### URL を Single Source of Truth にする理由

- ブラウザバック/フォワードで状態が復元される
- URL をコピーして共有できる
- コンポーネントをまたいで `どの状態か` を props で渡す必要がない

URL は TanStack Router の `validateSearch`（Zod スキーマ）で検証され、不正な値は安全なデフォルト（`.catch(undefined)`）に落ちる。

検索語の変化はデバウンス後にページを 1 にリセットする。ソート変更時もページを同じ `navigate` 呼び出しでリセットし、余分な API リクエストを防いでいる。

#### サーバ状態 → TanStack Query（`useFacilitators`）

```typescript
queryKey: ['facilitators', query]  // クエリ条件が変わると自動で再取得
placeholderData: keepPreviousData  // 再取得中は前ページのデータを維持してちらつきを防ぐ
```

### データフロー

```
URL search params
  │
  ├─ useFacilitatorListState   # URL ↔ UI 状態の同期
  │    └─ FacilitatorQuery     # API へ渡すクエリ条件
  │
  └─ useFacilitators(query)    # TanStack Query でキャッシュ・再取得
       └─ fetchFacilitators()  # URL 組み立て → fetch → Zod パース
            └─ getJson()       # fetch ラッパ（エラーを ApiError に正規化）
```

### エラーハンドリング

`lib/http.ts` の `getJson` はネットワーク障害・非 2xx・Zod パース失敗をすべて `ApiError` に統一する。`useFacilitators` が `isError` を返したとき `FacilitatorListPage` が `ErrorDialog` を開き、ユーザがリトライできる。

## テスト

```bash
pnpm test
```

- 単体: URL 組み立て（空検索の除外）、Zod パース失敗時の挙動、UI 状態（ソート切替・ページリセット）。
- 結合（MSW で API をモック）: 読み込み→一覧表示、ページ送り、部分一致検索、ソート、空表示、
通信エラー→ダイアログ→リトライ復帰。
