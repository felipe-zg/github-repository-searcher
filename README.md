# GitHub リポジトリ検索アプリ

GitHub Search API を利用して、キーワードから GitHub のリポジトリを検索できる Web アプリケーションです。

React と TypeScript をベースに、検索機能の実装だけでなく、責務の分離・テスト容易性・非同期処理の管理を意識して構成しています。

## 主な機能

- **キーワード検索**：リポジトリ名や関連キーワードで GitHub のリポジトリを検索
- **入力 debounce**：入力のたびに API を呼び出さず、入力停止から 400ms 後に検索を実行
- **検索結果の表示**：リポジトリ名、オーナー、説明、使用言語、スター数、フォーク数を表示
- **ページネーション**：1 ページあたり 10 件を表示し、前後のページへ移動
- **検索状態の表示**：初期状態、読み込み中、検索結果なし、エラー状態を表示
- **リクエストのキャンセル**：新しい検索が開始された場合、不要になった前のリクエストをキャンセル
- **レスポンシブなレイアウト**：画面サイズに応じて表示を調整

## 使用技術

| 分類 | 技術 |
| --- | --- |
| UI | React 19 |
| 言語 | TypeScript |
| ビルド・開発環境 | Vite |
| 状態管理 | Redux Toolkit / React Redux |
| HTTP 通信 | Axios |
| API | GitHub REST API – Search repositories |
| テスト | Vitest / React Testing Library / user-event |
| テスト環境 | jsdom |
| Lint | oxlint |
| Formatter | oxfmt |

## セットアップ

### 必要環境

- Node.js
- npm

### インストール

```bash
git clone <repository-url>
cd github-repository-searcher
npm install
```

### 環境変数

プロジェクトのルートに `.env` ファイルを作成し、GitHub Search API の URL を設定してください。

```env
VITE_GITHUB_API_URL=https://api.github.com/search/repositories
```

この URL は `src/config/env.ts` から読み込まれ、API の接続先をアプリケーションの実装から分離しています。

### 開発サーバーの起動

```bash
npm run dev
```

ターミナルに表示される URL をブラウザで開いてください。

## コマンド

| コマンド | 説明 |
| --- | --- |
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | TypeScript のビルドチェックと本番用ビルド |
| `npm run preview` | 本番ビルドをローカルでプレビュー |
| `npm test` | テストを一度実行 |
| `npm run test:coverage` | カバレッジ付きでテストを実行 |
| `npm run type-check` | TypeScript の型チェック |
| `npm run lint` | oxlint による静的解析 |
| `npm run lint:fix` | 自動修正可能な lint の問題を修正 |
| `npm run format` | oxfmt でコードを整形 |
| `npm run format:check` | コードのフォーマットを確認 |

## アーキテクチャ

依存関係と責務を分離し、UI・アプリケーション状態・ビジネス上のモデル・外部 API との通信が密結合にならないようにしています。

```text
src/
├── config/
│   └── env.ts
│
├── domain/
│   ├── models/
│   │   ├── RepositoryModel.ts
│   │   └── RepositorySearchResult.ts
│   ├── use-cases/
│   │   └── SearchRepository.ts
│   └── errors/
│
├── data/
│   ├── protocols/
│   │   └── http/
│   └── use-cases/
│       └── search-repository/
│           └── RemoteSearchRepository.ts
│
├── infra/
│   ├── github/
│   │   ├── models/
│   │   └── mappers/
│   └── http/
│       └── axios-http-client/
│
├── features/
│   └── repository-search/
│       ├── components/
│       │   ├── SearchBar/
│       │   ├── RepositoryList/
│       │   ├── RepositoryCard/
│       │   ├── Pagination/
│       │   └── SearchStatus/
│       └── hooks/
│           └── useRepositorySearch.ts
│
├── pages/
│   └── SearchPage/
│
├── state/
│   ├── githubRepository/
│   │   └── githubRepositorySlice.ts
│   ├── reducers.ts
│   ├── services.ts
│   └── store.ts
│
└── styles/
    ├── theme.css
    └── global.css
```

### 各レイヤーの役割

#### Domain

アプリケーションの中心となるモデルと契約を定義します。

- `RepositoryModel`：アプリケーション内で扱うリポジトリのデータモデル
- `RepositorySearchResult`：検索結果のモデル
- `SearchRepository`：リポジトリ検索のインターフェース

Domain は React、Redux、Axios などの具体的な実装に依存しません。

#### Data

Domain で定義されたインターフェースを利用して、検索処理を実装します。

- `RemoteSearchRepository`：HTTP クライアントを通じて GitHub API にアクセス
- HTTP protocol：通信処理に必要なインターフェースとレスポンス形式を定義

HTTP クライアントを抽象化することで、検索処理を特定の HTTP ライブラリに直接依存させない構成にしています。

#### Infra

外部サービスやライブラリとの接続など、具体的な技術実装を担当します。

