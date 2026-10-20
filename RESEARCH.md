# 既存APIと権利面の確認

確認日: 2026-10-20。データや利用形態を広げる際に更新してください。これは実装上の判断記録であり、個別事案の法的判断ではありません。

## 既存の公開リポジトリ

GitHub CLIで`initial d api`を検索し、以下の公開リポジトリを確認しました。

| リポジトリ | 確認できた範囲 | このMVPとの関係 |
| --- | --- | --- |
| [A1EXS95/InitialD-API](https://github.com/A1EXS95/InitialD-API) | `server.js`に車両の配列と`GET /cars`。外部の作品画像URLを含む | 画像URLは流用せず、出典付きの関係データを独立に構築 |
| [kennyngdev/InitialD-API](https://github.com/kennyngdev/InitialD-API) | READMEに車両・メーカーのGET/POST/PATCH/DELETEが記載されている | 今回は読み取り専用でバトル・戦績・峠を追加 |

どちらも確認時にGitHubの`licenseInfo`は`null`でした。無ライセンスと断定せず、コードやデータはコピーしていません。この検索で全ての既存APIを網羅したとはいえません。

[One Piece API](https://www.onepieceapi.com/)もキャラクター等のREST APIを公開し、サイト上ではMITライセンスと権利者への帰属を掲げています。ただし、別作品のAPIが公開されている事実やMIT表記は、本プロジェクトに『頭文字D』の利用許諾を与えるものではありません。公開ページだけでそのAPIの権利処理の有無も判断できません。

## 権利上の判断材料

- [文化庁の著作権FAQ](https://www.bunka.go.jp/seisaku/chosakuken/kaizoku/faq.html)は、単なるデータやアイデアと創作的な表現を区別しています。個々の短い事実を整理しても、転載した文章や画像を使えるとは限りません。
- [文化庁の二次創作解説](https://www.bunka.go.jp/seisaku/chosakuken/taisetsu/point/index.html)は、公開する二次創作では権利者のルールと許諾を確認する必要があると説明しています。
- [講談社の二次使用案内](https://www.kodansha.co.jp/copyright/)は、講談社サイト上の画像・文章・漫画・キャラクター等も著作物であると説明しています。
- [講談社の権利侵害に対する姿勢](https://www.kodansha.co.jp/inquiry/infringement)は、非営利ファン活動を一律に否定していませんが、無条件の利用許諾を示したものではありません。

勝者IDや対戦相手のような短い事実項目と、台詞・コマ・記事本文・詳細な筋書きの再現を区別します。前者も具体的な利用形態に関する権利上の判断が常に不要という意味ではありません。First Stageの勝敗は、確認できたドライバー対戦だけに限定して記録します。

コードのMITライセンスを付けても、作品や商標の利用許諾は取得できません。「ライセンスを買えば大丈夫」と一般化せず、使う素材、公開方法、用途、地域に合う許諾範囲を個別に確かめる必要があります。実装では画像・文章の転載を避け、作品の短い事実項目に絞り、非公式・非提携の注記を入れています。

## シードデータの主な確認先

- [バンダイチャンネルのFirst Stage各話案内](https://www.b-ch.com/titles/4405/): 収録する対戦がFirst Stageに含まれることと登場人物・コースを照合。
- [ヤンマガWeb 名勝負列伝01](https://yanmaga.jp/columns/articles/5)、[02](https://yanmaga.jp/columns/articles/4)、[03](https://yanmaga.jp/columns/articles/8)、[16](https://yanmaga.jp/columns/articles/3561)、[17](https://yanmaga.jp/columns/articles/3616): 拓海の対戦相手・車種・勝敗を照合。
- [ヤンマガWeb シルエイティ編](https://yanmaga.jp/columns/articles/479)と[中里毅編](https://yanmaga.jp/columns/articles/2639): 碓氷戦と啓介対中里戦の参加者・勝敗を照合。
- [トヨタの車史](https://global.toyota/jp/detail/14095114)、[マツダのRX-7資料](https://www.mazda.com/ja/about/history/greatcar/rx-7/02/)、[日産のヘリテージ資料](https://www.nissan.co.jp/HERITAGE/DETAIL/198.html)、[ホンダのCIVIC資料](https://www.honda.co.jp/factbook/auto/CIVIC/19910910/cv91-013.html): ベース車両の確認できた型式やエンジン系列など。

確認ページへのリンクは検証用です。ページの文章、写真、図版はAPIに保存していません。
