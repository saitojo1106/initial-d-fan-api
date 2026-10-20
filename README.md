# Initial D Fan API

頭文字Dのキャラクター、車種、峠、バトルを参照できる非公式・非提携の読み取り専用REST APIです。Hono + TypeScriptで動き、OpenAPI 3.1仕様とScalarのドキュメント画面を提供します。講談社、しげの秀一氏、自動車メーカーその他の権利者による公認・後援はありません。

このMVPにはキャラクター3件、車種3件、峠名2件、バトル2件、出典6件のみを収録しています。画像、ロゴ、作中の文章、台詞、地図、座標、MFゴーストのデータは含めていません。

## 起動

[Bun](https://bun.sh/)をインストールした環境で実行します。

```sh
bun install --frozen-lockfile
bun run check
bun run dev
```

APIドキュメント: http://localhost:3000/docs

OpenAPI JSON: http://localhost:3000/openapi.json

例:

```sh
curl 'http://localhost:3000/api/v1/characters?q=藤原'
curl 'http://localhost:3000/api/v1/battles?characterId=takumi-fujiwara&passId=akina'
```

`PORT=4000 bun start`でポートを変更できます。Scalarの画面表示には配信元の外部アセットへの接続が必要です。API本体とOpenAPI JSONはローカルで動きます。

## エンドポイント

| メソッド | パス | 内容 |
| --- | --- | --- |
| GET | `/api/v1/characters` | 一覧。`q`で名前またはIDを部分検索 |
| GET | `/api/v1/characters/{id}` | キャラクターと収録済みバトルだけから計算した戦績 |
| GET | `/api/v1/vehicles` | 車種一覧とベース車両の確認済み仕様 |
| GET | `/api/v1/vehicles/{id}` | 車種詳細 |
| GET | `/api/v1/passes` | 作中の峠名一覧。位置情報は含まない |
| GET | `/api/v1/passes/{id}` | 峠名詳細 |
| GET | `/api/v1/battles` | バトル一覧。`characterId`と`passId`で絞り込み可能 |
| GET | `/api/v1/battles/{id}` | 参加者、車種、峠、勝者を参照 |
| GET | `/api/v1/sources` | 出典一覧 |

一覧は `{ "data": [...], "count": 数 }`、詳細は `{ "data": {...} }`、見つからない詳細は404と `{ "error": { "code": "NOT_FOUND", "message": "..." } }`を返します。IDは安定した英字スラッグです。バトルの`participants`は各参加者の`characterId`と`vehicleId`を持ち、`passId`と`winnerCharacterId`で関係を表します。

`record`は**このリポジトリに収録したバトルの集計**であり、作品全体の通算戦績ではありません。車種の`specifications`は実在するベース車両の一般的な型式・エンジン系列等で、作中車両の改造状態や出力値を表しません。確認できない仕様は省略します。

## データと出典

データは [`data/catalog.json`](data/catalog.json) にあります。各項目の`sourceIds`が`/api/v1/sources`の出典を指します。出典URL、発行元、確認日を保持し、起動時にスキーマ、IDの重複、参照先、バトルの参加者と勝者を検証します。シードデータの勝敗はヤンマガWebの名勝負記事、車種の一般仕様は自動車メーカーの資料で照合しました。文章は転載せず、短い事実項目として入力しています。追加ルールは [`CONTRIBUTING.md`](CONTRIBUTING.md) を参照してください。

## 権利と公開前の確認

このリポジトリのMITライセンスは、このプロジェクト独自のコードなど寄稿者が権利を持つ部分に適用します。作品、キャラクター、作品名、商標、出版社や自動車メーカーの文章・画像への利用許諾を与えるものではありません。出典へのリンクや非公式表記だけで第三者の権利処理が完了するわけでもありません。画像・ロゴ・コマ・台詞・長いあらすじは登録しない方針です。ホスティング、営利利用、大規模なデータ拡張の前には、利用方法に応じて権利者の条件を確認してください。

既存APIと権利面の確認内容は [`RESEARCH.md`](RESEARCH.md) にまとめました。このMVPはローカルの実行可能プロジェクトとして用意しており、外部への公開・GitHubへのpushは行っていません。