- `AxiosHttpClient`：Axios を使用した HTTP GET 通信
- GitHub DTO：GitHub API のレスポンス形式を定義
- `GitHubRepositoryMapper`：API の DTO を Domain の `RepositoryModel` に変換

API 固有のデータ形式を Domain モデルから分離しています。

#### Features / Pages

画面とユーザー操作に関する実装を担当します。

- `SearchPage`：検索画面全体の構成
- `useRepositorySearch`：検索キーワード、debounce、ページ変更、検索処理の連携
- `SearchBar`：検索キーワードの入力
- `RepositoryList` / `RepositoryCard`：検索結果の表示
- `Pagination`：ページ移動
- `SearchStatus`：初期状態、読み込み中、エラー、検索結果なしの表示

#### State

Redux Toolkit を使用して、検索結果や読み込み状態などのアプリケーション状態を管理します。

- `githubRepositorySlice`：検索結果、エラー、ページ番号などを管理
- `services.ts`：Domain の検索インターフェースと具体的な Repository 実装を接続
- `store.ts`：Redux Store を構成し、サービスを thunk の `extraArgument` として注入

これにより、Redux の非同期処理から具体的な API 通信実装を切り離しています。

## 検索処理の流れ

```text
ユーザーがキーワードを入力
          │
          ▼
       SearchBar
          │
          ▼
 useRepositorySearch
          │
          ├── 400ms debounce
          │
          ▼
 Redux createAsyncThunk
          │
          ▼
  SearchRepository interface
          │
          ▼
 RemoteSearchRepository
          │
          ▼
    HttpGetClient
          │
          ▼
    AxiosHttpClient
          │
          ▼
     GitHub Search API
          │
          ▼
 GitHub Repository DTO
          │
          ▼
 GitHubRepositoryMapper
          │
          ▼
    RepositoryModel
          │
          ▼
 Redux Store → React UI
```

1. ユーザーが検索キーワードを入力すると、`useRepositorySearch` が検索条件を更新します。
2. 入力が 400ms 間停止すると、Redux の async thunk を通じて検索を開始します。
3. `RemoteSearchRepository` が HTTP クライアントを使用して GitHub Search API にリクエストを送信します。
4. API レスポンスを DTO として受け取り、Mapper でアプリケーション内部の Domain モデルに変換します。
5. 検索結果を Redux Store に反映し、React コンポーネントに表示します。

## 非同期処理と状態管理

検索時の不要な通信や古いレスポンスによる状態の不整合を防ぐため、次の対応を行っています。

- **Debounce**：入力が止まってから検索を実行し、API リクエストの頻度を抑制
- **AbortSignal**：検索条件やページが変更された際、不要になったリクエストをキャンセル
- **Request ID の確認**：現在のリクエスト ID と一致する結果だけを Redux Store に反映し、古いリクエストの結果による上書きを防止
- **状態の明示的な管理**：読み込み中・成功・失敗の状態を Redux で管理

また、GitHub Search API の検索結果表示上限を考慮し、ページ数は最大 1,000 件分までに制限しています。

## テスト

Vitest と React Testing Library を使用して、UI・状態管理・データ処理をそれぞれ検証しています。

テストファイルは対象の実装ファイルの近くに配置しています。

| 対象 | 主な確認内容 |
| --- | --- |
| `RemoteSearchRepository` | HTTP レスポンスに応じた検索結果の変換、空の検索結果、エラー処理、リクエストパラメータ |
| `GitHubRepositoryMapper` | GitHub API の DTO から Domain モデルへの変換 |
| `githubRepositorySlice` | 非同期処理の pending / fulfilled / rejected、状態更新 |
| `SearchBar` | キーワード入力とクリア操作 |
| `Pagination` | ページ移動と境界条件 |
| `SearchPage` integration | 検索入力から API 呼び出し、検索結果表示までの連携 |

テストの実行：

```bash
npm test
```

カバレッジの確認：

```bash
npm run test:coverage
```

## 設計上の意図

この課題では、検索機能を動作させることに加えて、変更やテストがしやすい構成にすることを意識しました。

- **依存関係の分離**：Domain のインターフェースを境界として、外部 API や HTTP ライブラリへの依存を内側に持ち込まない
- **DTO と Domain Model の分離**：外部 API のレスポンス形式がアプリケーション内部のモデルに直接影響しないようにする
- **依存性注入**：Repository の実装を Redux thunk の `extraArgument` 経由で渡し、テスト時に差し替え可能にする
- **コンポーネントの責務分割**：検索入力、結果表示、ページネーション、状態表示を個別のコンポーネントとして管理する
- **非同期処理の安全性**：リクエストのキャンセルと Request ID の確認により、検索条件が連続して変わる場合にも状態の整合性を保つ

## API

本アプリケーションは GitHub REST API の Search repositories エンドポイントを使用します。

- [GitHub REST API – Search repositories](https://docs.github.com/en/rest/search/search#search-repositories)

API の接続先は `VITE_GITHUB_API_URL` で設定できます。
