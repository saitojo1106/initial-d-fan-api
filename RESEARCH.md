# 既存APIと権利面の確認

確認日: 2026-10-20。公開前に更新してください。これは実装上の判断記録であり、個別事案の法的判断ではありません。

## 既存の公開リポジトリ

GitHub CLIで`initial d api`を検索し、以下の公開リポジトリを確認しました。

| リポジトリ | 確認できた範囲 | このMVPとの関係 |
| --- | --- | --- |
| [A1EXS95/InitialD-API](https://github.com/A1EXS95/InitialD-API) | `server.js`に車両の配列と`GET /cars`。外部の作品画像URLを含む | 画像URLは流用せず、出典付きの関係データを独立に構築 |
| [kennyngdev/InitialD-API](https://github.com/kennyngdev/InitialD-API) | READMEに車両・メーカーのGET/POST/PATCH/DELETEが記載されている | 今回は読み取り専用でバトル・戦績・峠を追加 |

どちらも確認時にGitHubの`licenseInfo`は`null`でした。無ライセンスと断定せず、コードやデータはコピーしていません。この検索で全ての既存APIを網羅したとはいえません。

## 権利上の判断材料

- [文化庁の著作権FAQ](https://www.bunka.go.jp/seisaku/chosakuken/kaizoku/faq.html)は、単なるデータやアイデアと創作的な表現を区別しています。個々の短い事実を整理しても、転載した文章や画像を使えるとは限りません。
- [文化庁の二次創作解説](https://www.bunka.go.jp/seisaku/chosakuken/taisetsu/point/index.html)は、公開する二次創作では権利者のルールと許諾を確認する必要があると説明しています。
- [講談社の二次使用案内](https://www.kodansha.co.jp/copyright/)は、講談社サイト上の画像・文章・漫画・キャラクター等も著作物であると説明しています。
- [講談社の権利侵害に対する姿勢](https://www.kodansha.co.jp/inquiry/infringement)は、非営利ファン活動を一律に否定していませんが、無条件の利用許諾を示したものではありません。

コードのMITライセンスを付けても、作品や商標の利用許諾は取得できません。「ライセンスを買えば大丈夫」と一般化せず、使う素材、公開方法、用途、地域に合う許諾範囲を個別に確かめる必要があります。実装では画像・文章の転載を避け、作品の短い事実項目に絞り、非公式・非提携の注記を入れています。

## シードデータの主な確認先

- [ヤンマガWeb 名勝負列伝01](https://yanmaga.jp/columns/articles/5): 藤原拓海・高橋啓介、AE86・FD3S、秋名での対戦。
- [ヤンマガWeb 名勝負列伝02](https://yanmaga.jp/columns/articles/4)と[名勝負列伝16](https://yanmaga.jp/columns/articles/3561): 中里毅との対戦、勝敗と車種。
- [トヨタの車史](https://global.toyota/jp/detail/14095114)、[マツダの車史](https://www.mazda.com/ja/about/history/1990-1999/)、[日産のヘリテージ資料](https://www2.nissan.co.jp/HERITAGE/DETAIL/210.html): ベース車両の型式やエンジン系列など。

確認ページへのリンクは検証用です。ページの文章、写真、図版はAPIに保存していません。
