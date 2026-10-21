# Second Stageの収録方針と出典対応

確認日: 2026-10-21。外部Wikiやゲームの勝敗表は取り込みません。以下は公開資料から確認した短い事実項目で、文章・画像・台詞は転載していません。

## 対戦

| ID | ドライバーと車種 | 峠 | 勝者 | 出典の対応 |
| --- | --- | --- | --- | --- |
| `nakazato-vs-seiji-myogi` | 中里毅 / GT-R、岩城清次 / エボIV | 妙義 | 岩城清次 | [Second Stage](https://www.b-ch.com/titles/4406/) ACT.1–2の中里戦と清次の勝利、[名勝負04](https://yanmaga.jp/columns/articles/6)のGT-R敗戦と清次の車種。妙義の既存資料は`myogi.sourceIds`も参照 |
| `takumi-vs-seiji-akina` | 藤原拓海 / トレノ、岩城清次 / エボIV | 秋名 | 藤原拓海 | [名勝負04](https://yanmaga.jp/columns/articles/6)、[名勝負05](https://yanmaga.jp/columns/articles/2)の清次敗戦、Second Stage ACT.3–4 |
| `takumi-vs-kyoichi-akagi` | 藤原拓海 / トレノ、須藤京一 / エボIII | 赤城 | 須藤京一 | [京一人物列伝](https://yanmaga.jp/columns/articles/2717)、Second Stage ACT.5–6（赤城、エボ3、エンジンブロー） |
| `ryosuke-vs-kyoichi-akagi` | 高橋涼介 / FC、須藤京一 / エボIII | 赤城 | 高橋涼介 | [名勝負05](https://yanmaga.jp/columns/articles/2)、[涼介人物列伝](https://yanmaga.jp/columns/articles/3085)、Second Stage ACT.7 |
| `takumi-vs-wataru-shomaru` | 藤原拓海 / トレノ、秋山渉 / レビン | 正丸 | 藤原拓海 | [名勝負06](https://yanmaga.jp/columns/articles/65)の車種と勝者、Second Stage ACT.12の峠名、ACT.13の決着 |

バンダイチャンネルは確認中にメンテナンス表示へ切り替わったため、公開ページの検索インデックスに残る各話案内も照合しています。作品全編の視聴による検証ではありません。出版社の記事とアニメの公開案内を組み合わせ、アニメのSecond Stageで描かれる対戦だけを分類しています。出版社の記事には原作とアニメでの順序の違いや車種の誤記もあるため、アニメのStage区分は配信元案内を優先します。

## 車両仕様

- エボIII・IVは[三菱自動車の車の歴史](https://www.mitsubishi-motors.com/jp/company/history/car/)でエンジン系列`4G63`を確認。4WDは作品紹介・メーカー資料を照合。今回確認した資料で車台型式を確定できないため、`chassisCode`は省略しました。量産車の仕様を示し、作中の改造状態・出力・ミスファイアリングシステムは表現しません。
- レビンは名勝負06で登場車種を確認し、[トヨタの歴史資料](https://global.toyota/jp/detail/14095114)でAE86・4A-G・FRを確認。渉のターボ仕様とベース車両の仕様を区別します。

## 集計と対象外

- 京一対拓海の赤城戦はエンジンブローによる走行終了を京一勝利として登録します。正式競技の裁定を意味しません。
- 正丸で繰り返された走行は、決着した一連の対戦を1件として扱います。
- Third Stageのいろは坂での再戦、Battle Stageの啓介対清次追加映像、回想の京一対涼介の過去戦、相手ドライバーを資料で確定できない遠征戦は追加しません。
- キャラクターの`record`はFirst StageとSecond Stageの全収録対戦を合算。Stage別の成績が必要なら、バトル一覧の`stage`と`characterId`を指定して取得してください。
